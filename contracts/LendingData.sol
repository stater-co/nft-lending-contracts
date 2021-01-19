// SPDX-License-Identifier: MIT

/* 
 * Stater.co
 */
pragma solidity 0.7.4;


import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


interface Geyser {
    function totalStakedFor(address addr) public view returns(uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns(bool);
}

interface ERC1155Token {
    function balanceOf(address account, uint256 id) external view returns(uint256);
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}


contract LendingData is ERC721Holder, Ownable, ReentrancyGuard {

  using SafeMath for uint256;

  Geyser public geyser;
  ERC1155Token public erc1155token;
  
  uint256 public communityTokenId;
  uint256 public founderTokenId;
  uint256 public geyserTokenId;
  uint256 public loanID;
  uint256 public ltv = 600; // 60%
  uint256 public installmentFrequency = 7; // days
  uint256 public interestRate = 20;
  uint256 public interestRateToStater = 40;
  address public staterNftAddress;
  address public staterFtAddress;

  event NewLoan(uint256 indexed loanId, address indexed owner, uint256 creationDate, address indexed currency, Status status, string creationId);
  event LoanApproved(uint256 indexed loanId, address indexed lender, uint256 approvalDate, uint256 loanPaymentEnd, Status status);
  event LoanCancelled(uint256 indexed loanId, uint256 cancellationDate, Status status);
  event ItemsWithdrawn(uint256 indexed loanId, address indexed requester, Status status);
  event LoanPayment(uint256 indexed loanId, uint256 paymentDate, uint256 installmentAmount, uint256 amountPaidAsInstallmentToLender, uint256 interestPerInstallement, uint256 interestToStaterPerInstallement, Status status);
  event LtvChanged(uint256 newLTV);

  enum Status {
    UNINITIALIZED,
    LISTED,
    APPROVED,
    DEFAULTED, 
    LIQUIDATED,
    CANCELLED
  }
  
  enum TokenType {
      ERC721,
      ERC1155
  }
  
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
  
  constructor(address tokenGeyser, address erc1155Token) {
      geyser = Geyser(tokenGeyser);
      erc1155token = ERC1155Token(erc1155Token);
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
    require(nrOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");

    // Compute loan to value ratio for current loan application
    require(_percent(loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");

    // Transfer the items from lender to stater contract
    _transferItems(
        msg.sender, 
        address(this), 
        nftAddressArray, 
        nftTokenIdArray,
        nftTokenTypeArray
    );

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
    loans[loanID].installmentAmount = loans[loanID].amountDue.div(nrOfInstallments);
    loans[loanID].status = Status.LISTED;
    loans[loanID].nftAddressArray = nftAddressArray;
    loans[loanID].borrower = msg.sender;
    loans[loanID].currency = currency;
    loans[loanID].nftTokenTypeArray = nftTokenTypeArray;
 
    // Fire event
    emit NewLoan(loanID, msg.sender, block.timestamp, currency, Status.LISTED, creationId);
    ++loanID;
  }


  // Lender approves a loan
  function approveLoan(uint256 loanId) external payable {
    require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
    require(loans[loanId].paidAmount == 0, "This loan is currently not ready for lenders");
    require(loans[loanId].status == Status.LISTED, "This loan is not currently ready for lenders, check later");
    
    uint32 discount = 100;
    
    if ( erc1155token.balanceOf(msg.sender,founderTokenId) > 0 )
        discount = 200;
    else if ( erc1155token.balanceOf(msg.sender,communityTokenId) > 0 )
        discount = 115;
    else if ( geyser.totalStakedFor(msg.sender) > 0 )
        discount = 105;
    
    // We check if currency is ETH
    if ( loans[loanId].currency == address(0) )
      require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(discount)),"Not enough currency");

    // We send the tokens here
    _transferTokens(msg.sender,loans[loanId].borrower,loans[loanId].currency,loans[loanId].loanAmount,loans[loanId].loanAmount.div(discount));

    // Borrower assigned , status is 1 , first installment ( payment ) completed
    loans[loanId].lender = msg.sender;
    loans[loanId].loanEnd = block.timestamp.add(loans[loanId].nrOfInstallments.mul(installmentFrequency).mul(1 days));
    loans[loanId].status = Status.APPROVED;
    loans[loanId].loanStart = block.timestamp;

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
      loans[loanId].nftTokenTypesArray
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

    uint256 interestPerInstallement; // entire interest for installment
    uint256 interestToStaterPerInstallement; // amount of interest that goes to Stater on each installment
    uint256 amountPaidAsInstallmentToLender; // amount of installment that goes to lender

    uint32 discount = 100;
    
    if ( erc1155token.balanceOf(msg.sender,founderTokenId) > 0 )
        discount = 200;
    else if ( erc1155token.balanceOf(msg.sender,communityTokenId) > 0 )
        discount = 115;
    else if ( geyser.totalStakedFor(msg.sender) > 0 )
        discount = 105;

    // Custom tokens
    if ( loans[loanId].currency != address(0) ) {

      interestPerInstallement = loans[loanId].installmentAmount.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments);
      interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(discount);
      amountPaidAsInstallmentToLender = loans[loanId].installmentAmount.sub(interestToStaterPerInstallement);

    } else {

      require(msg.value >= loans[loanId].installmentAmount, "Not enough currency");

      interestPerInstallement = msg.value.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments);
      interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(discount);
      amountPaidAsInstallmentToLender = msg.value.sub(interestToStaterPerInstallement);

    }
    
    // We send the tokens here
    _transferTokens(msg.sender,loans[loanId].lender,loans[loanId].currency,amountPaidAsInstallmentToLender,interestToStaterPerInstallement);

    loans[loanId].paidAmount = loans[loanId].paidAmount.add(interestToStaterPerInstallement).add(amountPaidAsInstallmentToLender);
    loans[loanId].nrOfPayments = loans[loanId].paidAmount.div(loans[loanId].installmentAmount);

    if (loans[loanId].paidAmount >= loans[loanId].amountDue)
      loans[loanId].status = Status.LIQUIDATED;

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
  function withdrawItems(uint256 loanId) external {
    require(block.timestamp >= loans[loanId].loanEnd || loans[loanId].paidAmount >= loans[loanId].amountDue, "The loan is not finished yet");
    require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED, "Incorrect state of loan");

    if ( block.timestamp >= loans[loanId].loanEnd && loans[loanId].paidAmount < loans[loanId].amountDue ) {

      loans[loanId].status = Status.DEFAULTED;
      
      // We send the items back to him
      _transferItems(
        address(this),
        loans[loanId].lender,
        loans[loanId].nftAddressArray,
        loans[loanId].nftTokenIdArray,
        loans[loanId].nftTokenTypesArray
      );

    } else if ( loans[loanId].paidAmount >= loans[loanId].amountDue ) {

      // Otherwise the lender will receive the items
      _transferItems(
        address(this),
        loans[loanId].borrower,
        loans[loanId].nftAddressArray,
        loans[loanId].nftTokenIdArray,
        loans[loanId].nftTokenTypesArray
      );
        
    }

    emit ItemsWithdrawn(
      loanId,
      msg.sender,
      loans[loanId].status
    );

  }

  function terminateLoan(uint256 loanId) external {
    require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender, "You can't access this loan");
    require(loans[loanId].status == Status.APPROVED, "Loan must be approved");
    require(lackOfPayment(loanId), "Borrower still has time to pay his installments");

    // The lender will take the items
    _transferItems(
      address(this),
      loans[loanId].lender,
      loans[loanId].nftAddressArray,
      loans[loanId].nftTokenIdArray,
      loans[loanId].nftTokenTypesArray
    );

    loans[loanId].status = Status.DEFAULTED;
    loans[loanId].loanEnd = block.timestamp;

  }
  

  // Internal Functions 

  // Calculates loan to value ratio
  function _percent(uint256 numerator, uint256 denominator) internal pure returns(uint256) {
    return numerator.mul(10 ** 4).div(denominator).add(5).div(10);
  }

  // Transfer items fron an account to another
  // Requires approvement
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
                ""
            );
  }

  function _transferTokens(
      address from,
      address payable to,
      address currency,
      uint256 quantity1,
      uint256 quantity2
  ) internal {
      if ( currency != address(0) ){

          require(IERC20(currency).transferFrom(
              from,
              to, 
              quantity1
          ), "Transfer of liquidity failed"); // Transfer complete loanAmount to borrower

          require(IERC20(currency).transferFrom(
              from,
              owner(), 
              quantity2
          ), "Transfer of liquidity failed"); // 1% of original loanAmount goes to contract owner

      }else{

          require(to.send(quantity1),"Transfer of liquidity failed");
          require(payable(owner()).send(quantity2),"Transfer of liquidity failed");

      }
  }

  // Getters & Setters

  function getLoanStatus(uint256 loanId) external view returns(Status) {
    return loans[loanId].status;
  }
  
  function getLoanApproveTotalPayment(uint256 loanId) external view returns(uint256) {
        uint32 discount = 100;
    
        if ( geyser.totalStakedFor(msg.sender) > 0 )
            discount = 105;
        
        return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(discount));
  }

  function getNftTokenIdArray(uint256 loanId) external view returns(uint256[] memory) {
    return loans[loanId].nftTokenIdArray;
  }

  function getLoanAmount(uint256 loanId) external view returns(uint256) {
    return loans[loanId].loanAmount;
  }

  function getAssetsValue(uint256 loanId) external view returns(uint256) {
    return loans[loanId].assetsValue;
  }

  function getLoanStart(uint256 loanId) external view returns(uint256) {
    return loans[loanId].loanStart;
  }

  function getLoanEnd(uint256 loanId) external view returns(uint256) {
    return loans[loanId].loanEnd;
  }

  function getNrOfInstallments(uint256 loanId) external view returns(uint256) {
    return loans[loanId].nrOfInstallments;
  }

  function getInstallmentAmount(uint256 loanId) external view returns(uint256) {
    return loans[loanId].installmentAmount;
  }

  function getAmountDue(uint256 loanId) external view returns(uint256) {
    return loans[loanId].amountDue;
  }

  function getPaidAmount(uint256 loanId) external view returns(uint256) {
    return loans[loanId].paidAmount;
  }

  function toPayForApprove(uint256 loanId) external view returns(uint256) {
	return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(100));
  }

  function getDefaultingLimit(uint256 loanId) external view returns(uint256) {
    return loans[loanId].defaultingLimit;
  }

  function getNrOfPayments(uint256 loanId) external view returns(uint256) {
    return loans[loanId].nrOfPayments;
  }

  function getNftAddressArray(uint256 loanId) external view returns(address[] memory) {
    return loans[loanId].nftAddressArray;
  }

  function getBorrower(uint256 loanId) external view returns(address) {
    return loans[loanId].borrower;
  }

  function getLender(uint256 loanId) external view returns(address) {
    return loans[loanId].lender;
  }

  function getCurrency(uint256 loanId) external view returns(address) {
    return loans[loanId].currency;
  }
  
  function getLoansCount() external view returns(uint256) {
    return loanID;
  }

  // TODO validate input
  function setLtv(uint256 newLtv) external onlyOwner {
    ltv = newLtv;
    emit LtvChanged(newLtv);
  }


  // Auxiliary functions

  // Returns loan by id, ommits nrOfInstallments as the stack was too deep and we can derive it in the backend
  function getLoanById(uint256 loanId) 
    external
    view
    returns(
      uint256 loanAmount,
      uint256 assetsValue,
      uint256 loanEnd,
      uint256 installmentAmount,
      uint256 amountDue,
      uint256 paidAmount,
      uint256[] memory nftTokenIdArray,
      address[] memory nftAddressArray,
      address payable borrower,
      address payable lender,
      address currency,
      Status status
    ) {
      Loan storage loan = loans[loanId];
      
      loanAmount = uint256(loan.loanAmount);
      assetsValue = uint256(loan.assetsValue);
      loanEnd = uint256(loan.loanEnd);
      installmentAmount = uint256(loan.installmentAmount);
      amountDue = uint256(loan.amountDue);
      paidAmount = uint256(loan.paidAmount);
      nftTokenIdArray = uint256[](loan.nftTokenIdArray);
      nftAddressArray = address[](loan.nftAddressArray);
      borrower = payable(loan.borrower);
      lender = payable(loan.lender);
      currency = address(currency);
      status = Status(loan.status);
  }

  // This function will indicate if the borrower has payed all his installments in time or not
  // False >> Borrower still has time to pay his installments
  // True >> Time to pay installments expired , the loan can be ended
  function lackOfPayment(uint256 loanId) public view returns(bool) {
    return loans[loanId].status == Status.APPROVED && loans[loanId].loanStart.add(loans[loanId].nrOfPayments.mul(installmentFrequency.mul(1 days))) <= block.timestamp.sub(loans[loanId].defaultingLimit.mul(installmentFrequency.mul(1 days)));
  }
  
  // Set the token ids
  function setTokenIds(uint256 community,uint256 founder,uint256 sttr) external onlyOwner {
        communityTokenId = community;
        founderTokenId = founder;
        geyserTokenId = sttr;
  }

  // TODO: Add auxiliary loan status update function for DEFAULTED state to be used by whomever

}
