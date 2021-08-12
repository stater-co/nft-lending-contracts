// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "./LendingCore.sol";
import "./LendingCoreMethods.sol";


contract LendingTemplate is Ownable, LendingCore, LendingCoreMethods {
    
    /*
     * @DIIMIIM
     * Loan methods here 
     */

    /*
     * @DIIMIIM
     * Promissory methods here 
     */

    
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address) {
        return (
            loans[loanId].loanAmount + (loans[loanId].loanAmount / lenderFee / discounts.calculateDiscount(msg.sender)),
            loans[loanId].loanAmount,
            lenderFee,
            discounts.calculateDiscount(msg.sender),
            msg.sender
        );
    }
    
    function getLoanInstallmentCost(
        uint256 loanId,
        uint256 nrOfInstallments
    ) external view returns(
        uint256 overallInstallmentAmount,
        uint256 interestPerInstallement,
        uint256 interestDiscounted,
        uint256 interestToStaterPerInstallement,
        uint256 amountPaidAsInstallmentToLender
    ) {
        require(nrOfInstallments <= loans[loanId].nrOfInstallments, "Number of installments too high");
        uint256 discount = discounts.calculateDiscount(msg.sender);
        interestDiscounted = 0;
        
        overallInstallmentAmount = uint256(loanControlPanels[loanId].installmentAmount * nrOfInstallments);
        interestPerInstallement = uint256(overallInstallmentAmount * interestRate / 100 / loans[loanId].nrOfInstallments);
        interestDiscounted = interestPerInstallement * interestRateToStater / 100 / discount; // amount of interest saved per installment
        interestToStaterPerInstallement = interestPerInstallement * interestRateToStater / 100 / interestDiscounted;
        amountPaidAsInstallmentToLender = interestPerInstallement * (100 / interestRateToStater) / 100; 
    }
    
    function getLoanStartEnd(uint256 loanId) external view returns(uint256[2] memory) {
        return loanControlPanels[loanId].startEnd;
    }
    
    function getLoanApprovalCostOnly(uint256 loanId) external view returns(uint256) {
        return loans[loanId].loanAmount + (loans[loanId].loanAmount / lenderFee / discounts.calculateDiscount(msg.sender));
    }
  
}