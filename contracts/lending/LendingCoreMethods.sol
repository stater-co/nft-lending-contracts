// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract LendingCoreMethods is Ownable, LendingCore {

    function getLoanRemainToPay(uint256 loanId) external view returns(uint256) {
        return loanControlPanels[loanId].amountDue - loanControlPanels[loanId].paidAmount;
    }

    
    function calculateDiscount(address discountsHandler) internal view returns(uint256) {
        // For 8 or more parameters via delegatecall >> Remix raises an error with no error message
        (bool success, bytes memory output) = discountsHandler.call(
            abi.encodeWithSignature(
                "calculateDiscount(address)",
                msg.sender
            )
        );
        require(success);
        return abi.decode(output, (uint256));
    }
    
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address) {
        
        uint256 discount = calculateDiscount(loanControlPanels[loanId].discountsHandler);
        
        return (
            loans[loanId].loanAmount + (loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee / discount),
            loans[loanId].loanAmount,
            loanFeesHandler[loanId].lenderFee,
            discount,
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
        uint256 discount = calculateDiscount(loanControlPanels[loanId].discountsHandler);
        interestDiscounted = 0;
        
        overallInstallmentAmount = uint256(loanControlPanels[loanId].installmentAmount * nrOfInstallments);
        interestPerInstallement = uint256(overallInstallmentAmount * loanFeesHandler[loanId].interestRate / 100 / loans[loanId].nrOfInstallments);
        interestDiscounted = interestPerInstallement * loanFeesHandler[loanId].interestRateToStater / 100 / discount; // amount of interest saved per installment
        interestToStaterPerInstallement = interestPerInstallement * loanFeesHandler[loanId].interestRateToStater / 100 / interestDiscounted;
        amountPaidAsInstallmentToLender = interestPerInstallement * (100 / loanFeesHandler[loanId].interestRateToStater) / 100; 
    }
    
    function getLoanStartEnd(uint256 loanId) external view returns(uint256[2] memory) {
        return loanControlPanels[loanId].startEnd;
    }
    
    function getLoanApprovalCostOnly(uint256 loanId) external view returns(uint256) {
        uint256 discount = calculateDiscount(loanControlPanels[loanId].discountsHandler);
        return loans[loanId].loanAmount + (loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee / discount);
    }
  
}