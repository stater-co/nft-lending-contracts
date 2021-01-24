pragma solidity 0.7.4;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./LendingData.sol";

contract Setters is LendingData {
  using SafeMath for uint256;

  function editLoan(
    uint256 loanId,
    uint256 assetsValue,
    uint256 loanAmount,
    uint256 nrOfInstallments,
    address currency
  ) external {
    require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
    require(assetsValue > 0, "Loan assets value must be higher than 0");
    require(_percent(loans[loanId].loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(_percent(loanAmount, loans[loanId].assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    require(nrOfInstallments > 0, "Loan number of installments must be higher than 0");
    loans[loanID].nrOfInstallments = nrOfInstallments;
    loans[loanID].loanAmount = loanAmount;
    loans[loanID].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
    loans[loanID].assetsValue = assetsValue;
    loans[loanID].currency = currency;
  }
  
}
