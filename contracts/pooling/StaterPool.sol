// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../plugins/StaterTransfers.sol";


contract StaterPool is Ownable, StaterTransfers {
    using SafeMath for uint256;
    uint256 public id;
    enum Status{ 
        LISTED, 
        CANCELLED,
        VOTING, 
        FINISHED, 
        WITHDRAWN
    }
    
    struct Pool {
        address currency;
        uint256 loan;
        address[] payers;
        uint256[] paid;
        uint256[] votes;
        Status status;
    }
    mapping(uint256 => Pool) public pools;

    modifier hasValidId(uint256 poolId) {
        require(
            poolId < id, 
            "Invalid loan id"
        );
        _;
    }
    
    modifier hasValidCurrency(address currency, uint256 quantity) {
        require(
            (currency == address(0) && msg.value > 0 && msg.value == quantity) || (currency != address(0) && msg.value == 0), 
            "You have to either use ETH or a custom ERC20 token as pool currency"
        );
        _;
    }
    
    modifier isListed(Status status) {
        require(
            status == Status.LISTED, 
            "Operation not allowed, pool is no longer listed"
        );
        _;
    }



    function createPool(
        address currency,
        uint256 quantity
    ) 
        external 
        hasValidCurrency(currency,quantity) 
        payable 
    {
        
        pools[id].currency = currency;
        pools[id].payers = [msg.sender];
        pools[id].paid = [quantity];
        
        transferTokens(msg.sender,payable(address(this)),currency,quantity.div(100).mul(99),quantity.div(100));
            
        ++id;
        
    }
    
    
    
    function depositIntoPool(
        uint256 poolId, 
        uint256 quantity
    ) 
        external 
        hasValidId(poolId) 
        hasValidCurrency(pools[poolId].currency,quantity) 
        isListed(pools[poolId].status) 
        payable 
    {
        
        int existsUser = this.checkUserExistsInsidePoolPayers(pools[poolId].payers,msg.sender);
        
        if (existsUser == -1){
            pools[poolId].payers.push(msg.sender);
            pools[poolId].paid.push(quantity);
        }else
            pools[poolId].paid[uint256(existsUser)] = pools[poolId].paid[uint256(existsUser)].add(quantity);
            
        transferTokens(msg.sender,payable(address(this)),pools[poolId].currency,quantity.div(100).mul(99),quantity.div(100));
            
    }
    
    
    
    function withdrawFromPool(
        uint256 poolId, 
        uint256 quantity
    ) 
        external 
        hasValidId(poolId) 
        isListed(pools[poolId].status) 
        payable 
    {
        
        int existsUser = this.checkUserExistsInsidePoolPayers(pools[poolId].payers,msg.sender);
        
        require(
            existsUser != -1 || pools[poolId].paid[uint256(existsUser)] < quantity,
            "Not enough funds to withdraw"
        );
        
        transferTokens(address(this),payable(msg.sender),pools[poolId].currency,quantity,0);
        pools[poolId].paid[uint256(existsUser)] = pools[poolId].paid[uint256(existsUser)].sub(quantity);
        
        if ( this.isPoolEmpty(pools[poolId].paid) )
            pools[poolId].status = Status.CANCELLED;
        
    }

    
    
    
    function checkUserExistsInsidePoolPayers(address[] calldata payers, address user) public pure returns(int) {
        for (uint256 i = 0 ; i < payers.length ; ++i)
            if ( payers[i] == user )
                return int(i);
        return -1;
    }
    
    function isPoolEmpty(uint256[] calldata paid) external pure returns(bool) {
        for (uint256 i = 0 ; i < paid.length ; ++i)
            if ( paid[i] > 0 )
                return true;
        return false;
    }

}