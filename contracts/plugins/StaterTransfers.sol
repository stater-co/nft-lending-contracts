// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';


contract StaterTransfers is Ownable {
    

    /*
     * @DIIMIIM : standard method to send tokens from an account to another ( + payment fee to admin )
     */
    function transferTokens(
        address from,
        address payable to,
        address currency,
        uint256 qty1,
        uint256 qty2
    ) public {
      if ( currency != address(0) ){
          require(IERC20(currency).transferFrom(
              from,
              to, 
              qty1
          ), "Transfer of tokens to receiver failed");
          require(IERC20(currency).transferFrom(
              from,
              owner(), 
              qty2
          ), "Transfer of tokens to Stater failed");
      }else{
          require(to.send(qty1), "Transfer of ETH to receiver failed");
          require(payable(owner()).send(qty2), "Transfer of ETH to Stater failed");
      }
    }

    function checkTokensApproval(
        address from,
        address currency
    ) public view returns(uint256) {
        return IERC20(currency).allowance(from,address(this));
    }

    function checkItemsApproval(
        address sender,
        address[] memory nftAddressArray, 
        uint256[] memory nftTokenIdArray,
        uint8[] memory nftTokenTypeArray
    ) public view returns(uint256) {
        for(uint256 i = 0; i < nftAddressArray.length; ++i) 
            if ( nftTokenTypeArray[i] == 0 )
                require(IERC721(nftAddressArray[i]).getApproved(nftTokenIdArray[i]) == address(this));
            else
                require(
                    IERC1155(nftAddressArray[i]).isApprovedForAll(sender,address(this))
                );
    }

    /*
     * @DIIMIIM : standard method to send items from an account to another
     */
    function transferItems(
        address from, 
        address to, 
        address[] memory nftAddressArray, 
        uint256[] memory nftTokenIdArray,
        uint8[] memory nftTokenTypeArray
    ) public {
        for(uint256 i = 0; i < nftAddressArray.length; ++i) 
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