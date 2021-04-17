// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../multi-token-standard/contracts/interfaces/IERC1155.sol";
import "../openzeppelin-solidity/contracts/access/Ownable.sol";

interface Geyser { 
    function totalStakedFor(address addr) external view returns(uint256);
}

contract StaterDiscount is Ownable {


    uint256 public discountId;
    struct Discount {
        uint8 tokenType; // 0 - erc721 , 1 - erc1155 , 2 - geyser
        address tokenContract; // the smart contract address of the discount token
        uint8 discount; // the % discount
        uint256[] tokenIds; // token Ids for ERC1155
    }


    /*
     * @DIIMIIM This is used to handle all discounts
     */
    mapping(uint256 => Discount) public discounts;
    
    
    function addDiscount(uint8 _tokenType, address _tokenContract, uint8 _discount, uint256[] memory _tokenIds) external onlyOwner {
        discounts[discountId].tokenType = _tokenType;
        discounts[discountId].tokenContract = _tokenContract;
        discounts[discountId].discount = _discount;
        discounts[discountId].tokenIds = _tokenIds;
        ++discountId;
    }
    
    /*
     * @DIIMIIM To discuss this method with @Matei
     */
    function calculateDiscount(address requester) external view returns(uint256){
        for (uint i = 0; i < discountId; ++i){
            
            // token type 1 is first to check to ensure the biggest discount will be applied
            // if user has a erc 1155 for discount
            if ( discounts[i].tokenType == 1 )
                for (uint j = 0; j < discounts[i].tokenIds.length ; ++j)
                    if ( IERC1155(discounts[i].tokenContract).balanceOf(requester,discounts[i].tokenIds[j]) > 0 )
        	            return discounts[i].discount;    

            // if user has a geyser stake for discount
            if ( discounts[i].tokenType == 2 )
                if ( Geyser(discounts[i].tokenContract).totalStakedFor(requester) > 0 )
                    return discounts[i].discount;
        	            
            // if user has a erc 721 for discount 
            if ( discounts[i].tokenType == 0 )
                for (uint j = 0; j < discounts[i].tokenIds.length ; ++j)
                    if ( IERC721(discounts[i].tokenContract).ownerOf(discounts[i].tokenIds[j]) == requester )
                        return discounts[i].discount;
                        
        }                
        return 1;
    }

}