// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;


contract ProxyCore {
    
    bytes4 public empty;
    /* boilerplate owner => smart contract address => method signature */
    mapping(address => mapping(address => bytes4)) public boilerplate;

    /* Check if boilerplate location exists */
    modifier guarded(address to) {
        require(boilerplate[msg.sender][to] != empty);
        _;
    }

}