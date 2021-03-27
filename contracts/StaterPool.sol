// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./StaterCore.sol";


contract StaterPool is StaterCore {

    uint256 public poolID;
    struct Pool {
        mapping(address => uint256) funds;
        mapping(address => uint8) percents;
        uint256 loan;
        mapping(address => uint256) loanVotes;
    }
    mapping(uint256 => Pool) public pools;

    function createPool() external {
        
    }

}