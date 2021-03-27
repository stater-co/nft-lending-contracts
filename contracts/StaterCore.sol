// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155Holder.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
interface Geyser{ function totalStakedFor(address addr) external view returns(uint256); }

contract StaterCore is ERC721Holder, ERC1155Holder, Ownable {
    using SafeMath for uint256;
    address public nftAddress; //0xcb13DC836C2331C669413352b836F1dA728ce21c
    address public promissoryNoteContractAddress;


    /*
    * @DIIMIIM This is gonna handle all the Stater Core permissions
    * @The stater admin will be able to add new permissions identified by a bytes32 signature for the new stater smart contracts
    */
    mapping(bytes32 => address) public permissions;
    function setPermission(bytes32 signature, address contractAddress) external onlyOwner {
        permissions[signature] = contractAddress;
    }


    address public lendingMethodsContract;
    address public lendingPoolContract;
    address[] public geyserAddressArray; //[0xf1007ACC8F0229fCcFA566522FC83172602ab7e3]
    uint256[] public staterNftTokenIdArray; //[0, 1]
    uint256 public loanID;
    uint256 public ltv = 600; // 60%
    uint256 public installmentFrequency = 1;
    uint256 public interestRate = 20;
    uint256 public interestRateToStater = 40;
    uint32 public discountNft = 50;
    uint32 public discountGeyser = 5;
    uint32 public lenderFee = 100;
    enum TimeScale{ MINUTES, HOURS, DAYS, WEEKS }
    TimeScale public installmentTimeScale = TimeScale.WEEKS;
    enum Status{ UNINITIALIZED, LISTED, APPROVED, DEFAULTED, LIQUIDATED, CANCELLED, WITHDRAWN }
    event NewLoan(uint256 indexed loanId, address indexed owner, uint256 creationDate, address indexed currency, Status status, string creationId);
    event LoanApproved(uint256 indexed loanId, address indexed lender, uint256 approvalDate, uint256 loanPaymentEnd, Status status);
    event LoanCancelled(uint256 indexed loanId, uint256 cancellationDate, Status status);
    event ItemsWithdrawn(uint256 indexed loanId, address indexed requester, Status status);
    event LoanPayment(uint256 indexed loanId, uint256 paymentDate, uint256 installmentAmount, uint256 amountPaidAsInstallmentToLender, uint256 interestPerInstallement, uint256 interestToStaterPerInstallement, Status status);
    struct Loan {
        address[] nftAddressArray; // the adderess of the ERC721
        address payable borrower; // the address who receives the loan
        address payable lender; // the address who gives/offers the loan to the borrower
        address currency; // the token that the borrower lends, address(0) for ETH
        Status status; // the loan status
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
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => address) public promissoryPermissions;


    /*
    * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
    * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
    * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
    */
    function lackOfPayment(uint256 loanId) public view returns(bool) {
        return loans[loanId].status == Status.APPROVED && loans[loanId].loanStart.add(loans[loanId].nrOfPayments.mul(generateInstallmentFrequency())) <= block.timestamp.sub(loans[loanId].defaultingLimit.mul(generateInstallmentFrequency()));
    }

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

    // Transfer items fron an account to another
    function _transferItems(
        address from, 
        address to, 
        address[] memory nftAddressArray, 
        uint256[] memory nftTokenIdArray,
        TokenType[] memory nftTokenTypeArray
    ) internal {
        uint256 length = nftAddressArray.length;
        require(length == nftTokenIdArray.length && nftTokenTypeArray.length == length, "Token infos provided are invalid");
        for(uint256 i = 0; i < length; ++i) 
            if ( nftTokenTypeArray[i] == TokenType.ERC721 )
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