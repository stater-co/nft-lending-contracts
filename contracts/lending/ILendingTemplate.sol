// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;


interface ILendingTemplate {
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address);
    function canBeTerminated(uint256 loanId) external view returns(bool);
}