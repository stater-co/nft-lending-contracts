// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

contract StaterGateway {
    
    mapping(address => mapping(address => bytes4)) public boilerplate;

    modifier guarded(address to) {
        require(boilerplate[msg.sender][to].length > 0);
    }

    function vanillaCall(address to, bytes calldata input) external guarded(to) {

    }

    function delegateCall(address to, bytes calldata input) external guarded(to) {

    }

    function updateBoilerplate(address to, bytes4 method) external {
        boilerplate[msg.sender][to] = method;
    }

}