// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/access/Ownable.sol";
import "./StaterDiplomat.sol";
import "./StaterTransfers.sol";
import "./StaterDiscounts.sol";

contract StaterCore is Ownable, StaterDiplomat, StaterTransfers, StaterDiscounts {
    
    
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
    bytes32 constant lendingMethodsSignature = "LENDING_SETTERS";
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
    
        /*
         * @DIIMIIM : A fixed size array used to calculate the loan installment time
         * On position 0 will be the number of weeks an installment time has
         * On position 1 will be the number of days an installment time has
         * On position 2 will be the number of hours an installment time has
         * Ex of usage : installmentsTimeHandler[0] = 2 ; installmentsTimeHandler[1] = 3 ; installmentsTimeHandler[2] = 4 >> the installment time will be 2 weeks 3 days and 4 hours
         */    
        uint256[3] installmentsTimeHandler;
        
        
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
        uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
        uint256 loanStart; // the point when the loan is approved
        uint256 loanEnd; // the point when the loan is approved to the point when it must be paid back to the lender
        uint256 installmentAmount; // amount expected for each installment
        uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
        uint256 paidAmount; // the amount that has been paid back to the lender to date
        uint16 nrOfInstallments; // the number of installments that the borrower must pay.
        uint16 nrOfPayments; // the number of installments paid
        uint8 defaultingLimit; // the number of installments allowed to be missed without getting defaulted
        uint8[] nftTokenTypeArray; // the token types : ERC721 , ERC1155 , ...
    }
    
    /*
     * @DIIMIIM : public mappings
     *   loans - the loans mapping
     *   promissoryPermissions - used to implement the promissory feature
     */
    mapping(uint256 => Loan) public loans;
    mapping(uint256 => address) public promissoryPermissions;


}