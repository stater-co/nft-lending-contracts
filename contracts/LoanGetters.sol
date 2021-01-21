pragma solidity 0.7.4;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "./LendingData.sol";

contract Getters is LendingData {
  using SafeMath for uint256;

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
    
  function getLoanStatus(uint256 loanId) external view returns(Status) {
    return loans[loanId].status;
  }
  
  function getLoanApprovalCost(uint256 loanId) external view returns(uint256) {
    uint32 discount = 100;
	if ( IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId) > 0 )
		discount = 200;
	else if ( IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId) > 0 )
		discount = 115;
	else if ( geyser.totalStakedFor(msg.sender) > 0 )
		discount = 105;
        return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(discount));
  }
  
  function getLoanInstallmentCost(uint256 loanId, uint256 nrOfInstallments) external view returns(uint256,uint256) {
    uint32 discount = 100;
    uint256 installmentsToPay = loans[loanId].installmentAmount.mul(nrOfInstallments);
    if ( IERC1155(erc1155token).balanceOf(msg.sender,founderTokenId) > 0 )
        discount = 200;
    else if ( IERC1155(erc1155token).balanceOf(msg.sender,communityTokenId) > 0 )
        discount = 115;
    else if ( geyser.totalStakedFor(msg.sender) > 0 )
        discount = 105;
    uint256 interestPerInstallement = installmentsToPay.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments);
    uint256 interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(discount);
    uint256 amountPaidAsInstallmentToLender = installmentsToPay.sub(interestToStaterPerInstallement);
    return(amountPaidAsInstallmentToLender,interestToStaterPerInstallement);
  }

}
