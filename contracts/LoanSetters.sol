pragma solidity 0.7.4;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./LendingData.sol";

contract Getters is LendingData {
  using SafeMath for uint256;

  function setLoanAssetsValue(
    uint256 loanId,
    uint256 assetsValue
  ) external {
    require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
    require(assetsValue > 0, "Loan assets value must be higher than 0");
    require(_percent(loans[loanId].loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    loans[loanID].assetsValue = assetsValue;
  }
  
  function setLoanAmount(
    uint256 loanId,
    uint256 loanAmount
  ) external {
    require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(_percent(loanAmount, loans[loanId].assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
    loans[loanID].loanAmount = loanAmount;
    loans[loanID].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
  }
  
  function setLoanNrOfInstallments(
    uint256 loanId,
    uint256 nrOfInstallments
  ) external {
    require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
    require(nrOfInstallments > 0, "Loan number of installments must be higher than 0");
    loans[loanID].nrOfInstallments = nrOfInstallments;
  }
  
  function setLoanCurrency(
    uint256 loanId,
    address currency
  ) external {
    require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
    loans[loanID].currency = currency;
  }
  
  function setLtv(uint256 newLtv) external onlyOwner {
    ltv = newLtv;
    emit LtvChanged(newLtv);
  }
  
  function setTokenIds(uint256 community,uint256 founder,uint256 sttr) external onlyOwner {
    communityTokenId = community;
    founderTokenId = founder;
    geyserTokenId = sttr;
  }
  
  function setInterfaces(address tokenGeyser, address erc1155Token) external onlyOwner {
	geyser = Geyser(tokenGeyser);
	erc1155token = erc1155Token;
  }
}
