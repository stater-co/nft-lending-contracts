// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

interface ILendingCoreMethods {
    function getLoanRemainToPay(uint256 loanId) external view returns(uint256);
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address);
    function getLoanInstallmentCost(uint256 loanId, uint256 nrOfInstallments) external view returns(uint256 overallInstallmentAmount, uint256 interestPerInstallement, uint256 interestDiscounted, uint256 interestToStaterPerInstallement, uint256 amountPaidAsInstallmentToLender);
    function getLoanStartEnd(uint256 loanId) external view returns(uint256[2] memory);
    function getLoanApprovalCostOnly(uint256 loanId) external view returns(uint256);
  
}
