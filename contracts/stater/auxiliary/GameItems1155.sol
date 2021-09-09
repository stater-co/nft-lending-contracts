// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../../dependencies/openzeppelin/contracts/ERC1155.sol";
import "../../dependencies/openzeppelin/contracts/Ownable.sol";
import "../../dependencies/openzeppelin/contracts/ReentrancyGuard.sol";

contract GameItems1155 is ERC1155, Ownable {
    event ItemCreation(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        string description,
        string image_url
    );

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

    constructor(string memory uri) public ERC1155(uri) {}

    // Can be used for both fungible and non fungible tokens
    function createTokens(
        address receiver,
        uint256 tokenId,
        uint256 quantity,
        bytes memory info,
        string calldata name,
        string calldata description,
        string calldata image_url
    ) external onlyOwner {
        emit ItemCreation(
            items.length,
            tokenId,
            receiver,
            name,
            description,
            image_url
        );
        _mint(receiver, tokenId, quantity, info);
        items.push(
            Item(
                receiver,
                name,
                description,
                image_url,
                quantity,
                tokenId,
                info
            )
        );
    }
}
