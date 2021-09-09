// SPDX-License-Identifier: MIT

/* 
 * Stater.co
 */
pragma solidity 0.7.6;

import "../libs/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../libs/openzeppelin-solidity/contracts/utils/Counters.sol";
import "../libs/openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";

contract GameItems721 is ERC721, Ownable {

    constructor() ERC721("GameItem", "ITM") {}

    event ItemCreation(uint256 indexed itemId, address indexed owner, string name, string description, string image_url);

    struct Item {
        address owner;
        string name;
        string description;
        string image_url;
    }

    Item[] public items;

    function createItem(string calldata name, string calldata description, string calldata image_url) external onlyOwner {
        emit ItemCreation(items.length,msg.sender,name,description,image_url);
        _mint(msg.sender, items.length);
        _setTokenURI(items.length, image_url);
        items.push(Item(
            msg.sender,
            name,
            description,
            image_url
        ));
    }
    
    function updateUrl(uint256 itemId, string calldata image_url) external {
        require(msg.sender == items[itemId].owner,"GameItems: You're not the owner of this item");
        items[itemId].image_url = image_url;
    }

    function getItemOwner(uint256 itemId) external view returns(address) {
        return items[itemId].owner;
    }

    function getItemName(uint256 itemId) external view returns(string memory) {
        return items[itemId].name;
    }

    function getItemDescription(uint256 itemId) external view returns(string memory) {
        return items[itemId].description;
    }

    function getItemUrl(uint256 itemId) external view returns(string memory) {
        return items[itemId].image_url;
    }

}
