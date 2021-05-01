// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";


contract LendingTemplate is LendingCore {
    using SafeMath for uint256;
    using SafeMath for uint16;

    constructor(
        address _nftAddress, 
        address _promissoryNoteContractAddress, 
        address[] memory _geyserAddressArray, 
        uint256[] memory _staterNftTokenIdArray, 
        address _lendingMethodsContract,
        address _lendingDiscountsAddress
    ) {
        
        promissoryNoteAddress = _promissoryNoteContractAddress;
        lendingMethodsAddress = _lendingMethodsContract;
        lendingDiscountsAddress = _lendingDiscountsAddress;
        discounts = StaterDiscounts(lendingDiscountsAddress);
        
        /*
         * @DIIMIIM : Here the initial discount assigned for marketing will be the NFT1155 tokens
         * The discount will be 50%
         * Other technical explanations : We store it as 2 ( for 50% ) and not 50 ( for 50% , more intuitive ) because this discount value it's saved into 
         * a separated structure and used later. This will create a problem if the global lenderFee value changes, the discounts will differ in this case.
         */
        discounts.addDiscount(uint8(1),_nftAddress,uint8(2),_staterNftTokenIdArray);
        uint256[] memory emptyArray;
        for ( uint256 i = 0 ; i < _geyserAddressArray.length ; ++i )
            discounts.addDiscount(uint8(2),_geyserAddressArray[i],uint8(50),emptyArray);
            
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
        uint256 assetsValue
    ) external {
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "editLoan(uint256,uint256,uint16,address,uint256)",
                loanId,loanAmount,nrOfInstallments,currency,assetsValue
            )
        );
        require(success,"Failed to editLoan via delegatecall");
    }


    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable {
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "approveLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
    

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
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
    function payLoan(uint256 loanId,uint256 amount) external payable {
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
    function terminateLoan(uint256 loanId) external {
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
        uint32 _lenderFee
    ) external onlyOwner {
        (bool success, ) = lendingMethodsAddress.delegatecall(
            abi.encodeWithSignature(
                "setGlobalVariables(address,uint256,uint256,uint256,uint32)",
                _ltv,_interestRate,_interestRateToStater,_lenderFee
            )
        );
        require(success,"Failed to setGlobalVariables via delegatecall");
    }
    
    function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) external {
        (bool success, ) = promissoryNoteAddress.delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(uint256[],address)",
                loanIds,newOwner
            )
        );
        require(success,"Failed to promissoryExchange via delegatecall");
    }
  
    function setPromissoryPermissions(uint256[] calldata loanIds) external {
        (bool success, ) = promissoryNoteAddress.delegatecall(
            abi.encodeWithSignature(
                "setPromissoryPermissions(uint256[])",
                loanIds
            )
        );
        require(success,"Failed to setPromissoryPermissions via delegatecall");
    }
  
}