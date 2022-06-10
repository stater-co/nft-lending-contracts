// SPDX-License-Identifier: MIT

/* 
 * Stater.co
 */
pragma solidity 0.8.14;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';


contract GameItems721 is ERC721, Ownable, ERC721Holder {

    constructor() ERC721("Test ERC721", "TERC721") {}

    event ItemCreation(uint256 indexed itemId, address indexed owner, string name, string description, string image_url);

    struct Item {
        address owner;
        string name;
        string description;
        string image_url;
    }

    Item[] public items;
    uint256 public totalCreated;

    function createItem(string calldata name, string calldata description, string calldata image_url) external onlyOwner {
        emit ItemCreation(items.length,msg.sender,name,description,image_url);
        _mint(msg.sender, items.length);
        items.push(Item(
            msg.sender,
            name,
            description,
            image_url
        ));
        ++totalCreated;
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
