// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./StaterCore.sol";

contract LendingCore is StaterCore {

    constructor(address _nftAddress, address _promissoryNoteContractAddress, address[] memory _geyserAddressArray, uint256[] memory _staterNftTokenIdArray, address _lendingMethodsContract, address _lendingPoolContract) {
        nftAddress = _nftAddress;
        geyserAddressArray = _geyserAddressArray;
        staterNftTokenIdArray = _staterNftTokenIdArray;
        promissoryNoteContractAddress = _promissoryNoteContractAddress;
        lendingMethodsContract = _lendingMethodsContract;
        lendingPoolContract = _lendingPoolContract;
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
        (bool success, bytes memory result) = lendingMethodsContract.delegatecall(
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
        (bool success, ) = lendingMethodsContract.delegatecall(
            abi.encodeWithSignature(
                "editLoan(uint256,uint256,uint256,uint256,address)",
                loanId,assetsValue,loanAmount,nrOfInstallments,currency
            )
        );
        require(success,"Failed to editLoan via delegatecall");
    }

    // Lender approves a loan
    function approveLoan(uint256 loanId) public payable {
            (bool success, ) = lendingMethodsContract.delegatecall(
                abi.encodeWithSignature(
                    "approveLoan(uint256)",
                    loanId
                )
            );
            require(success,"Failed to approveLoan via delegatecall");
    }
    

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) public payable {
        (bool success, ) = lendingMethodsContract.delegatecall(
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
        (bool success, ) = lendingMethodsContract.delegatecall(
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
        (bool success, ) = lendingMethodsContract.delegatecall(
            abi.encodeWithSignature(
                "terminateLoan(uint256)",
                loanId
            )
        );
        require(success,"Failed to terminateLoan via delegatecall");
    }

  
    function promissoryExchange(uint256[] calldata loanIds, address payable newOwner) public payable {
        (bool success, ) = lendingMethodsContract.delegatecall(
            abi.encodeWithSignature(
                "promissoryExchange(uint256[],address)",
                loanIds,newOwner
            )
        );
        require(success,"Failed to promissoryExchange via delegatecall");
    }

  
    function setPromissoryPermissions(uint256[] calldata loanIds) public payable {
        (bool success, ) = lendingMethodsContract.delegatecall(
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

  
    function setDiscounts(uint32 _discountNft, uint32 _discountGeyser, address[] calldata _geyserAddressArray, uint256[] calldata _staterNftTokenIdArray, address _nftAddress) public payable onlyOwner {
        (bool success, ) = lendingMethodsContract.delegatecall(
            abi.encodeWithSignature(
                "setDiscounts(uint32,uint32,address[],uint256[],address)",
                _discountNft,_discountGeyser,_geyserAddressArray,_staterNftTokenIdArray,_nftAddress
            )
        );
        require(success,"Failed to setDiscounts via delegatecall");
    }

  
    function setGlobalVariables(
        address _promissoryNoteContractAddress, 
        uint256 _ltv, 
        uint256 _interestRate, 
        uint256 _interestRateToStater, 
        uint32 _lenderFee,
        address _lendingMethodsContract
    ) public payable onlyOwner {
        lendingMethodsContract = _lendingMethodsContract;
        (bool success, ) = lendingMethodsContract.delegatecall(
            abi.encodeWithSignature(
                "setGlobalVariables(address,uint256,uint256,uint256,uint32)",
                _promissoryNoteContractAddress,_ltv,_interestRate,_interestRateToStater,_lenderFee
            )
        );
        require(success,"Failed to setGlobalVariables via delegatecall");
    }
  

    function addGeyserAddress(address geyserAddress) external onlyOwner {
        geyserAddressArray.push(geyserAddress);
    }

  
    function addNftTokenId(uint256 nftId) external onlyOwner {
        staterNftTokenIdArray.push(nftId);
    }
  
    function calculateDiscount(address requester) public view returns(uint256){
        for (uint i = 0; i < staterNftTokenIdArray.length; ++i)
            if ( IERC1155(nftAddress).balanceOf(requester,staterNftTokenIdArray[i]) > 0 )
                return uint256(100).div(discountNft);
        for (uint256 i = 0; i < geyserAddressArray.length; ++i)
            if ( Geyser(geyserAddressArray[i]).totalStakedFor(requester) > 0 )
                return uint256(100).div(discountGeyser);
        return 1;
    }
  
}