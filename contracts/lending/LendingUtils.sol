// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../core/StaterCore.sol";

contract LendingUtils is StaterCore {
    using SafeMath for uint256;
    using SafeMath for uint16;
    using SafeMath for uint8;

    function getLoanApprovalCost(uint256 loanId) public view returns(uint256,uint256,uint256,uint256,address) {
        return (
            loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(calculateDiscount(msg.sender))),
            loans[loanId].loanAmount,
            lenderFee,
            calculateDiscount(msg.sender),
            msg.sender
        );
    }


    function getLoanRemainToPay(uint256 loanId) public view returns(uint256) {
        return loans[loanId].amountDue.sub(loans[loanId].paidAmount);
    }

    /*
    * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
    * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
    * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
    */
    function lackOfPayment(uint256 loanId) public view returns(bool) {
        return 
            loans[loanId].status == Status.APPROVED 
                && 
            loans[loanId].loanStart.add(
                loans[loanId].nrOfPayments.mul(
                    getLoanPaymentFrequency(loanId).div(
                        loans[loanId].nrOfInstallments
                    )
                )
            ) <= block.timestamp.sub(
                loans[loanId].defaultingLimit.mul(
                    getLoanPaymentFrequency(loanId).div(
                        loans[loanId].nrOfInstallments
                    )
                )
            );
    }

    // Calculates loan to value ratio
    function _percent(uint256 numerator, uint256 denominator) public pure returns(uint256) {
        return numerator.mul(10000).div(denominator).add(5).div(10);
    }
    
    function getLoanPaymentFrequency(uint256 loanId) public view returns(uint256) {
        return loans[loanId].installmentsTimeHandler[0].mul(1 weeks).add(
            loans[loanId].installmentsTimeHandler[1].mul(1 days).add(
                loans[loanId].installmentsTimeHandler[2].mul(1 hours)
            )
        );
    }
    
}