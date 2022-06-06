// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../libs/openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../libs/openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";
import "../libs/openzeppelin-solidity/contracts/token/ERC1155/ERC1155Receiver.sol";


contract GameItems1155 is ERC1155, Ownable, ERC1155Receiver, ERC1155Holder {
    
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

    constructor() ERC1155("Test ERC1155") {}
    
    // Can be used for both fungible and non fungible tokens
    function createTokens(address receiver, uint256 quantity, bytes memory info, string calldata name, string calldata description, string calldata image_url) external onlyOwner {
        emit ItemCreation(items.length,items.length,receiver,name,description,image_url);
        _mint(receiver, items.length, quantity, info);
        items.push(Item(
            receiver,
            name,
            description,
            image_url,
            quantity,
            items.length+1,
            info
        ));
    }
    
    function totalSupply() external view returns(uint256) {
        return items.length;
    }
    
}