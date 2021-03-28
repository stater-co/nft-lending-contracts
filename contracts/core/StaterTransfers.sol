// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "../multi-token-standard/contracts/interfaces/IERC1155.sol";
import "../openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";

contract StaterTransfers is ERC721Holder, ERC1155Holder {
    

    /*
     * @DIIMIIM : standard method to send tokens from an account to another ( + payment fee to admin )
     */
    function _transferTokens(
        address from,
        address payable to,
        address currency,
        uint256 qty1,
        uint256 qty2,
        address payable admin
    ) external {
      if ( currency != address(0) ){
          require(IERC20(currency).transferFrom(
              from,
              to, 
              qty1
          ), "Transfer of tokens to receiver failed");
          require(IERC20(currency).transferFrom(
              from,
              admin, 
              qty2
          ), "Transfer of tokens to Stater failed");
      }else{
          require(to.send(qty1), "Transfer of ETH to receiver failed");
          require(admin.send(qty2), "Transfer of ETH to Stater failed");
      }
    }


    /*
     * @DIIMIIM : standard method to send items from an account to another
     */
    function _transferItems(
        address from, 
        address to, 
        address[] memory nftAddressArray, 
        uint256[] memory nftTokenIdArray,
        uint32[] memory nftTokenTypeArray
    ) external {
        uint256 length = nftAddressArray.length;
        require(length == nftTokenIdArray.length && nftTokenTypeArray.length == length, "Token infos provided are invalid");
        for(uint256 i = 0; i < length; ++i) 
            if ( nftTokenTypeArray[i] == 0 )
                IERC721(nftAddressArray[i]).safeTransferFrom(
                    from,
                    to,
                    nftTokenIdArray[i]
                );
            else
                IERC1155(nftAddressArray[i]).safeTransferFrom(
                    from,
                    to,
                    nftTokenIdArray[i],
                    1,
                    '0x00'
                );
    }
    

}