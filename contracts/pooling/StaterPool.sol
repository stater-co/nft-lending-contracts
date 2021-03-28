// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./StaterCore.sol";


contract StaterPool is StaterCore {

    uint256 public poolID;
    struct Pool {
        address currency;
        uint256 loan;
        uint32 participants;
        mapping(address => uint256) funds;
        mapping(address => uint256) loanVotes;
        mapping(address => uint8) percents;
    }
    mapping(uint256 => Pool) public pools;

    function createPool(address currency,uint256 quantity) external payable {
        pools[poolID].participants = 1;
    }

}