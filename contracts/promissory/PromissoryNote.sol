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
    address public lendingDataAddress;
    
    /* ********* */
    /* CONSTANTS */
    /* ********* */
    
    string constant public name = "Stater Promissory Note";

	//TODO: change the uri after the api implementation
    constructor(address _lendingDataAddress) ERC1155("https://abcoathup.github.io/SampleERC1155/api/token/{id}.json") {
        lendingDataAddress = _lendingDataAddress;
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
        require(lendingDataAddress != address(0),"Lending contract not established");
        
        (bool success, ) = lendingDataAddress.delegatecall(
            abi.encodeWithSignature(
                "setPromissoryPermissions(uint256[])",
                loanIds
            )
        );
        require(success,"Failed to setPromissoryPermissions via delegatecall");
        
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
     
        require(id < promissoryNoteId, "Promissory Note: Invalid promissory ID");
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );

        //Allow loans to be used in the Promissory Note
        require(lendingDataAddress != address(0),"Lending contract not established");
            
        (bool success, ) = lendingDataAddress.delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(uint256[],address)",
                promissoryNotes[id].loans,to
            )
        );
        require(success,"Failed to setPromissoryPermissions via delegatecall");

    }
    
    /**
     * @notice Setter function for the main Stater lending contract
     * @param _lendingDataAddress The address of the stater lending contract
     */ 
    function setLendingDataAddress(address _lendingDataAddress) external onlyOwner {
        lendingDataAddress = _lendingDataAddress;
    }
    
    function burnPromissoryNote(uint256 _promissoryNoteId) external {
        require(promissoryNotes[_promissoryNoteId].owner == msg.sender, "You're not the owner of this promissory note");
        delete promissoryNotes[_promissoryNoteId];
    }
    
}
