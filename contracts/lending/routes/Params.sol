// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract Params {
    struct CreateLoanParams {
        address currency;
        address[] nftAddressArray;
        uint256 loanAmount;
        uint256 installmentTime;
        uint256 assetsValue;
        uint256[] nftTokenIdArray;
        uint16 nrOfInstallments;
        uint8[] nftTokenTypeArray;
    }
    struct Handlers {
        address loanHandler;
        address promissoryHandler;
        address discountsHandler;
        address poolHandler;
    }
}
