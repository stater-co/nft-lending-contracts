// SPDX-License-Identifier: MIT

pragma solidity 0.7.4;
import "../libs/openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";

/**
 * @title StaterPromissoryNote
 * @dev Implementats wrapping/unwrapping process of stater loans
 * @author Stater
 */ 
contract StaterPromissoryNote is ERC1155, Ownable {
    
        
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
    uint256 public promissoryNoteId;
    
    /* ********* */
    /* CONSTANTS */
    /* ********* */
    
    string constant public name = "Stater Promissory Note";
    LendingData public lendingData;

	//TODO: change the uri after the api implementation
    constructor(address lendingDataAddress) ERC1155("https://abcoathup.github.io/SampleERC1155/api/token/{id}.json") {
        lendingData = LendingData(lendingDataAddress);
    }
    
    /* ********* */
    /* FUNCTIONS */
    /* ********* */
    
    /**
     * @dev Allows a user to lock approved loans in the contract and mint a new Promissory Note 
     */ 
    function createPromissoryNote(uint256[] calldata loanIds) external {
        require(loanIds.length > 0, 'you must submit an array with at least one element');
        
        //Allow loans to be used in the Promissory Note
        lendingData.setPromissoryPermissions(loanIds);
        
        //Set promissory note fields
        promissoryNotes[promissoryNoteId].loans = loanIds;
        promissoryNotes[promissoryNoteId].owner = msg.sender;
        
        //mint promissory note
        _mint(msg.sender, promissoryNoteId, 1, "");
    
        emit WrapLoansAndMintPromissoryNote(promissoryNoteId);
        promissoryNoteId++;
    }
    
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    )
        public
        virtual
        override
    {
        //TODO: get loan ids and call lending data function
    }
    
    /**
     * @notice Setter function for the main Stater lending contract
     * @param lendingDataAddress The address of the stater lending contract
     */ 
    function setLendingDataAddress(address lendingDataAddress) external onlyOwner {
        lendingData = LendingData(lendingDataAddress);
    }
    
    function burnPromissoryNote(uint256 _promissoryNoteId) external {
        require(promissoryNotes[_promissoryNoteId].owner == msg.sender, "You're not the owner of this promissory note");
        delete promissoryNotes[_promissoryNoteId];
    }
    
}

/**
 * @title StaterLendingCore
 * @notice Interface for interacting with the Stater Lending Core contract.
 * @author Stater
 */
interface LendingData {
    function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) external;
    function setPromissoryPermissions(uint256[] calldata loanIds) external;
}
