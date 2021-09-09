// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import "../lending/routes/StaterDefault/params/DefaultCreateLoanMethod.sol";
import "../lending/routes/StaterHealthFactor/params/HealthFactorCreateLoanMethod.sol";

contract Encoder is DefaultCreateLoanMethod, HealthFactorCreateLoanMethod {
    uint256 public ltv = 5;

    function setLtv(uint256 newLtv) external returns (uint256) {
        ltv = newLtv;
        return ltv;
    }

    function encodeLackOfPayment(uint256 loanId)
        external
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("lackOfPayment(uint256)", loanId);
    }

    function encodeLtvSetter(uint256 newLtv)
        external
        pure
        returns (bytes memory)
    {
        return abi.encodeWithSignature("setLtv(uint256)", newLtv);
    }

    function encodeCreateLoan(DefaultCreateLoanMethodParams memory loan)
        external
        pure
        returns (bytes memory)
    {
        return
            abi.encodeWithSignature(
                "createLoan((address,address,address,address,address[],uint256,uint256,uint256,uint256,uint256,uint256,uint256[],uint32,uint16,uint8[]))",
                loan
            );
    }

    function encodeCreateLoanWithHealth(
        HealthFactorCreateLoanMethodParams memory loan
    ) external pure returns (bytes memory) {
        return
            abi.encodeWithSignature(
                "createLoan((address,uint256,uint256[],uint256,uint16))",
                loan
            );
    }
}
