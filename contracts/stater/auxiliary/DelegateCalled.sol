// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract DelegateCalled {
    uint256 public ltv = 5;
    uint256 public ok = 2;
    event TestEvent(uint256 testValue);

    function setLtv(uint256 newLtv) external returns (uint256) {
        ltv = newLtv;
        return ltv;
    }
}
