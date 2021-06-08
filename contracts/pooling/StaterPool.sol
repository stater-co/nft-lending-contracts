// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../libs/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract StaterPool is Ownable {

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
        require(currency == address(0) || msg.value > 0, "You have to either use ETH or a custom ERC20 token as pool currency");
        pools[poolID].currency = currency;
        if ( currency == address(0) && msg.value > 0 ){
            msg.value > 0 ? pools[poolID].funds[msg.sender] = msg.value : pools[poolID].funds[msg.sender] = quantity;
        }else if( msg.value == 0 && currency != address(0) ){
            /*
             * @DIIMIIM : Transfer tokens from send to this here 
             */
            pools[poolID].currency = currency;
            require(IERC20(currency).transferFrom(
              msg.sender,
              address(this), 
              quantity
          ), "Transfer of tokens to Stater Pool failed");
        }
            
        pools[poolID].participants = 1;
        ++poolID;
    }

}