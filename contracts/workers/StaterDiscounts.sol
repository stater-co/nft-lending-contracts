// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
import "../libs/openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../libs/multi-token-standard/contracts/interfaces/IERC1155.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
interface Geyser{ function totalStakedFor(address addr) external view returns(uint256); }

contract StaterDiscounts is Ownable {


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
    
    function getDiscountTokenId(uint256 _discountId, uint256 tokenIdIndex) external view returns(uint256) {
        return discounts[_discountId].tokenIds[tokenIdIndex];
    }
    
    function editDiscount(uint256 _discountId, address _tokenContract, uint8 _discount, uint256[] calldata _tokenIds, uint8 _tokenType) external onlyOwner {
        discounts[_discountId].tokenContract = _tokenContract;
        discounts[_discountId].discount = _discount;
        discounts[_tokenType].tokenType = _tokenType;
        uint256 l = discounts[_discountId].tokenIds.length;
        for (uint256 i = 0; i < _tokenIds.length && i < l; ++i)
            discounts[_discountId].tokenIds[i] = _tokenIds[i];
        if ( _tokenIds.length > l )
            for ( uint256 i = l; i < _tokenIds.length; ++i )
                discounts[_discountId].tokenIds.push(_tokenIds[i]);
    }
    
    /*
     * @DIIMIIM To discuss this method with @Matei
     */
    function calculateDiscount(address requester) public view returns(uint256){
        uint256 toReturn = 1;
        for (uint i = 0; i < discountId; ++i) {
            
            // token type 1 is first to check to ensure the biggest discount will be applied
            // if user has a erc 1155 for discount
            if ( discounts[i].tokenType == 1 )
                for (uint j = 0; j < discounts[i].tokenIds.length ; ++j)
                    if ( ( toReturn > discounts[i].discount || toReturn == 1 ) && discounts[i].discount > 1 )
                        if ( IERC1155(discounts[i].tokenContract).balanceOf(requester,discounts[i].tokenIds[j]) > 0 )
                            toReturn = discounts[i].discount;    

            // if user has a geyser stake for discount
            if ( discounts[i].tokenType == 2 )
                if ( ( toReturn > discounts[i].discount || toReturn == 1 ) && discounts[i].discount > 1 )
                    if ( Geyser(discounts[i].tokenContract).totalStakedFor(requester) > 0 )
    	                toReturn = discounts[i].discount;  

            // if user has a erc 721 for discount 
            if ( discounts[i].tokenType == 0 )
                for (uint j = 0; j < discounts[i].tokenIds.length ; ++j)
                    if ( ( toReturn > discounts[i].discount || toReturn == 1 ) && discounts[i].discount > 1 )
                        if ( IERC721(discounts[i].tokenContract).ownerOf(discounts[i].tokenIds[j]) == requester )
        	               toReturn = discounts[i].discount;  
                        
        }                
        return toReturn;
    }
    
    function getTotalStakedFor(address tokenGeyser, address user) external view returns(uint256) {
        return Geyser(tokenGeyser).totalStakedFor(user);
    }

}