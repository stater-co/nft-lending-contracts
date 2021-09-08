// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

interface ILendingTemplate {
    struct LoanFeesHandler {
        uint256 ltv;
        uint256 interestRate;
        uint256 interestRateToStater;
        uint32 lenderFee;
    }

    struct Handlers {
        address loanHandler;
        address promissoryHandler;
        address discountsHandler;
        address poolHandler;
    }

    function setGlobalVariables(
        LoanFeesHandler memory feesHandler,
        Handlers memory handlers
    ) external;
}
