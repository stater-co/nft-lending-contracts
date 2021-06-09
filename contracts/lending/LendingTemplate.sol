// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract LendingTemplate is Ownable, LendingCore {
    using SafeMath for uint256;

    constructor(
        address _promissoryNoteAddress,
        address _lendingMethodsAddress,
        address _lendingDiscountsAddress
    ) {
        promissoryNoteAddress = _promissoryNoteAddress;
        lendingMethodsAddress = _lendingMethodsAddress;
        discounts = StaterDiscounts(_lendingDiscountsAddress);
    }
    
    modifier lendingMethodsUp {
        require(lendingMethodsAddress != address(0),"Lending methods contract not established");
        _;
    }

    modifier promissoryNoteUp {
        require(promissoryNoteAddress == msg.sender,"Promissory note contract not established");
        _;
    }

    // Borrower creates a loan
    function createLoan(
        uint256 loanAmount,
        uint16 nrOfInstallments,
        address currency,
        uint256 assetsValue, 
        address[] calldata nftAddressArray, 
        uint256[] calldata nftTokenIdArray,
        uint8[] calldata nftTokenTypeArray
    ) external lendingMethodsUp {
        
        // For 8 or more parameters via delegatecall >> Remix raises an error with no error message
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "createLoan(uint256,uint16,address,uint256,address[],uint256[],uint8[])",
                loanAmount,nrOfInstallments,currency,assetsValue,nftAddressArray,nftTokenIdArray,nftTokenTypeArray
            )
        );
        require(success,"Failed to createLoan via delegatecall");
    }

    function editLoan(
        uint256 loanId,
        uint256 loanAmount,
        uint16 nrOfInstallments,
        address currency,
        uint256 assetsValue,
        uint256[3] memory intallmentTime
    ) external lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "editLoan(uint256,uint256,uint16,address,uint256,uint256[3])",
                loanId,loanAmount,nrOfInstallments,currency,assetsValue,intallmentTime
            )
        );
        require(success,"Failed to editLoan via delegatecall");
    }


    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "approveLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
    
    
    // Lender approves a loan
    function approveLoanWithPool(uint256 loanId, uint256 poolId) external payable lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "approveLoanWithPool(uint256,uint256)",
                loanId,poolId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
    

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "cancelLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
  
  
    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId,uint256 amount) external payable lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "payLoan(uint256,uint256)",
                loanId,amount
            )
        );
        require(success,"Failed to payLoan via delegatecall");
    }


    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) external lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "terminateLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to terminateLoan via delegatecall");
    }

  
    function setGlobalVariables(
        uint256 _ltv, 
        uint256 _interestRate, 
        uint256 _interestRateToStater, 
        uint32 _lenderFee,
        address _promissoryNoteAddress,
        address _lendingMethodsAddress,
        address _lendingDiscountsAddress
    ) external onlyOwner lendingMethodsUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "setGlobalVariables(uint256,uint256,uint256,uint32,address,address,address)",
                _ltv,_interestRate,_interestRateToStater,_lenderFee,_promissoryNoteAddress,_lendingMethodsAddress,_lendingDiscountsAddress
            )
        );
        require(success,"Failed to setGlobalVariables via delegatecall");
    }
    
    function promissoryExchange(address from, address payable to, uint256[] calldata loanIds) external lendingMethodsUp promissoryNoteUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(address,address,uint256[])",
                from,to,loanIds
            )
        );
        require(success,"Lending Template: Failed to execute promissoryExchange via delegatecall");
    }
  
    function setPromissoryPermissions(uint256[] calldata loanIds, address sender, address allowed) external lendingMethodsUp promissoryNoteUp {
        
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "setPromissoryPermissions(uint256[],address,address)",
                loanIds,sender,allowed
            )
        );
        require(success,"Lending Template: Failed to execute setPromissoryPermissions via delegatecall");
    }
    
    function getLoanRemainToPay(uint256 loanId) external view returns(uint256) {
        return loans[loanId].amountDue.sub(loans[loanId].paidAmount);
    }

    
    function getLoanApprovalCost(uint256 loanId) external view returns(uint256,uint256,uint256,uint256,address) {
        return (
            loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discounts.calculateDiscount(msg.sender))),
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
        
        overallInstallmentAmount = uint256(loans[loanId].installmentAmount.mul(nrOfInstallments));
        interestPerInstallement = uint256(overallInstallmentAmount.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments));
        interestDiscounted = interestPerInstallement.mul(interestRateToStater).div(100).div(discount); // amount of interest saved per installment
        interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100).sub(interestDiscounted);
        amountPaidAsInstallmentToLender = interestPerInstallement.mul(uint256(100).sub(interestRateToStater)).div(100); 
    }
    
    function getLoanStartEnd(uint256 loanId) external view returns(uint256[2] memory) {
        return loans[loanId].startEnd;
    }
    
    function getLoanApprovalCostOnly(uint256 loanId) external view returns(uint256) {
        return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discounts.calculateDiscount(msg.sender)));
    }
  
}