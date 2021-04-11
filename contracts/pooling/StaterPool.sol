// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../core/StaterCore.sol";


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
        if ( currency == address(0) || msg.value > 0 ){
            pools[poolID].currency = address(0);
            msg.value > 0 ? pools[poolID].funds[msg.sender] = msg.value : pools[poolID].funds[msg.sender] = quantity;
        }else{
            /*
             * @DIIMIIM : Transfer tokens from send to this here 
             */
            pools[poolID].currency = currency;
        }
            
        pools[poolID].participants = 1;
        ++poolID;
    }

}