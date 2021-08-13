// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract Encoder {

    function encodeLackOfPayment() external pure returns(bytes memory) {
        return abi.encodeWithSignature("lackOfPayment(uint256)", 0);
    }
    
    function encodeCreateLoan() external pure returns(bytes memory) {
        return abi.encodeWithSignature("lackOfPayment(uint256)", 0);
    }
 
}