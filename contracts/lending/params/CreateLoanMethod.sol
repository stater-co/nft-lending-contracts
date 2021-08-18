// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;


contract CreateLoanMethod {
    struct CreateLoanMethodParams {
        address currency;
        address[] nftAddressArray;
        uint256 loanAmount;
        uint256 installmentTime;
        uint256 assetsValue;
        uint256[] nftTokenIdArray;
        uint16 nrOfInstallments;
        uint8[] nftTokenTypeArray;
    }
}