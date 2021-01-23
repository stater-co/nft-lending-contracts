pragma solidity 0.7.4;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
interface Geyser { function totalStakedFor(address addr) external view returns(uint); }
contract LendingData is ERC721Holder, ERC1155Holder, Ownable, ReentrancyGuard {
  using SafeMath for uint;
  Geyser public geyser;
  address public erc1155token;
  address public staterNftAddress;
  address public staterFtAddress;
  uint public communityTokenId;
  uint public founderTokenId;
  uint public geyserTokenId;
  uint public loanID;
  uint public ltv = 600;
  uint public installmentFrequency = 7;
  uint public interestRate = 20;
  uint public interestRateToStater = 40;
  event NewLoan(uint indexed id, address indexed owner, uint creationDate, address indexed currency, Status status, string creationId);
  event LoanApproved(uint indexed id, address indexed lender, uint approvalDate, uint loanPaymentEnd, Status status);
  event LoanCancelled(uint indexed id, uint cancellationDate, Status status);
  event ItemsWithdrawn(uint indexed id, address indexed requester, Status status);
  event LoanPayment(uint indexed id, uint paymentDate, uint installmentAmount, uint amountPaidAsInstallmentToLender, uint interestPerInstallement, uint interestToStaterPerInstallement, Status status);
  event LtvChanged(uint newLTV);
  enum Status { UNINITIALIZED,LISTED,APPROVED,DEFAULTED,LIQUIDATED,CANCELLED }
  enum TokenType { ERC721,ERC1155 }
  struct Loan{
    address[] nftAddressArray;
    address payable borrower;
    address payable lender;
    address currency;
    Status status;
    uint[] nftTokenIdArray;
    uint loanAmount;
    uint assetsValue;
    uint loanStart;
    uint loanEnd;
    uint nrOfInstallments;
    uint installmentAmount;
    uint amountDue;
    uint paidAmount;
    uint defaultingLimit;
    uint nrOfPayments;
    TokenType[] nftTokenTypeArray;
  }
  mapping(uint => Loan) public loans;
  function createLoan(uint loanAmount,uint nrOfInstallments,address currency,uint assetsValue,address[] calldata nftAddressArray,uint[] calldata nftTokenIdArray,string calldata creationId,TokenType[] memory nftTokenTypeArray) external{
    require(nrOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(_percent(loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    _transferItems(msg.sender, address(this), nftAddressArray, nftTokenIdArray, nftTokenTypeArray);
    if ( nrOfInstallments <= 3 )
        loans[loanID].defaultingLimit = 1;
    else if ( nrOfInstallments <= 5 )
        loans[loanID].defaultingLimit = 2;
    else if ( nrOfInstallments >= 6 )
        loans[loanID].defaultingLimit = 3;
    loans[loanID].nftTokenIdArray = nftTokenIdArray;
    loans[loanID].loanAmount = loanAmount;
    loans[loanID].assetsValue = assetsValue;
    loans[loanID].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
    loans[loanID].nrOfInstallments = nrOfInstallments;
    loans[loanID].installmentAmount = loans[loanID].amountDue.div(nrOfInstallments);
    loans[loanID].status = Status.LISTED;
    loans[loanID].nftAddressArray = nftAddressArray;
    loans[loanID].borrower = msg.sender;
    loans[loanID].currency = currency;
    loans[loanID].nftTokenTypeArray = nftTokenTypeArray;
    emit NewLoan(loanID,msg.sender,block.timestamp,currency,Status.LISTED,creationId);
    ++loanID;
  }

  function setLoanAssetsValue(uint id,uint assetsValue) external{
    require(loans[id].status < Status.APPROVED,"Loan can no longer be modified");
    require(assetsValue > 0, "Loan assets value must be higher than 0");
    require(_percent(loans[id].loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    loans[id].assetsValue = assetsValue;
  }
  
  function setLoanAmount(uint id,uint loanAmount) external{
    require(loans[id].status < Status.APPROVED,"Loan can no longer be modified");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(_percent(loanAmount, loans[id].assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    loans[id].loanAmount = loanAmount;
    loans[id].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
  }
  
  function setLoanNrOfInstallments(uint id,uint nrOfInstallments) external{
    require(loans[id].status < Status.APPROVED,"Loan can no longer be modified");
    require(nrOfInstallments > 0, "Loan number of installments must be higher than 0");
    loans[id].nrOfInstallments = nrOfInstallments;
  }
  
  function setLoanCurrency(uint id,address currency) external{
    require(loans[id].status < Status.APPROVED,"Loan can no longer be modified");
    loans[id].currency = currency;
  }

  function approveLoan(uint id) external payable {
    require(loans[id].lender == address(0), "Someone else payed for this loan before you");
    require(loans[id].paidAmount == 0, "This loan is currently not ready for lenders");
    require(loans[id].status == Status.LISTED, "This loan is not currently ready for lenders, check later");
    uint32 discount = 100;
    if ( IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId) > 0 )
        discount = 200;
    else if ( IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId) > 0 )
        discount = 115;
    else if ( geyser.totalStakedFor(msg.sender) > 0 )
        discount = 105;
    if ( loans[id].currency == address(0) )
      require(msg.value >= loans[id].loanAmount.add(loans[id].loanAmount.div(discount)),"Not enough currency");
    _transferTokens(msg.sender,loans[id].borrower,loans[id].currency,loans[id].loanAmount,loans[id].loanAmount.div(discount));
    loans[id].lender = msg.sender;
    loans[id].loanEnd = block.timestamp.add(loans[id].nrOfInstallments.mul(installmentFrequency).mul(1 days));
    loans[id].status = Status.APPROVED;
    loans[id].loanStart = block.timestamp;
    emit LoanApproved(
      id,
      msg.sender,
      block.timestamp,
      loans[id].loanEnd,
      Status.APPROVED
    );
  }
  
  function cancelLoan(uint id) external {
    require(loans[id].lender == address(0), "The loan has a lender , it cannot be cancelled");
    require(loans[id].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[id].status != Status.CANCELLED, "This loan is already cancelled");
    require(loans[id].status == Status.LISTED, "This loan is no longer cancellable");
    loans[id].loanEnd = block.timestamp;
    loans[id].status = Status.CANCELLED;
    _transferItems(
      address(this), 
      loans[id].borrower, 
      loans[id].nftAddressArray, 
      loans[id].nftTokenIdArray,
      loans[id].nftTokenTypeArray
    );
    emit LoanCancelled(
      id,
      block.timestamp,
      Status.CANCELLED
    );
  }

  function payLoan(uint id) external payable {
    require(loans[id].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[id].status == Status.APPROVED, "This loan is no longer in the approval phase, check its status");
    require(loans[id].loanEnd >= block.timestamp, "Loan validity expired");
    uint interestPerInstallement;
    uint interestToStaterPerInstallement;
    uint amountPaidAsInstallmentToLender;
    uint32 discount = 100;
    if ( IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId) > 0 )
        discount = 200;
    else if ( IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId) > 0 )
        discount = 115;
    else if ( geyser.totalStakedFor(msg.sender) > 0 )
        discount = 105;
    if ( loans[id].currency != address(0) ) {
      interestPerInstallement = loans[id].installmentAmount.mul(interestRate).div(100).div(loans[id].nrOfInstallments);
      interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(discount);
      amountPaidAsInstallmentToLender = loans[id].installmentAmount.sub(interestToStaterPerInstallement);
    }else{
      require(msg.value >= loans[id].installmentAmount, "Not enough currency");
      interestPerInstallement = msg.value.mul(interestRate).div(100).div(loans[id].nrOfInstallments);
      interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(discount);
      amountPaidAsInstallmentToLender = msg.value.sub(interestToStaterPerInstallement);
    }
    _transferTokens(msg.sender,loans[id].lender,loans[id].currency,amountPaidAsInstallmentToLender,interestToStaterPerInstallement);
    loans[id].paidAmount = loans[id].paidAmount.add(interestToStaterPerInstallement).add(amountPaidAsInstallmentToLender);
    loans[id].nrOfPayments = loans[id].paidAmount.div(loans[id].installmentAmount);
    if (loans[id].paidAmount >= loans[id].amountDue)
      loans[id].status = Status.LIQUIDATED;
    emit LoanPayment(
      id,
      block.timestamp,
      msg.value,
      amountPaidAsInstallmentToLender,
      interestPerInstallement,
      interestToStaterPerInstallement,
      loans[id].status
    );
  }

  function withdrawItems(uint id) external {
    require(block.timestamp >= loans[id].loanEnd || loans[id].paidAmount >= loans[id].amountDue, "The loan is not finished yet");
    require(loans[id].status == Status.LIQUIDATED || loans[id].status == Status.APPROVED, "Incorrect state of loan");
    if ( block.timestamp >= loans[id].loanEnd && loans[id].paidAmount < loans[id].amountDue ) {
      loans[id].status = Status.DEFAULTED;
      _transferItems(address(this),loans[id].lender,loans[id].nftAddressArray,loans[id].nftTokenIdArray,loans[id].nftTokenTypeArray);
    }else if( loans[id].paidAmount >= loans[id].amountDue )
      _transferItems(address(this),loans[id].borrower,loans[id].nftAddressArray,loans[id].nftTokenIdArray,loans[id].nftTokenTypeArray);
    emit ItemsWithdrawn(id,msg.sender,loans[id].status);
  }

  function terminateLoan(uint id) external{
    require(msg.sender == loans[id].borrower || msg.sender == loans[id].lender, "You can't access this loan");
    require(loans[id].status == Status.APPROVED, "Loan must be approved");
    require(lackOfPayment(id), "Borrower still has time to pay his installments");
    _transferItems(address(this),loans[id].lender,loans[id].nftAddressArray,loans[id].nftTokenIdArray,loans[id].nftTokenTypeArray);
    loans[id].status = Status.DEFAULTED;
    loans[id].loanEnd = block.timestamp;
  }
  function getNftTokenIdArray(uint id) external view returns(uint[] memory){return loans[id].nftTokenIdArray;}
  function getLoanAmount(uint id) external view returns(uint){return loans[id].loanAmount;}
  function getAssetsValue(uint id) external view returns(uint){return loans[id].assetsValue;}
  function getLoanStart(uint id) external view returns(uint){return loans[id].loanStart;}
  function getLoanEnd(uint id) external view returns(uint){return loans[id].loanEnd;}
  function getNrOfInstallments(uint id) external view returns(uint){return loans[id].nrOfInstallments;}
  function getInstallmentAmount(uint id) external view returns(uint){return loans[id].installmentAmount;}
  function getAmountDue(uint id) external view returns(uint){return loans[id].amountDue;}
  function getPaidAmount(uint id) external view returns(uint){return loans[id].paidAmount;}
  function toPayForApprove(uint id) external view returns(uint){return loans[id].loanAmount.add(loans[id].loanAmount.div(100));}
  function getDefaultingLimit(uint id) external view returns(uint){return loans[id].defaultingLimit;}
  function getNrOfPayments(uint id) external view returns(uint){return loans[id].nrOfPayments;}
  function getNftAddressArray(uint id) external view returns(address[] memory){return loans[id].nftAddressArray;}
  function getBorrower(uint id) external view returns(address){return loans[id].borrower;}
  function getLender(uint id) external view returns(address){return loans[id].lender;}
  function getCurrency(uint id) external view returns(address){return loans[id].currency;}
  function getLoansCount() external view returns(uint){return loanID;}
  function getLoanById(uint id) external view returns(uint loanAmount,uint assetsValue,uint loanEnd,uint installmentAmount,uint amountDue,uint paidAmount,uint[] memory nftTokenIdArray,address[] memory nftAddressArray,address payable borrower,address payable lender,address currency,Status status){
    Loan storage loan = loans[id];
    loanAmount = uint(loan.loanAmount);
    assetsValue = uint(loan.assetsValue);
    loanEnd = uint(loan.loanEnd);
    installmentAmount = uint(loan.installmentAmount);
    amountDue = uint(loan.amountDue);
    paidAmount = uint(loan.paidAmount);
    nftTokenIdArray = uint[](loan.nftTokenIdArray);
    nftAddressArray = address[](loan.nftAddressArray);
    borrower = payable(loan.borrower);
    lender = payable(loan.lender);
    currency = address(currency);
    status = Status(loan.status);
  }
  function getLoanStatus(uint id) external view returns(Status){return loans[id].status;}
  function getLoanApprovalCost(uint id) external view returns(uint){
    uint32 discount=100;
	if (IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId)>0)
		discount=200;
	else if(IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId)>0)
		discount=115;
	else if(geyser.totalStakedFor(msg.sender)>0)
		discount=105;
        return loans[id].loanAmount.add(loans[id].loanAmount.div(discount));
  }
  function getLoanInstallmentCost(uint id, uint nrOfInstallments) external view returns(uint,uint){
    uint32 discount=100;
    uint installmentsToPay = loans[id].installmentAmount.mul(nrOfInstallments);
    if (IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId)>0)
        discount=200;
    else if(IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId)>0)
        discount=115;
    else if(geyser.totalStakedFor(msg.sender)>0)
        discount=105;
    uint interestPerInstallement=installmentsToPay.mul(interestRate).div(100).div(loans[id].nrOfInstallments);
    uint interestToStaterPerInstallement=interestPerInstallement.mul(interestRateToStater).div(discount);
    uint amountPaidAsInstallmentToLender=installmentsToPay.sub(interestToStaterPerInstallement);
    return(amountPaidAsInstallmentToLender,interestToStaterPerInstallement);
  }
  function _percent(uint numerator, uint denominator) internal pure returns(uint){return numerator.mul(10 ** 4).div(denominator).add(5).div(10);}
  function _transferItems(address from, address to, address[] memory nftAddressArray, uint[] memory nftTokenIdArray, TokenType[] memory nftTokenTypeArray) internal{
    uint length = nftAddressArray.length;
    require(length == nftTokenIdArray.length && nftTokenTypeArray.length == length, "Token infos provided are invalid");
    for(uint i = 0; i < length; ++i) 
        if ( nftTokenTypeArray[i] == TokenType.ERC721 )
            IERC721(nftAddressArray[i]).safeTransferFrom(from,to,nftTokenIdArray[i]);
        else
            IERC1155(nftAddressArray[i]).safeTransferFrom(from,to,nftTokenIdArray[i],1,"");
  }
  function _transferTokens(address from,address payable to,address currency,uint qty1,uint qty2) internal{
      if(currency != address(0)){
          require(IERC20(currency).transferFrom(from,to,qty1),"Transfer of liquidity failed");
          require(IERC20(currency).transferFrom(from,owner(),qty2),"Transfer of liquidity failed");
      }else{
          require(to.send(qty1),"Transfer of liquidity failed");
          require(payable(owner()).send(qty2),"Transfer of liquidity failed");
      }
  }
  function setLtv(uint newLtv) external onlyOwner{
    ltv = newLtv;
    emit LtvChanged(newLtv);
  }
  function lackOfPayment(uint id) public view returns(bool){ return loans[id].status == Status.APPROVED && loans[id].loanStart.add(loans[id].nrOfPayments.mul(installmentFrequency.mul(1 days))) <= block.timestamp.sub(loans[id].defaultingLimit.mul(installmentFrequency.mul(1 days)));}
  function setTokenIds(uint community,uint founder,uint sttr) external onlyOwner{
    communityTokenId = community;
    founderTokenId = founder;
    geyserTokenId = sttr;
  }
  function setInterfaces(address tokenGeyser,address erc1155Token) external onlyOwner{
	geyser = Geyser(tokenGeyser);
	erc1155token = erc1155Token;
  }
}