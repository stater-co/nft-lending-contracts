// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
import "../libs/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";

interface LendingTemplate {
    function promissoryExchange(address from, address payable to, uint256[] calldata loanIds) external;
    function setPromissoryPermissions(uint256[] calldata loanIds, address sender) external;
}

/**
 * @title StaterPromissoryNote
 * @dev Implementats wrapping/unwrapping process of stater loans
 * @author Stater
 */ 
contract StaterPromissoryNote is ERC721, Ownable {
    
        
    /* ****** */
    /* EVENTS */
    /* ****** */
    
    /// @dev This event is fired when a user creates a new promissory note
    event WrapLoansAndMintPromissoryNote(uint256 indexed promissoryNoteId);
    
    /// @dev This event is fired when a user unwrap a promissory note
    event UnwrapPromissoryNote(uint256 indexed promissoryNoteId);
    
    /* ******* */
    /* STORAGE */
    /* ******* */
    struct PromissoryNote {
        uint256[] loans; //list of approved loans
        address payable owner;
    }
    mapping(uint256 => PromissoryNote) public promissoryNotes;
    
    /// @dev It needs to start with 1 so 0 can be used as "no promissory note assigned" status on the lending smart contract
    uint256 public promissoryNoteId = 1;
    LendingTemplate public lendingDataTemplate;
    
    /* ********* */
    /* CONSTANTS */
    /* ********* */

	//TODO: change the uri after the api implementation
    constructor(address _lendingDataAddress, string memory name, string memory symbol) ERC721(name,symbol) {
        lendingDataTemplate = LendingTemplate(_lendingDataAddress);
    }
    
    /* ********* */
    /* FUNCTIONS */
    /* ********* */
    
    /**
     * @dev Allows a user to lock approved loans in the contract and mint a new Promissory Note 
     */ 
    function createPromissoryNote(uint256[] calldata loanIds) external {
        require(loanIds.length > 0, "Promissory Note: You must submit an array with at least one element");
        
        //Allow loans to be used in the Promissory Note
        require(address(lendingDataTemplate) != address(0),"Promissory Note: Lending contract not established");
        
        lendingDataTemplate.setPromissoryPermissions(loanIds,msg.sender);
        
        //Set promissory note fields
        promissoryNotes[promissoryNoteId].loans = loanIds;
        promissoryNotes[promissoryNoteId].owner = msg.sender;
        
        //mint promissory note
        _safeMint(msg.sender, promissoryNoteId, "");
    
        emit WrapLoansAndMintPromissoryNote(promissoryNoteId);
        promissoryNoteId++;
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 id
    )
        public
        override
    {
    	require(address(lendingDataTemplate) != address(0),"Promissory Note: Lending contract not established");
        require(id < promissoryNoteId, "Promissory Note: Invalid promissory ID");
	
        //Allow loans to be used in the Promissory Note
	    super.safeTransferFrom(from,to,id);
        
        lendingDataTemplate.promissoryExchange(from,payable(to),promissoryNotes[id].loans);
        promissoryNotes[id].owner = payable(to);
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        bytes memory _data
    )
        public
        override
    {
    	require(address(lendingDataTemplate) != address(0),"Promissory Note: Lending contract not established");
        require(id < promissoryNoteId, "Promissory Note: Invalid promissory ID");

	    //Allow loans to be used in the Promissory Note
	    super.safeTransferFrom(from,to,id,_data);

        lendingDataTemplate.promissoryExchange(from,payable(to),promissoryNotes[id].loans);
        promissoryNotes[id].owner = payable(to);
    }
    
    function transferFrom(
        address from,
        address to,
        uint256 id
    )
        public
        override
    {
     	require(address(lendingDataTemplate) != address(0),"Promissory Note: Lending contract not established");
        require(id < promissoryNoteId, "Promissory Note: Invalid promissory ID");

        //Allow loans to be used in the Promissory Note
	    super.transferFrom(from,to,id);
        
        lendingDataTemplate.promissoryExchange(from,payable(to),promissoryNotes[id].loans);
        promissoryNotes[id].owner = payable(to);
    }
    
    /**
     * @notice Setter function for the main Stater lending contract
     * @param _lendingDataAddress The address of the stater lending contract
     */ 
    function setLendingDataAddress(address _lendingDataAddress) external onlyOwner {
        lendingDataTemplate = LendingTemplate(_lendingDataAddress);
    }
    
    function burnPromissoryNote(uint256 _promissoryNoteId) external {
        require(promissoryNotes[_promissoryNoteId].owner == msg.sender, "You're not the owner of this promissory note");
        delete promissoryNotes[_promissoryNoteId];
        address owner = ownerOf(_promissoryNoteId);

        _beforeTokenTransfer(owner, address(0), _promissoryNoteId);

        // Clear approvals
        approve(address(0), _promissoryNoteId);

        // Clear metadata (if any)
        _setTokenURI(_promissoryNoteId,"");

        transferFrom(msg.sender,address(0),_promissoryNoteId);

        emit Transfer(owner, address(0), _promissoryNoteId);
    }
    
}
