// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../lending/routes/Params.sol";

contract Encoder is Params {

    function encodeLackOfPayment(uint256 loanId) external pure returns(bytes memory) {
        return abi.encodeWithSignature("lackOfPayment(uint256)", loanId);
    }
    
    function encodeCreateLoan(
        CreateLoanParams memory loan
    ) external pure returns(bytes memory) {
        return abi.encodeWithSignature("createLoan((address,address,address,address,address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256[],uint32,uint16,uint8[]))", loan);
    }
 
}