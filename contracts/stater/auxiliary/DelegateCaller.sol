// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

contract DelegateCaller {
    uint256 public ltv = 5;

    function setLtv(bytes memory payload, address to) external {
        (bool success, ) = to.delegatecall(payload);
        require(success, "StaterGateway: Delegate call failed");
    }
}
