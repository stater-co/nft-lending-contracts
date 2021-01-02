// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {
    uint256 public constant STATER_COMMUNITY_EDITION = 0;
    uint256 public constant STATER_FOUNDER_EDITION = 1;

    // Ex uri : https://ipfs.stater.co
    constructor(string memory uri) public ERC1155(uri) {}
    
    // Can be used for both fungible and non fungible tokens
    function createTokens(address receiver, uint256 tokenId, uint256 quantity, bytes memory info) external {
        _mint(receiver, tokenId, quantity, info);
    }
    
}