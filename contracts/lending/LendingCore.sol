// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
import "../plugins/StaterTransfers.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
interface StaterDiscounts {
    function calculateDiscount(address requester) external view returns(uint256);
}


contract LendingCore is StaterTransfers {
    using SafeMath for uint256;
    using SafeMath for uint8;
    
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
    address public promissoryNoteAddress;
    address public lendingMethodsAddress;
    StaterDiscounts public discounts;
    uint256 public id = 1; // the loan ID
    uint256 public ltv = 60; // 60%
    uint256 public interestRate = 20;
    uint256 public interestRateToStater = 40;
    uint32 public lenderFee = 100;
    enum Status{ 
        LISTED, 
        APPROVED, 
        LIQUIDATED, 
        CANCELLED, 
        WITHDRAWN 
    }
    
    
    /*
     * @DIIMIIM : The loan structure
     */
    struct Loan {
        address[] nftAddressArray; // the adderess of the ERC721
        address payable borrower; // the address who receives the loan
        address payable lender; // the address who gives/offers the loan to the borrower
        address currency; // the token that the borrower lends, address(0) for ETH
        Status status; // the loan status
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 installmentTime; // the installment unix timestamp
        uint256 nrOfPayments; // the number of installments paid
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
        uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
        uint256[2] startEnd; // startEnd[0] loan start date , startEnd[1] loan end date
        uint256 installmentAmount; // amount expected for each installment
        uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
        uint256 paidAmount; // the amount that has been paid back to the lender to date
        uint16 nrOfInstallments; // the number of installments that the borrower must pay.
        uint8 defaultingLimit; // the number of installments allowed to be missed without getting defaulted
        uint8[] nftTokenTypeArray; // the token types : ERC721 , ERC1155 , ...
    }
    
    /*
     * @DIIMIIM : public mappings
     *   loans - the loans mapping
     */
    mapping(uint256 => Loan) public loans;
    
    // @notice Mapping for all the loans that are approved by the owner in order to be used in the promissory note
    mapping(uint256 => address) public promissoryPermissions;
    
    modifier isPromissoryNote {
        require(msg.sender == promissoryNoteAddress, "Lending Methods: Access denied");
        _;
    }
    
    /*
     * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
     * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
     * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
     */
    function canBeTerminated(uint256 loanId) public view returns(bool) {
        require(loans[loanId].status == Status.APPROVED, "Loan is not yet approved");
        // return last paid installment date + defaultingLimit * installment time interval <= block.timestamp
        return loans[loanId].startEnd[0].add(loans[loanId].nrOfPayments.mul(loans[loanId].installmentTime)).add(loans[loanId].defaultingLimit.mul(loans[loanId].installmentTime)) <= min(block.timestamp,loans[loanId].startEnd[1]);
    }

    // Checks the loan to value ratio
    function checkLtv(uint256 loanValue, uint256 assetsValue) internal view {
        require(loanValue <= assetsValue / 100 * ltv, "LTV too high");
    }


    function min(uint256 a, uint256 b) internal pure returns(uint256) {
        return a < b ? a : b;
    }
}