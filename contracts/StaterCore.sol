// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "./openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";
import "./openzeppelin-solidity/contracts/access/Ownable.sol";

contract StaterCore is ERC721Holder, ERC1155Holder, Ownable {


    /*
    * @DIIMIIM This is gonna handle all the Stater Core permissions
    * @The stater admin will be able to add new permissions identified by a bytes32 signature for the new stater smart contracts
    */
    mapping(bytes32 => address) public permissions;
    function setPermission(bytes32 signature, address contractAddress) external onlyOwner {
        permissions[signature] = contractAddress;
    }


    /*
     * @DIIMIIM This array of addresses will be used to verify users discounts
     */
    address[] public geyserAddressArray; //[0xf1007ACC8F0229fCcFA566522FC83172602ab7e3]
    
    
    /*
     * @DIIMIIM This is the nft token IDs array to verify on NFT1155 discounts
     */
    uint256[] public staterNftTokenIdArray; //[0, 1]
    
    
    /*
     * @DIIMIIM Public & global variables for the lending contract
     * id : the loan ID, id will be the actual loans mapping length
     * ltv : max allowed 60%
     * interestRate : 20% of the payment
     * interestRateToStater : 40% of interestRate
     * discountNft : 50% discount
     * discountGeyser : 5% discount
     * lenderFee : 1%
     * Status : provides the loans status 
     *   LISTED - loan is created and visible on lending.stater.co
     *   APPROVED - lender found and assigned to loan
     *   LIQUIDATED - all loan payments are paid
     *   CANCELLED - loan is cancelled before a lender to be assigned
     *   WITHDRAWN - loan is LIQUIDATED and items are withdrawn to either lender or borrower
     */
    uint256 public id; // the loan ID
    uint256 public ltv = 600; // 60%
    uint256 public interestRate = 20;
    uint256 public interestRateToStater = 40;
    uint32 public discountNft = 50;
    uint32 public discountGeyser = 5;
    uint32 public lenderFee = 100;
    enum Status{ 
        LISTED, 
        APPROVED, 
        LIQUIDATED, 
        CANCELLED, 
        WITHDRAWN 
    }
    
    
    /*
     * @DIIMIIM : The loan events
     */
    event NewLoan(
        uint256 indexed loanId, 
        address indexed owner, 
        uint256 creationDate, 
        address indexed currency, 
        Status status, 
        string creationId
    );
    event LoanApproved(
        uint256 indexed loanId, 
        address indexed lender, 
        uint256 approvalDate, 
        uint256 loanPaymentEnd, 
        Status status
    );
    event LoanCancelled(
        uint256 indexed loanId, 
        uint256 cancellationDate, 
        Status status
    );
    event ItemsWithdrawn(
        uint256 indexed loanId, 
        address indexed requester, 
        Status status
    );
    event LoanPayment(
        uint256 indexed loanId, 
        uint256 paymentDate, 
        uint256 installmentAmount, 
        uint256 amountPaidAsInstallmentToLender, 
        uint256 interestPerInstallement, 
        uint256 interestToStaterPerInstallement, 
        Status status
    );
    
    
    /*
     * @DIIMIIM : The loan structure
     */
    struct Loan {
        address[] nftAddressArray; // the adderess of the ERC721
        address payable borrower; // the address who receives the loan
        address payable lender; // the address who gives/offers the loan to the borrower
        address currency; // the token that the borrower lends, address(0) for ETH
        Status status; // the loan status
        mapping(uint256 => uint16) installmentsTimeHandler; // installmentsTimeHandler[1 days] = 4 ; installmentsTimeHandler[1 hours] = 3; >> 1 installment per 4 days & 3 hours
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
        uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
        uint256 loanStart; // the point when the loan is approved
        uint256 loanEnd; // the point when the loan is approved to the point when it must be paid back to the lender
        uint256 nrOfInstallments; // the number of installments that the borrower must pay.
        uint256 installmentAmount; // amount expected for each installment
        uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
        uint256 paidAmount; // the amount that has been paid back to the lender to date
        uint256 defaultingLimit; // the number of installments allowed to be missed without getting defaulted
        uint256 nrOfPayments; // the number of installments paid
        uint32[] nftTokenTypeArray; // the token types : ERC721 , ERC1155 , ...
    }
    
    /*
     * @DIIMIIM : public mappings
     *   loans - the loans mapping
     *   promissoryPermissions - used to implement the promissory feature
     */
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => address) public promissoryPermissions;


    /*
     * @DIIMIIM : standard method to send tokens from an account to another ( + payment fee to admin )
     */
    function _transferTokens(
        address from,
        address payable to,
        address currency,
        uint256 qty1,
        uint256 qty2
    ) internal {
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


    /*
     * @DIIMIIM : standard method to send items from an account to another
     */
    function _transferItems(
        address from, 
        address to, 
        address[] memory nftAddressArray, 
        uint256[] memory nftTokenIdArray,
        uint32[] memory nftTokenTypeArray
    ) internal {
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