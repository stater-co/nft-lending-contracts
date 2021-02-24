// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract GameItems1155 is ERC1155, Ownable, ReentrancyGuard {
    uint256 public constant STATER_COMMUNITY_EDITION = 0;
    uint256 public constant STATER_FOUNDER_EDITION = 1;
    
    event ItemCreation(uint256 indexed itemId, uint256 indexed tokenId, address indexed owner, string name, string description, string image_url);

    struct Item {
        address owner;
        string name;
        string description;
        string image_url;
        uint256 qty;
        uint256 tokenId;
        bytes info;
    }
    
    Item[] public items;

    constructor(string memory uri) ERC1155(uri) {}
    
    // Can be used for both fungible and non fungible tokens
    function createTokens(address receiver, uint256 tokenId, uint256 quantity, bytes memory info, string calldata name, string calldata description, string calldata image_url) external onlyOwner {
        emit ItemCreation(items.length,tokenId,receiver,name,description,image_url);
        _mint(receiver, tokenId, quantity, info);
        items.push(Item(
            receiver,
            name,
            description,
            image_url,
            quantity,
            tokenId,
            info
        ));
    }
    
}