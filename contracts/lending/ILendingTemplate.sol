// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;


interface ILendingTemplate {
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address);
    function promissoryExchange(address from, address payable to, uint256[] calldata loanIds) external;
    function getPromissoryPermission(uint256 loanId) external view returns(address);
    function canBeTerminated(uint256 loanId) external view returns(bool);
}