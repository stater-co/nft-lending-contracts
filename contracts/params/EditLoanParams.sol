// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

library EditLoanParams {
    struct Struct {
        uint256 loanId;
        uint256 loanAmount;
        uint16 nrOfInstallments;
        address currency;
        uint256 assetsValue;
        uint256 installmentTime;
    }
}