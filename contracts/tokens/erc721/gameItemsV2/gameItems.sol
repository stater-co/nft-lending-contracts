// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/utils/Counters.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

contract GameItems is ERC721, Ownable, ReentrancyGuard {

    constructor() public ERC721("GameItem", "ITM") {}

    using SafeMath for uint256;

    event ItemCreation(uint256 indexed itemId, address indexed owner, string title, string description, string url);

    struct Item {
        address owner;
        string title;
        string description;
        string url;
    }

    Item[] public items;

    function createItem(string calldata title, string calldata description, string calldata url) external {
        emit ItemCreation(items.length,msg.sender,title,description,url);
        _mint(msg.sender, items.length);
        _setTokenURI(items.length, url);
        items.push(Item(
            msg.sender,
            title,
            description,
            url
        ));
    }
    
    function updateUrl(uint256 itemId, string calldata url) external {
        require(msg.sender == items[itemId].owner,"GameItems: You're not the owner of this item");
        items[itemId].url = url;
    }

    function getItemOwner(uint256 itemId) external view returns(address) {
        return items[itemId].owner;
    }

    function getItemTitle(uint256 itemId) external view returns(string memory) {
        return items[itemId].title;
    }

    function getItemDescription(uint256 itemId) external view returns(string memory) {
        return items[itemId].description;
    }

    function getItemUrl(uint256 itemId) external view returns(string memory) {
        return items[itemId].url;
    }

}
