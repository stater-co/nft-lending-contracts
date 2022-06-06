// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;


interface IStaterDiscounts {
    function getDiscountTokenId(uint256 _discountId, uint256 tokenIdIndex) external view returns(uint256);
    function calculateDiscount(address requester) external view returns(uint256);
}