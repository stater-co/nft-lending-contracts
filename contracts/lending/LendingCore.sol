// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
import '@openzeppelin/contracts/access/Ownable.sol';
import '../plugins/StaterTransfers.sol';
import '../workers/IStaterDiscounts.sol';
import '../params/LendingConstructor.sol';
import '../params/CreateLoanParams.sol';
import 'hardhat/console.sol';

contract LendingCore is Ownable, StaterTransfers {
    
    /*
     * @DIIMIIM : The loan events
     */
    event NewLoan(
        address indexed owner,
        address indexed currency,
        uint256 indexed loanId,
        address[] nftAddressArray,
        uint256[] nftTokenIdArray,
        uint8[] nftTokenTypeArray
    );
    event EditLoan(
        address indexed currency,
        uint256 indexed loanId,
        uint256 loanAmount,
        uint256 amountDue,
        uint256 installmentAmount,
        uint256 assetsValue,
        uint256 frequencyTime,
        uint256 frequencyTimeUnit
    );
    event LoanApproved(
        address indexed lender,
        uint256 indexed loanId,
        uint256 loanPaymentEnd
    );
    event LoanCancelled(
        uint256 indexed loanId
    );
    event ItemsWithdrawn(
        address indexed requester,
        uint256 indexed loanId,
        Status status
    );
    event LoanPayment(
        uint256 indexed loanId,
        uint256 installmentAmount,
        uint256 amountPaidAsInstallmentToLender,
        uint256 interestPerInstallement,
        uint256 interestToStaterPerInstallement,
        Status status
    );
    event LoanOffer(
        uint256 indexed loanId,
        address indexed offerer,
        uint256 offerId,
        uint256 indexed position
    );
    event CloseLoanOffer(
        uint256 indexed loanId,
        address indexed offerer,
        uint256 indexed position
    );
    event LoanOfferApproved(
        address indexed lender,
        uint256 indexed loanId,
        uint256 indexed offerId,
        uint256 offerAmount,
        uint256 loanPaymentEnd
    );
    
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
    address public lendingMethodsAddress;
    IStaterDiscounts public discounts;
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
        address[] offerers; // the array of offerers
        address payable borrower; // the address who receives the loan
        address payable lender; // the address who gives/offers the loan to the borrower
        address currency; // the token that the borrower lends, address(0) for ETH
        Status status; // the loan status
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256[] offers;
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
    
    
    /*
     * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
     * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
     * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
     */
    function canBeTerminated(uint256 loanId) public view returns(bool) {
        require(loans[loanId].status == Status.APPROVED || loans[loanId].status == Status.LIQUIDATED, 'Loan is not yet approved');
        // return last paid installment date + defaultingLimit * installment time interval <= block.timestamp
        return ( loans[loanId].startEnd[0] + loans[loanId].nrOfPayments * loans[loanId].installmentTime ) + loans[loanId].defaultingLimit * loans[loanId].installmentTime <= min(block.timestamp,loans[loanId].startEnd[1]);
    }

    // Checks the loan to value ratio
    function checkLtv(uint256 loanValue, uint256 assetsValue) public view {
        require(loanValue <= assetsValue / 100 * ltv, 'LTV too high');
    }


    function min(uint256 a, uint256 b) internal pure returns(uint256) {
        return a < b ? a : b;
    }

    function getLoanStartEnd(uint256 loanId) external view returns(uint256[2] memory) {
        return loans[loanId].startEnd;
    }

}