// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

contract StaterGateway {
    
    /* boilerplate owner => smart contract address => method signature */
    mapping(address => mapping(address => bytes4)) public boilerplate;

    /* Check if boilerplate location exists */
    modifier guarded(address to) {
        require(boilerplate[msg.sender][to].length > 0);
        _;
    }

    /*
     * @DIIMIIM: call() implementation
     * @param to: Represents the address of the smart contract to call, will also be checked within this method
     * @param input: Represents the method payload encoded as bytes
     */
    function vanillaCall(address to, bytes calldata input) external guarded(to) {

    }

    /*
     * @DIIMIIM: delegatecall() implementation
     * @param to: Represents the address of the smart contract to call, will also be checked within this method
     * @param input: Represents the method payload encoded as bytes
     */
    function delegateCall(address to, bytes calldata input) external guarded(to) {

    }

    /*
     * @DIIMIIM: Boilerplate setter
     */
    function updateBoilerplate(address to, bytes4 method) external {
        boilerplate[msg.sender][to] = method;
    }

}