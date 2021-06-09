// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../plugins/StaterTransfers.sol";

interface LendingTemplate {
    function getLoanApprovalCostOnly(uint256 loanId) external view returns(uint256);
}


contract StaterPool is Ownable, StaterTransfers {
    using SafeMath for uint256;
    uint256 public id = 1;
    LendingTemplate public lendingDataTemplate;
    enum Status{ 
        LISTED, 
        CANCELLED,
        VOTING, 
        FINISHED, 
        WITHDRAWN
    }
    
    struct Pool {
        address[] payers;
        address currency;
        uint256[] paid;
        uint256[] votes;
        uint256 toVoteAfter;
        uint256 votingPeriod;
        uint256 loan;
        Status status;
    }
    mapping(uint256 => Pool) public pools;
    
    modifier lendingTemplateUp {
        require(
            address(lendingDataTemplate) != address(0), 
            "Stater Pooling: Lending contract not established"
        );
        _;
    }

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
    
    modifier isVoting(Status status) {
        require(
            status == Status.VOTING, 
            "Operation not allowed, pool is no longer in election phase"
        );
        _;
    }
    
    modifier isBeforeVoting(uint256 poolId) {
        require(
            block.timestamp < pools[poolId].toVoteAfter, 
            "Operation not allowed, pool is in election phase now"
        );
        _;
    }
    
    modifier isInVoting(uint256 poolId) {
        require(
            block.timestamp >= pools[poolId].toVoteAfter, 
            "Operation not allowed, pool is no longer in election phase now"
        );
        _;
    }
    
    modifier isAfterVoting(uint256 poolId) {
        require(
            block.timestamp >= pools[poolId].toVoteAfter.add(pools[poolId].votingPeriod), 
            "Operation not allowed, pool hasn't finished its election time yet"
        );
        _;
    }

    
    constructor(address _lendingDataAddress) {
        lendingDataTemplate = LendingTemplate(_lendingDataAddress);
    }


    function createPool(
        address currency,
        uint256 quantity,
        uint256 toVoteAfter,
        uint256 votingPeriod
    ) 
        external 
        hasValidCurrency(currency,quantity) 
        payable 
    {
        
        pools[id].currency = currency;
        pools[id].payers = [msg.sender];
        pools[id].votingPeriod = votingPeriod;
        pools[id].paid = [quantity.div(100).mul(99)];
        pools[id].toVoteAfter = toVoteAfter;
        
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
        isBeforeVoting(poolId) 
        payable 
    {
        
        int256 existsUser = this.getPoolUser(pools[poolId].payers,msg.sender);
        
        if (existsUser == -1){
            bool found = false;
            for ( uint256 i = 0 ; i < pools[poolId].payers.length ; ++i )
                if ( pools[poolId].payers[i] == msg.sender ){
                    found = true;
                    pools[poolId].paid[i].add(quantity.div(100).mul(99));
                    break;
                }
            
            if ( !found ){
                pools[poolId].payers.push(msg.sender);
                pools[poolId].paid.push(quantity.div(100).mul(99));
            }
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
        isBeforeVoting(poolId)
        payable 
    {
        
        int256 existsUser = this.getPoolUser(pools[poolId].payers,msg.sender);
        
        require(
            pools[poolId].paid[uint256(existsUser)] < quantity,
            "Not enough funds to withdraw"
        );
        
        transferTokens(address(this),payable(msg.sender),pools[poolId].currency,quantity,0);
        pools[poolId].paid[uint256(existsUser)] = pools[poolId].paid[uint256(existsUser)].sub(quantity);
        
        if ( this.isPoolEmpty(pools[poolId].paid) )
            pools[poolId].status = Status.CANCELLED;
        
    }

    
    
    function beginPoolElection(
        uint256 poolId, 
        uint256 loanId
    ) 
        external 
        hasValidId(poolId) 
        isListed(pools[poolId].status) 
        isInVoting(poolId)
        lendingTemplateUp
    {
        require(!this.isPoolEmpty(pools[poolId].paid), "This pool is empty, nothing to elect for");
        int256 existsUser = this.getPoolUser(pools[poolId].payers,msg.sender);
        
        require(
            pools[poolId].votes[uint256(existsUser)] == 0,
            "You've already voted for this pool election"    
        );
        
        pools[poolId].status = Status.VOTING;
        pools[poolId].votes[uint256(existsUser)] = loanId;
    }
    
    
    
    function vote(
        uint256 poolId, 
        uint256 loanId
    ) 
        external 
        hasValidId(poolId) 
        isVoting(pools[poolId].status) 
        isInVoting(poolId)
        lendingTemplateUp
    {
        int256 existsUser = this.getPoolUser(pools[poolId].payers,msg.sender);
        
        require(
            pools[poolId].votes[uint256(existsUser)] == 0,
            "You've already voted for this pool election"    
        );
        
        pools[poolId].votes[uint256(existsUser)] = loanId;
    }
    
    
    function finishVoting(
        uint256 poolId
    ) 
        external 
        isAfterVoting(poolId) 
    {
        uint256 loanId;
        //for 
        require(lendingDataTemplate.getLoanApprovalCostOnly(loanId) <= this.getPoolTotalFunds(pools[poolId].paid), "Not enough funds to pick this loan");
    }
    
    
    function checkUserExistsInsidePoolPayers(address[] calldata payers, address user) public pure returns(int256) {
        for (uint256 i = 0 ; i < payers.length ; ++i)
            if ( payers[i] == user )
                return int256(i);
        return -1;
    }
    
    function isPoolEmpty(uint256[] calldata paid) public pure returns(bool) {
        for (uint256 i = 0 ; i < paid.length ; ++i)
            if ( paid[i] > 0 )
                return true;
        return false;
    }
    
    function getPoolTotalFunds(uint256[] calldata paid) public pure returns(uint256) {
        uint256 total;
        for (uint256 i = 0 ; i < paid.length ; ++i)
            total.add(paid[i]);
        return total;
    }
    
    function getPoolUser(address[] calldata payers, address user) public view returns(int256) {
        int256 existsUser = this.checkUserExistsInsidePoolPayers(payers,user);
        require(
            existsUser != -1,
            "You're not a member of this pool"
        );
        
        return existsUser;
    }

}