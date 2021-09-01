// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


interface ILendingTemplate {
    function setGlobalVariables(LoanFeesHandler memory feesHandler, Handlers memory handlers) external;
}
