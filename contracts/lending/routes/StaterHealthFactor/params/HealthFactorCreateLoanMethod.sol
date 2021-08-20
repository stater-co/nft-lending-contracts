// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;


contract HealthFactorCreateLoanMethod {
    struct HealthFactorCreateLoanMethodParams {
        address currency;
        uint256 installmentTime;
        uint256[] nftTokenIdArray;
        uint256 loanAmount;
        uint16 nrOfInstallments;
    }
}
