// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;


contract CreateLoanMethod {
    struct CreateLoanMethodParams {
        uint256 installmentTime;
        uint256[] nftTokenIdArray;
        uint16 nrOfInstallments;
    }
}
