// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../core/StaterCore.sol";

contract LendingCore is StaterCore {
    using SafeMath for uint256;
    bytes32 constant promissorySignature = "PROMISSORY_NOTE";
    bytes32 constant lendingMethodsSignature = "LENDING_SETTERS";
    bytes32 constant lendingPoolSignature = "LENDING_POOL";

    constructor(
        address _nftAddress, 
        address _promissoryNoteContractAddress, 
        address[] memory _geyserAddressArray, 
        uint256[] memory _staterNftTokenIdArray, 
        address _lendingMethodsContract, 
        address _lendingPoolContract
    ) {
        
        permissions[promissorySignature] = _promissoryNoteContractAddress;
        permissions[lendingMethodsSignature] = _lendingMethodsContract;
        permissions[lendingPoolSignature] = _lendingPoolContract;
        
        addDiscount(uint8(1),_nftAddress,uint8(50),_staterNftTokenIdArray);
        uint256[] memory emptyArray;
        for ( uint256 i = 0 ; i < _geyserAddressArray.length ; ++i )
            addDiscount(uint8(2),_geyserAddressArray[i],uint8(50),emptyArray);
            
    }

    // Borrower creates a loan
    function createLoan(
        uint256 loanAmount,
        uint256 nrOfInstallments,
        address currency,
        uint256 assetsValue, 
        address[] calldata nftAddressArray, 
        uint256[] calldata nftTokenIdArray,
        string calldata creationId,
        uint32[] calldata nftTokenTypeArray
    ) public payable returns(string memory){
        // For 8 or more parameters via delegatecall >> Remix raises an error with no error message
        loans[id].assetsValue = assetsValue;
        (bool success, bytes memory result) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "createLoan(uint256,uint256,address,address[],uint256[],string,uint32[])",
                loanAmount,nrOfInstallments,currency,nftAddressArray,nftTokenIdArray,creationId,nftTokenTypeArray
            )
        );
        require(success,"Failed to createLoan via delegatecall");
        return string(abi.encodePacked(result));
    }

    function editLoan(
        uint256 loanId,
        uint256 assetsValue,
        uint256 loanAmount,
        uint256 nrOfInstallments,
        address currency
    ) external {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "editLoan(uint256,uint256,uint256,uint256,address)",
                loanId,assetsValue,loanAmount,nrOfInstallments,currency
            )
        );
        require(success,"Failed to editLoan via delegatecall");
    }

    // Lender approves a loan
    function approveLoan(uint256 loanId) public payable {
            (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
                abi.encodeWithSignature(
                    "approveLoan(uint256)",
                    loanId
                )
            );
            require(success,"Failed to approveLoan via delegatecall");
    }
    

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) public payable {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "cancelLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to approveLoan via delegatecall");
    }
  
  
    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId) public payable {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "payLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to payLoan via delegatecall");
    }


    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) public payable {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "terminateLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to terminateLoan via delegatecall");
    }

  
    function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) public payable {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(uint256[],address)",
                loanIds,newOwner
            )
        );
        require(success,"Failed to promissoryExchange via delegatecall");
    }

  
    function setPromissoryPermissions(uint256[] calldata loanIds) public payable {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "setPromissoryPermissions(uint256[])",
                loanIds
            )
        );
        require(success,"Failed to setPromissoryPermissions via delegatecall");
    }


    function getLoanApprovalCost(uint256 loanId) external view returns(uint256) {
        return loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(calculateDiscount(msg.sender)));
    }


    function getLoanRemainToPay(uint256 loanId) external view returns(uint256) {
        return loans[loanId].amountDue.sub(loans[loanId].paidAmount);
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
        uint256 discount = calculateDiscount(msg.sender);
        interestDiscounted = 0;
        
        overallInstallmentAmount = uint256(loans[loanId].installmentAmount.mul(nrOfInstallments));
        interestPerInstallement = uint256(overallInstallmentAmount.mul(interestRate).div(100).div(loans[loanId].nrOfInstallments));
        interestDiscounted = interestPerInstallement.mul(interestRateToStater).div(100).div(discount); // amount of interest saved per installment
        interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100).sub(interestDiscounted);
        amountPaidAsInstallmentToLender = interestPerInstallement.mul(uint256(100).sub(interestRateToStater)).div(100); 
    }

  
    function setGlobalVariables(
        address _promissoryNoteContractAddress, 
        uint256 _ltv, 
        uint256 _interestRate, 
        uint256 _interestRateToStater, 
        uint32 _lenderFee
    ) public payable onlyOwner {
        (bool success, ) = permissions[lendingMethodsSignature].delegatecall(
            abi.encodeWithSignature(
                "setGlobalVariables(address,uint256,uint256,uint256,uint32)",
                _promissoryNoteContractAddress,_ltv,_interestRate,_interestRateToStater,_lenderFee
            )
        );
        require(success,"Failed to setGlobalVariables via delegatecall");
    }
  
}