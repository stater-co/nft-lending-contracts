// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract LendingTemplate is LendingCore {
    using SafeMath for uint256;
    using SafeMath for uint16;

    constructor(
        address _promissoryNoteContractAddress,
        address _lendingMethodsContract,
        address _lendingDiscountsAddress
    ) {
        promissoryNoteAddress = _promissoryNoteContractAddress;
        lendingSettersAddress = _lendingMethodsContract;
        lendingDiscountsAddress = _lendingDiscountsAddress;
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
    ) external {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        // For 8 or more parameters via delegatecall >> Remix raises an error with no error message
        (bool success, ) = lendingSettersAddress.delegatecall(
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
    ) external {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
            abi.encodeWithSignature(
                "editLoan(uint256,uint256,uint16,address,uint256,uint256[3])",
                loanId,loanAmount,nrOfInstallments,currency,assetsValue,intallmentTime
            )
        );
        require(success,"Failed to editLoan via delegatecall");
    }


    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
            abi.encodeWithSignature(
                "approveLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
    

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
            abi.encodeWithSignature(
                "cancelLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
  
  
    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId,uint256 amount) external payable {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
            abi.encodeWithSignature(
                "payLoan(uint256,uint256)",
                loanId,amount
            )
        );
        require(success,"Failed to payLoan via delegatecall");
    }


    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) external {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
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
        address _lendingSettersAddress,
        address _lendingDiscountsAddress
    ) external onlyOwner {
        require(lendingSettersAddress != address(0),"Lending methods contract not established");
        
        (bool success, ) = lendingSettersAddress.delegatecall(
            abi.encodeWithSignature(
                "setGlobalVariables(uint256,uint256,uint256,uint32,address,address,address)",
                _ltv,_interestRate,_interestRateToStater,_lenderFee,_promissoryNoteAddress,_lendingSettersAddress,_lendingDiscountsAddress
            )
        );
        require(success,"Failed to setGlobalVariables via delegatecall");
    }
    
    function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) external {
        require(promissoryNoteAddress != address(0),"Promissory Note contract not established");
        
        (bool success, ) = promissoryNoteAddress.delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(uint256[],address)",
                loanIds,newOwner
            )
        );
        require(success,"Failed to promissoryExchange via delegatecall");
    }
  
    function setPromissoryPermissions(uint256[] calldata loanIds) external {
        require(promissoryNoteAddress != address(0),"Promissory Note contract not established");
        
        (bool success, ) = promissoryNoteAddress.delegatecall(
            abi.encodeWithSignature(
                "setPromissoryPermissions(uint256[])",
                loanIds
            )
        );
        require(success,"Failed to setPromissoryPermissions via delegatecall");
    }
  
}