// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract HealthFactorCreateLoanMethod {
    struct HealthFactorCreateLoanMethodParams {
        address currency;
        uint256 installmentTime;
        uint256[] nftTokenIdArray;
        uint256 loanAmount;
        uint16 nrOfInstallments;
    }
}
