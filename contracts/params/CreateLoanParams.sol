// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

library CreateLoanParams {
    struct Struct {
        uint256 loanAmount;
        uint16 nrOfInstallments;
        address currency;
        uint256 assetsValue;
        address[] nftAddressArray; 
        uint256[] nftTokenIdArray;
        uint8[] nftTokenTypeArray;
    }
}