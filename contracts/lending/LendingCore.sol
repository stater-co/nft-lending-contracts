// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../plugins/StaterTransfers.sol";
interface StaterDiscounts {
    function calculateDiscount(address requester) external view returns(uint256);
}


contract LendingCore is StaterTransfers {
    
    address public loanHandler;
    address public promissoryHandler;
    address public discountsHandler;
    address public poolHandler;
    uint256 public ltv;
    uint256 public interestRate;
    uint256 public interestRateToStater;
    uint32 public lenderFee;
    
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
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 installmentTime; // the installment unix timestamp
        uint256 nrOfPayments; // the number of installments paid
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
        uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
        uint16 nrOfInstallments; // the number of installments that the borrower must pay.
        uint8[] nftTokenTypeArray; // the token types : ERC721 , ERC1155 , ...
    }
    
    struct LoanControlPanel {
        Status status; // the loan status
        uint256 poolId; // the pool ID in case the loan is owned via pool
        uint8 defaultingLimit; // the number of installments allowed to be missed without getting defaulted
        uint256[2] startEnd; // startEnd[0] loan start date , startEnd[1] loan end date
        uint256 installmentAmount; // amount expected for each installment
        uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
        uint256 paidAmount; // the amount that has been paid back to the lender to date
        address loanHandler; // the address of the smart contract loan handler
        address promissoryHandler; // the address of the smart contract promissory handler
        address discountsHandler; // the address of the smart contract discounts handler
        address poolHandler; // the address of the lending pool contract
    }
    
    struct LoanFeesHandler {
        uint256 ltv;
        uint256 interestRate;
        uint256 interestRateToStater;
        uint32 lenderFee;
    }
    
    /*
     * @DIIMIIM : public mappings
     *   loans - the loans mapping
     */
    uint256 public id = 1;
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => LoanControlPanel) public loanControlPanels;
    mapping(uint256 => LoanFeesHandler) public loanFeesHandler;
    
    // Calculates loan to value ratio
    function _percent(uint256 numerator, uint256 denominator) internal pure returns(uint256) {
        return (((numerator * 10000) / denominator) + 5) / 10;
    }
    
    /*
     * @DIIMIIM: Not possible to send non payable transactions from a solidity method unless we use the interface
     * So we'll have to use this as the calculateDiscount standard
     */
    function calculateDiscount(uint256 loanId, address onBehalfOf) internal view returns(uint256) {
        return StaterDiscounts(loanControlPanels[loanId].discountsHandler).calculateDiscount(onBehalfOf);
    }

}