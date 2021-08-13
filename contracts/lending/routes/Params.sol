// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract Params {
    struct CreateLoanParams {
        address loanHandler;
        address promissoryHandler;
        address discountsHandler;
        address currency;
        address[] nftAddressArray;
        uint256 loanAmount;
        uint256 installmentTime;
        uint256 assetsValue;
        uint256 ltv;
        uint256 interestRate;
        uint256 interestRateToStater;
        uint256[] nftTokenIdArray;
        uint32 lenderFee;
        uint16 nrOfInstallments;
        uint8[] nftTokenTypeArray;
    }
}
