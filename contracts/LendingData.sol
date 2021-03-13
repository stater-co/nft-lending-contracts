// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
interface Geyser{ function totalStakedFor(address addr) external view returns(uint256); }

contract LendingData is ERC721Holder, ERC1155Holder, Ownable {
  using SafeMath for uint256;
  enum TimeScale{ MINUTES, HOURS, DAYS, WEEKS }
  address public nftAddress; //0xcb13DC836C2331C669413352b836F1dA728ce21c
  address[] public geyserAddressArray; //[0xf1007ACC8F0229fCcFA566522FC83172602ab7e3]
  address public promissoryNoteContractAddress;
  uint256[] public staterNftTokenIdArray; //[0, 1]
  uint32 public discountNft = 50;
  uint32 public discountGeyser = 5;
  uint32 public lenderFee = 100;
  uint256 public loanID;
  uint256 public ltv = 600; // 60%
  uint256 public installmentFrequency = 1;
  TimeScale public installmentTimeScale = TimeScale.WEEKS;
  uint256 public interestRate = 20;
  uint256 public interestRateToStater = 40;
  event NewLoan(uint256 indexed loanId, address indexed owner, uint256 creationDate, address indexed currency, Status status, string creationId);
  event LoanApproved(uint256 indexed loanId, address indexed lender, uint256 approvalDate, uint256 loanPaymentEnd, Status status);
  event LoanCancelled(uint256 indexed loanId, uint256 cancellationDate, Status status);
  event ItemsWithdrawn(uint256 indexed loanId, address indexed requester, Status status);
  event LoanPayment(uint256 indexed loanId, uint256 paymentDate, uint256 installmentAmount, uint256 amountPaidAsInstallmentToLender, uint256 interestPerInstallement, uint256 interestToStaterPerInstallement, Status status);
  enum Status{ UNINITIALIZED, LISTED, APPROVED, DEFAULTED, LIQUIDATED, CANCELLED, WITHDRAWN }
  enum TokenType{ ERC721, ERC1155 }
  struct Loan {
    address[] nftAddressArray; // the adderess of the ERC721
    address payable borrower; // the address who receives the loan
    address payable lender; // the address who gives/offers the loan to the borrower
    address currency; // the token that the borrower lends, address(0) for ETH
    Status status; // the loan status
    uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
    uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
    uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
    uint256 loanStart; // the point when the loan is approved
    uint256 loanEnd; // the point when the loan is approved to the point when it must be paid back to the lender
    uint256 nrOfInstallments; // the number of installments that the borrower must pay.
    uint256 installmentAmount; // amount expected for each installment
    uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
    uint256 paidAmount; // the amount that has been paid back to the lender to date
    uint256 defaultingLimit; // the number of installments allowed to be missed without getting defaulted
    uint256 nrOfPayments; // the number of installments paid
    TokenType[] nftTokenTypeArray; // the token types : ERC721 , ERC1155 , ...
  }
  mapping(uint256 => Loan) public loans;
  mapping(uint256 => address) public promissoryPermissions;

  constructor(address _nftAddress, address _promissoryNoteContractAddress, address[] memory _geyserAddressArray, uint256[] memory _staterNftTokenIdArray) {
    nftAddress = _nftAddress;
    geyserAddressArray = _geyserAddressArray;
    staterNftTokenIdArray = _staterNftTokenIdArray;
    promissoryNoteContractAddress = _promissoryNoteContractAddress;
  }

  // Borrower creates a loan
  function createLoan(
    uint256 loanAmount,
    uint256 nrOfInstallments,
    address currency,
    uint256 assetsValue, 
    address[] calldata nftAddressArray, 
    uint256[] calldata nftTokenIdArray,
    string calldata creationId,
    TokenType[] memory nftTokenTypeArray
  ) external {
    require(nrOfInstallments > 0, "Loan must have at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(nftAddressArray.length > 0, "Loan must have atleast 1 NFT");
    require(nftAddressArray.length == nftTokenIdArray.length && nftTokenIdArray.length == nftTokenTypeArray.length, "NFT provided informations are missing or incomplete");

    // Compute loan to value ratio for current loan application
    require(_percent(loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");

    // Computing the defaulting limit
    if ( nrOfInstallments <= 3 )
        loans[loanID].defaultingLimit = 1;
    else if ( nrOfInstallments <= 5 )
        loans[loanID].defaultingLimit = 2;
    else if ( nrOfInstallments >= 6 )
        loans[loanID].defaultingLimit = 3;

    // Set loan fields
    loans[loanID].nftTokenIdArray = nftTokenIdArray;
    loans[loanID].loanAmount = loanAmount;
    loans[loanID].assetsValue = assetsValue;
    loans[loanID].amountDue = loanAmount.mul(interestRate.add(100)).div(100); // interest rate >> 20%
    loans[loanID].nrOfInstallments = nrOfInstallments;
    loans[loanID].installmentAmount = loans[loanID].amountDue.mod(nrOfInstallments) > 0 ? loans[loanID].amountDue.div(nrOfInstallments).add(1) : loans[loanID].amountDue.div(nrOfInstallments);
    loans[loanID].status = Status.LISTED;
    loans[loanID].nftAddressArray = nftAddressArray;
    loans[loanID].borrower = msg.sender;
    loans[loanID].currency = currency;
    loans[loanID].nftTokenTypeArray = nftTokenTypeArray;
 
    // Transfer the items from lender to stater contract
    _transferItems(
        msg.sender, 
        address(this), 
        nftAddressArray, 
        nftTokenIdArray,
        nftTokenTypeArray
    );

    // Fire event
    emit NewLoan(loanID, msg.sender, block.timestamp, currency, Status.LISTED, creationId);
    ++loanID;
  }

  // Lender approves a loan
  function approveLoan(uint256 loanId) external payable {
    require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
    require(loans[loanId].paidAmount == 0, "This loan is currently not ready for lenders");
    require(loans[loanId].status == Status.LISTED, "This loan is not currently ready for lenders, check later");
    
    uint256 discount = calculateDiscount(msg.sender);
    
    // We check if currency is ETH
    if ( loans[loanId].currency == address(0) )
      require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discount)),"Not enough currency");

    // Borrower assigned , status is 1 , first installment ( payment ) completed
    loans[loanId].lender = msg.sender;
    loans[loanId].loanEnd = block.timestamp.add(loans[loanId].nrOfInstallments.mul(generateInstallmentFrequency()));
    loans[loanId].status = Status.APPROVED;
    loans[loanId].loanStart = block.timestamp;

    // We send the tokens here
    _transferTokens(msg.sender,loans[loanId].borrower,loans[loanId].currency,loans[loanId].loanAmount,loans[loanId].loanAmount.div(lenderFee).div(discount));

    emit LoanApproved(
      loanId,
      msg.sender,
      block.timestamp,
      loans[loanId].loanEnd,
      Status.APPROVED
    );
  }

  // Borrower cancels a loan
  function cancelLoan(uint256 loanId) external {
    require(loans[loanId].lender == address(0), "The loan has a lender , it cannot be cancelled");
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status != Status.CANCELLED, "This loan is already cancelled");
    require(loans[loanId].status == Status.LISTED, "This loan is no longer cancellable");
    
    // We set its validity date as block.timestamp
    loans[loanId].loanEnd = block.timestamp;
    loans[loanId].status = Status.CANCELLED;

    // We send the items back to him
    _transferItems(
      address(this), 
      loans[loanId].borrower, 
      loans[loanId].nftAddressArray, 
      loans[loanId].nftTokenIdArray,
      loans[loanId].nftTokenTypeArray
    );

    emit LoanCancelled(
      loanId,
      block.timestamp,
      Status.CANCELLED
    );
  }
  
  // Borrower pays installment for loan
  // Multiple installments : OK
  function payLoan(uint256 loanId) external payable {
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status == Status.APPROVED, "This loan is no longer in the approval phase, check its status");
    require(loans[loanId].loanEnd >= block.timestamp, "Loan validity expired");
    require((msg.value > 0 && loans[loanId].currency == address(0) ) || ( loans[loanId].currency != address(0) && msg.value == 0), "Insert the correct tokens");
    
    uint256 paidByBorrower = msg.value > 0 ? msg.value : loans[loanId].installmentAmount;
    uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
    uint256 interestPerInstallement = paidByBorrower.mul(interestRate).div(100); // entire interest for installment
    uint256 discount = calculateDiscount(msg.sender);
    uint256 interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100);

    if ( discount != 1 ){
        if ( loans[loanId].currency == address(0) ){
            require(msg.sender.send(interestToStaterPerInstallement.div(discount)),"Discount returnation failed");
            amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement.div(discount));
        }
        interestToStaterPerInstallement = interestToStaterPerInstallement.sub(interestToStaterPerInstallement.div(discount));
    }
    amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement);

    loans[loanId].paidAmount = loans[loanId].paidAmount.add(paidByBorrower);
    loans[loanId].nrOfPayments = loans[loanId].nrOfPayments.add(paidByBorrower.div(loans[loanId].installmentAmount));

    if (loans[loanId].paidAmount >= loans[loanId].amountDue)
      loans[loanId].status = Status.LIQUIDATED;

    // We transfer the tokens to borrower here
    _transferTokens(msg.sender,loans[loanId].lender,loans[loanId].currency,amountPaidAsInstallmentToLender,interestToStaterPerInstallement);

    emit LoanPayment(
      loanId,
      block.timestamp,
      msg.value,
      amountPaidAsInstallmentToLender,
      interestPerInstallement,
      interestToStaterPerInstallement,
      loans[loanId].status
    );
  }

  // Borrower can withdraw loan items if loan is LIQUIDATED
  // Lender can withdraw loan item is loan is DEFAULTED
  function terminateLoan(uint256 loanId) external {
    require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender, "You can't access this loan");
    require((block.timestamp >= loans[loanId].loanEnd || loans[loanId].paidAmount >= loans[loanId].amountDue) || lackOfPayment(loanId), "Not possible to finish this loan yet");
    require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED, "Incorrect state of loan");
    require(loans[loanId].status != Status.WITHDRAWN,"Loan NFTs already withdrawn");

    if ( lackOfPayment(loanId) ) {
      loans[loanId].status = Status.WITHDRAWN;
      loans[loanId].loanEnd = block.timestamp;
      // We send the items back to lender
      _transferItems(
        address(this),
        loans[loanId].lender,
        loans[loanId].nftAddressArray,
        loans[loanId].nftTokenIdArray,
        loans[loanId].nftTokenTypeArray
      );
    } else {
      if ( block.timestamp >= loans[loanId].loanEnd && loans[loanId].paidAmount < loans[loanId].amountDue ) {
        loans[loanId].status = Status.WITHDRAWN;
        // We send the items back to lender
        _transferItems(
          address(this),
          loans[loanId].lender,
          loans[loanId].nftAddressArray,
          loans[loanId].nftTokenIdArray,
          loans[loanId].nftTokenTypeArray
        );
      } else if ( loans[loanId].paidAmount >= loans[loanId].amountDue ){
        loans[loanId].status = Status.WITHDRAWN;
        // We send the items back to borrower
        _transferItems(
          address(this),
          loans[loanId].borrower,
          loans[loanId].nftAddressArray,
          loans[loanId].nftTokenIdArray,
          loans[loanId].nftTokenTypeArray
        );
      }
    }
    
    emit ItemsWithdrawn(
      loanId,
      msg.sender,
      loans[loanId].status
    );
  }
  
  function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) external {
      require(msg.sender == promissoryNoteContractAddress,"You're not whitelisted to access this method");
      for (uint256 i = 0; i < loanIds.length; ++i) {
        require(loans[loanIds[i]].lender != address(0),"One of the loans is not approved yet");
        require(promissoryPermissions[loanIds[i]] == msg.sender,"You're not allowed to perform this operation on loan");
        loans[loanIds[i]].lender = newOwner;
      }
  }
  
  function setPromissoryPermissions(uint256[] calldata loanIds) external {
      for (uint256 i = 0; i < loanIds.length; ++i) {
          require(loans[loanIds[i]].lender == msg.sender,"You're not the lender of this loan");
          promissoryPermissions[loanIds[i]] = promissoryNoteContractAddress;
      }
  }

  function calculateDiscount(address requester) public view returns(uint256){
    for (uint i = 0; i < staterNftTokenIdArray.length; ++i)
	    if ( IERC1155(nftAddress).balanceOf(requester,staterNftTokenIdArray[i]) > 0 )
		    return uint256(100).div(discountNft);
	  for (uint256 i = 0; i < geyserAddressArray.length; ++i)
	    if ( Geyser(geyserAddressArray[i]).totalStakedFor(requester) > 0 )
		    return uint256(100).div(discountGeyser);
	  return 1;
  }

  function getLoanApprovalCost(uint256 loanId) external view returns(uint256) {
    return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(calculateDiscount(msg.sender)));
  }
  
  function getLoanRemainToPay(uint256 loanId) external view returns(uint256) {
    return loans[loanId].amountDue.sub(loans[loanId].paidAmount);
  }
  
  function getLoanInstallmentCost(
      uint256 loanId,
      uint256 nrOfInstallments
  ) external view returns(
      uint256 overallInstallmentAmount,
      uint256 interestPerInstallement,
      uint256 interestDiscounted,
      uint256 interestToStaterPerInstallement,
      uint256 amountPaidAsInstallmentToLender
  ) {
    require(nrOfInstallments <= loans[loanId].nrOfInstallments,"Number of installments too high");
    uint256 discount = calculateDiscount(msg.sender);
    interestDiscounted = 0;
    
    overallInstallmentAmount = uint256(loans[loanId].installmentAmount.mul(nrOfInstallments));
    interestPerInstallement = uint256(overallInstallmentAmount.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments));
    interestDiscounted = interestPerInstallement.mul(interestRateToStater).div(100).div(discount); // amount of interest saved per installment
    interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100).sub(interestDiscounted);
    amountPaidAsInstallmentToLender = interestPerInstallement.mul(uint256(100).sub(interestRateToStater)).div(100); 
  }
  
  function lackOfPayment(uint256 loanId) public view returns(bool) {
    return loans[loanId].status == Status.APPROVED && loans[loanId].loanStart.add(loans[loanId].nrOfPayments.mul(generateInstallmentFrequency())) <= block.timestamp.sub(loans[loanId].defaultingLimit.mul(generateInstallmentFrequency()));
  }

  function generateInstallmentFrequency() public view returns(uint256){
    if (installmentTimeScale == TimeScale.MINUTES) {
      return 1 minutes;  
    } else if (installmentTimeScale == TimeScale.HOURS) {
      return 1 hours;
    } else if (installmentTimeScale == TimeScale.DAYS) {
      return 1 days;
    }
    return 1 weeks;
  }
  
  function setDiscounts(uint32 _discountNft, uint32 _discountGeyser, address[] calldata _geyserAddressArray, uint256[] calldata _staterNftTokenIdArray, address _nftAddress) external onlyOwner {
    discountNft = _discountNft;
    discountGeyser = _discountGeyser;
    geyserAddressArray = _geyserAddressArray;
    staterNftTokenIdArray = _staterNftTokenIdArray;
    nftAddress = _nftAddress;
  }
  
  function setGlobalVariables(address _promissoryNoteContractAddress, uint256 _ltv, uint256 _installmentFrequency, TimeScale _installmentTimeScale, uint256 _interestRate, uint256 _interestRateToStater, uint32 _lenderFee) external onlyOwner {
    ltv = _ltv;
    installmentFrequency = _installmentFrequency;
    installmentTimeScale = _installmentTimeScale;
    interestRate = _interestRate;
    interestRateToStater = _interestRateToStater;
    lenderFee = _lenderFee;
    promissoryNoteContractAddress = _promissoryNoteContractAddress;
  }
  
  function addGeyserAddress(address geyserAddress) external onlyOwner {
      geyserAddressArray.push(geyserAddress);
  }
  
  function addNftTokenId(uint256 nftId) external onlyOwner {
      staterNftTokenIdArray.push(nftId);
  }

  // Calculates loan to value ratio
  function _percent(uint256 numerator, uint256 denominator) internal pure returns(uint256) {
    return numerator.mul(10000).div(denominator).add(5).div(10);
  }

  // Transfer items fron an account to another
  function _transferItems(
    address from, 
    address to, 
    address[] memory nftAddressArray, 
    uint256[] memory nftTokenIdArray,
    TokenType[] memory nftTokenTypeArray
  ) internal {
    uint256 length = nftAddressArray.length;
    require(length == nftTokenIdArray.length && nftTokenTypeArray.length == length, "Token infos provided are invalid");
    for(uint256 i = 0; i < length; ++i) 
        if ( nftTokenTypeArray[i] == TokenType.ERC721 )
            IERC721(nftAddressArray[i]).safeTransferFrom(
                from,
                to,
                nftTokenIdArray[i]
            );
        else
            IERC1155(nftAddressArray[i]).safeTransferFrom(
                from,
                to,
                nftTokenIdArray[i],
                1,
                '0x00'
            );
  }

  function _transferTokens(
      address from,
      address payable to,
      address currency,
      uint256 qty1,
      uint256 qty2
  ) internal {
      if ( currency != address(0) ){
          require(IERC20(currency).transferFrom(
              from,
              to, 
              qty1
          ), "Transfer of tokens to receiver failed");
          require(IERC20(currency).transferFrom(
              from,
              owner(), 
              qty2
          ), "Transfer of tokens to Stater failed");
      }else{
          require(to.send(qty1),"Transfer of ETH to receiver failed");
          require(payable(owner()).send(qty2),"Transfer of ETH to Stater failed");
      }
  }

}