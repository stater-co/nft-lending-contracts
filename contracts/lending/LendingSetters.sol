// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../core/StaterCore.sol";
import "../openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./LendingUtils.sol";

contract LendingSetters is StaterCore, LendingUtils {
    using SafeMath for uint256;
    using SafeMath for uint16;
    
    constructor(
        address _nftAddress, 
        address _promissoryNoteContractAddress, 
        address[] memory _geyserAddressArray, 
        uint256[] memory _staterNftTokenIdArray, 
        address _lendingMethodsContract, 
        address _lendingPoolContract
    ) {
        
        permissions["PROMISSORY_NOTE"] = _promissoryNoteContractAddress;
        permissions[lendingMethodsSignature] = _lendingMethodsContract;
        permissions["LENDING_POOL"] = _lendingPoolContract;
        
        addDiscount(uint8(1),_nftAddress,uint8(50),_staterNftTokenIdArray);
        uint256[] memory emptyArray;
        for ( uint256 i = 0 ; i < _geyserAddressArray.length ; ++i )
            addDiscount(uint8(2),_geyserAddressArray[i],uint8(50),emptyArray);
            
    }
    
    function setGlobalVariables(
        uint256 _ltv,  
        uint256 _interestRate, 
        uint256 _interestRateToStater, 
        uint32 _lenderFee
    ) public payable {
        ltv = _ltv;
        interestRate = _interestRate;
        interestRateToStater = _interestRateToStater;
        lenderFee = _lenderFee;
    }
    
    // Borrower creates a loan
    function createLoan(
        uint256 loanAmount,
        uint16 nrOfInstallments,
        address currency,
        address[] calldata nftAddressArray, 
        uint256[] calldata nftTokenIdArray,
        string calldata creationId,
        uint8[] calldata nftTokenTypeArray
    ) public payable {
        require(nrOfInstallments > 0, "Loan must have at least 1 installment");
        require(loanAmount > 0, "Loan amount must be higher than 0");
        //require(nftAddressArray.length > 0, "Loan must have atleast 1 NFT");
        require(nftAddressArray.length == nftTokenIdArray.length && nftTokenIdArray.length == nftTokenTypeArray.length, "NFT provided informations are missing or incomplete");
        
        /*
         * @ Side note : _percent is missing from the LendingCore contract , in case of any error
         */
        // Compute loan to value ratio for current loan application
        require(_percent(loanAmount, loans[id].assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
        
        // Computing the defaulting limit
        if ( nrOfInstallments <= 3 )
            loans[id].defaultingLimit = 1;
        else if ( nrOfInstallments <= 5 )
            loans[id].defaultingLimit = 2;
        else if ( nrOfInstallments >= 6 )
            loans[id].defaultingLimit = 3;
        
        // Set loan fields
        loans[id].nftTokenIdArray = nftTokenIdArray;
        loans[id].loanAmount = loanAmount;
        loans[id].amountDue = loanAmount.mul(interestRate.add(100)).div(100); // interest rate >> 20%
        loans[id].nrOfInstallments = nrOfInstallments;
        loans[id].installmentAmount = loans[id].amountDue.mod(nrOfInstallments) > 0 ? loans[id].amountDue.div(nrOfInstallments).add(1) : loans[id].amountDue.div(nrOfInstallments);
        loans[id].status = Status.LISTED;
        loans[id].nftAddressArray = nftAddressArray;
        loans[id].borrower = msg.sender;
        loans[id].currency = currency;
        loans[id].nftTokenTypeArray = nftTokenTypeArray;
        loans[id].installmentsTimeHandler[0] = nrOfInstallments;
        
        // Transfer the items from lender to stater contract
        _transferItems(
            msg.sender, 
            address(this), 
            nftAddressArray, 
            nftTokenIdArray,
            nftTokenTypeArray
        );
        
        // Fire event
        emit NewLoan(id, msg.sender, block.timestamp, currency, Status.LISTED, creationId);
        ++id;
    }


    /*
     * @ Edit loan
     * @ Accessible for borrower until a lender is found
     */
    function editLoan(
        uint256 loanId,
        uint256 loanAmount,
        uint16 nrOfInstallments,
        address currency,
        uint256 assetsValue
    ) external {
        require(nrOfInstallments > 0, "Loan must have at least 1 installment");
        require(loanAmount > 0, "Loan amount must be higher than 0");
        require(loans[loanId].borrower == msg.sender,"You're not the owner of this loan");
        require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
        require(_percent(loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
        loans[loanId].installmentsTimeHandler[0] = nrOfInstallments;
        loans[loanId].loanAmount = loanAmount;
        loans[loanId].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
        loans[loanId].installmentAmount = loans[loanId].amountDue.mod(nrOfInstallments) > 0 ? loans[loanId].amountDue.div(nrOfInstallments).add(1) : loans[loanId].amountDue.div(nrOfInstallments);
        loans[loanId].assetsValue = assetsValue;
        loans[loanId].currency = currency;
        // Computing the defaulting limit
        if ( nrOfInstallments <= 3 )
            loans[loanId].defaultingLimit = 1;
        else if ( nrOfInstallments <= 5 )
            loans[loanId].defaultingLimit = 2;
        else if ( nrOfInstallments >= 6 )
            loans[loanId].defaultingLimit = 3;
    }
    
    // Lender approves a loan
    function approveLoan(uint256 loanId) public payable {
        require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
        require(loans[loanId].paidAmount == 0, "This loan is currently not ready for lenders");
        require(loans[loanId].status == Status.LISTED, "This loan is not currently ready for lenders, check later");
        
        uint256 discount = calculateDiscount(msg.sender);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
        require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discount)),"Not enough currency");

        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = msg.sender;
        loans[loanId].loanEnd = block.timestamp.add(
            loans[loanId].nrOfInstallments.mul(
                getLoanPaymentFrequency(loanId).div(
                    loans[loanId].nrOfInstallments
                )
            )
        );
        loans[loanId].status = Status.APPROVED;
        loans[loanId].loanStart = block.timestamp;

        // We send the tokens here
        _transferTokens(
            msg.sender,
            loans[loanId].borrower,
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount.div(lenderFee).div(discount),
            payable(address(this))
        );

        emit LoanApproved(
        loanId,
        msg.sender,
        block.timestamp,
        loans[loanId].loanEnd,
        Status.APPROVED
        );
    }

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) public payable {
        require(loans[loanId].lender == address(0), "The loan has a lender , it cannot be cancelled");
        require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
        require(loans[loanId].status != Status.CANCELLED, "This loan is already cancelled");
        require(loans[loanId].status == Status.LISTED, "This loan is no longer cancellable");
        
        // We set its validity date as block.timestamp
        loans[loanId].loanEnd = block.timestamp;
        loans[loanId].status = Status.CANCELLED;

        // We send the items back to him
        _transferItems(
        address(this), 
        loans[loanId].borrower, 
        loans[loanId].nftAddressArray, 
        loans[loanId].nftTokenIdArray,
        loans[loanId].nftTokenTypeArray
        );

        emit LoanCancelled(
        loanId,
        block.timestamp,
        Status.CANCELLED
        );
    }

    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId) public payable {
        require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
        require(loans[loanId].status == Status.APPROVED, "This loan is no longer in the approval phase, check its status");
        require(loans[loanId].loanEnd >= block.timestamp, "Loan validity expired");
        require((msg.value > 0 && loans[loanId].currency == address(0) ) || ( loans[loanId].currency != address(0) && msg.value == 0), "Insert the correct tokens");
        
        uint256 paidByBorrower = msg.value > 0 ? msg.value : loans[loanId].installmentAmount;
        uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
        uint256 interestPerInstallement = paidByBorrower.mul(interestRate).div(100); // entire interest for installment
        uint256 discount = calculateDiscount(msg.sender);
        uint256 interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100);

        if ( discount != 1 ){
            if ( loans[loanId].currency == address(0) ){
                require(msg.sender.send(interestToStaterPerInstallement.div(discount)), "Discount returnation failed");
                amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement.div(discount));
            }
            interestToStaterPerInstallement = interestToStaterPerInstallement.sub(interestToStaterPerInstallement.div(discount));
        }
        amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement);

        loans[loanId].paidAmount = loans[loanId].paidAmount.add(paidByBorrower);
        loans[loanId].nrOfPayments = uint16(loans[loanId].nrOfPayments.add(
            paidByBorrower.div(
                loans[loanId].installmentAmount
            )
        ));

        if (loans[loanId].paidAmount >= loans[loanId].amountDue)
        loans[loanId].status = Status.LIQUIDATED;

        // We transfer the tokens to borrower here
        _transferTokens(
            msg.sender,
            loans[loanId].lender,
            loans[loanId].currency,
            amountPaidAsInstallmentToLender,
            interestToStaterPerInstallement,
            payable(address(this))
        );

        emit LoanPayment(
        loanId,
        block.timestamp,
        msg.value,
        amountPaidAsInstallmentToLender,
        interestPerInstallement,
        interestToStaterPerInstallement,
        loans[loanId].status
        );
    }

    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) public payable {
        require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender, "You can't access this loan");
        require((block.timestamp >= loans[loanId].loanEnd || loans[loanId].paidAmount >= loans[loanId].amountDue) || lackOfPayment(loanId), "Not possible to finish this loan yet");
        require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED, "Incorrect state of loan");
        require(loans[loanId].status != Status.WITHDRAWN, "Loan NFTs already withdrawn");

        if ( lackOfPayment(loanId) ) {
            loans[loanId].status = Status.WITHDRAWN;
            loans[loanId].loanEnd = block.timestamp;
            // We send the items back to lender
            _transferItems(
                address(this),
                loans[loanId].lender,
                loans[loanId].nftAddressArray,
                loans[loanId].nftTokenIdArray,
                loans[loanId].nftTokenTypeArray
            );
        } else {
            if ( block.timestamp >= loans[loanId].loanEnd && loans[loanId].paidAmount < loans[loanId].amountDue ) {
                loans[loanId].status = Status.WITHDRAWN;
                // We send the items back to lender
                _transferItems(
                address(this),
                loans[loanId].lender,
                loans[loanId].nftAddressArray,
                loans[loanId].nftTokenIdArray,
                loans[loanId].nftTokenTypeArray
                );
            } else if ( loans[loanId].paidAmount >= loans[loanId].amountDue ){
                loans[loanId].status = Status.WITHDRAWN;
                // We send the items back to borrower
                _transferItems(
                address(this),
                loans[loanId].borrower,
                loans[loanId].nftAddressArray,
                loans[loanId].nftTokenIdArray,
                loans[loanId].nftTokenTypeArray
                );
            }
        }
        
        emit ItemsWithdrawn(
        loanId,
        msg.sender,
        loans[loanId].status
        );
    }
    
}