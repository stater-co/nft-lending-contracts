// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract LendingMethods is Ownable, LendingCore {
    using SafeMath for uint256;
    using SafeMath for uint16;
    
    
    function setGlobalVariables(
        uint256 _ltv,  
        uint256 _interestRate, 
        uint256 _interestRateToStater, 
        uint32 _lenderFee,
        address _promissoryNoteAddress,
        address _lendingMethodsAddress,
        address _lendingDiscountsAddress
    ) external onlyOwner {
        ltv = _ltv;
        interestRate = _interestRate;
        interestRateToStater = _interestRateToStater;
        lenderFee = _lenderFee;
        promissoryNoteAddress = _promissoryNoteAddress;
        lendingMethodsAddress = _lendingMethodsAddress;
        discounts = StaterDiscounts(_lendingDiscountsAddress);
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
        require(nrOfInstallments > 0, "Loan must have at least 1 installment");
        require(loanAmount > 0, "Loan amount must be higher than 0");
        require(nftAddressArray.length > 0, "Loan must have atleast 1 NFT");
        require(nftAddressArray.length == nftTokenIdArray.length && nftTokenIdArray.length == nftTokenTypeArray.length, "NFT provided informations are missing or incomplete");
        
        loans[id].assetsValue = assetsValue;
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
        loans[id].installmentTime = 1 weeks;
        
        // Transfer the items from lender to stater contract
        transferItems(
            msg.sender, 
            address(this), 
            nftAddressArray, 
            nftTokenIdArray,
            nftTokenTypeArray
        );
        
        // Fire event
        emit NewLoan(
            msg.sender, 
            currency, 
            id
        );
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
        uint256 assetsValue,
        uint256 intallmentTime
    ) external {
        require(nrOfInstallments > 0, "Loan must have at least 1 installment");
        require(loanAmount > 0, "Loan amount must be higher than 0");
        require(loans[loanId].borrower == msg.sender,"You're not the owner of this loan");
        require(loans[loanId].status < Status.APPROVED,"Loan can no longer be modified");
        require(_percent(loanAmount, assetsValue) <= ltv, "LTV exceeds maximum limit allowed");
        
        /*
         * @ Update the loan installment time handler
         * installmentsTimeHandler[0] : number of weeks
         * installmentsTimeHandler[1] : number of days
         * installmentsTimeHandler[2] : number of hours
         */
        loans[loanId].installmentTime = intallmentTime;
        
        
        loans[loanId].loanAmount = loanAmount;
        loans[loanId].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
        loans[loanId].installmentAmount = loans[loanId].amountDue.mod(nrOfInstallments) > 0 ? loans[loanId].amountDue.div(nrOfInstallments).add(1) : loans[loanId].amountDue.div(nrOfInstallments);
        loans[loanId].assetsValue = assetsValue;
        loans[loanId].currency = currency;
        
        
        /*
         * Computing the defaulting limit
         */
        if ( nrOfInstallments <= 3 )
            loans[loanId].defaultingLimit = 1;
        else if ( nrOfInstallments <= 5 )
            loans[loanId].defaultingLimit = 2;
        else if ( nrOfInstallments >= 6 )
            loans[loanId].defaultingLimit = 3;
    }
    
    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable {
        
        require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
        require(loans[loanId].paidAmount == 0, "This loan is currently not ready for lenders");
        require(loans[loanId].status == Status.LISTED, "This loan is not currently ready for lenders, check later");
        
        uint256 discount = discounts.calculateDiscount(msg.sender);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discount)),"Not enough currency");
        

        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = msg.sender;
        loans[loanId].loanEnd = block.timestamp.add(
            loans[loanId].nrOfInstallments.mul(
                loans[loanId].installmentTime.div(
                    loans[loanId].nrOfInstallments
                )
            )
        );
        loans[loanId].status = Status.APPROVED;
        loans[loanId].loanStart = block.timestamp;

        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount.div(lenderFee).div(discount)
        );

        emit LoanApproved(
            msg.sender,
            loanId,
            loans[loanId].loanEnd
        );

    }

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
        require(loans[loanId].lender == address(0), "The loan has a lender , it cannot be cancelled");
        require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
        require(loans[loanId].status != Status.CANCELLED, "This loan is already cancelled");
        require(loans[loanId].status == Status.LISTED, "This loan is no longer cancellable");
        
        // We set its validity date as block.timestamp
        loans[loanId].loanEnd = block.timestamp;
        loans[loanId].status = Status.CANCELLED;

        // We send the items back to him
        transferItems(
        address(this), 
            loans[loanId].borrower, 
            loans[loanId].nftAddressArray, 
            loans[loanId].nftTokenIdArray,
            loans[loanId].nftTokenTypeArray
        );

        emit LoanCancelled(
            loanId
        );
    }

    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId,uint256 amount) external payable {
        require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
        require(loans[loanId].status == Status.APPROVED, "This loan is no longer in the approval phase, check its status");
        require(loans[loanId].loanEnd >= block.timestamp, "Loan validity expired");
        require((msg.value > 0 && loans[loanId].currency == address(0) && msg.value == amount) || (loans[loanId].currency != address(0) && msg.value == 0 && amount > 0), "Insert the correct tokens");
        
        uint256 paidByBorrower = msg.value > 0 ? msg.value : amount;
        uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
        uint256 interestPerInstallement = paidByBorrower.mul(interestRate).div(100); // entire interest for installment
        uint256 discount = discounts.calculateDiscount(msg.sender);
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

        if (loans[loanId].paidAmount >= loans[loanId].amountDue)
        loans[loanId].status = Status.LIQUIDATED;

        // We transfer the tokens to borrower here
        transferTokens(
            msg.sender,
            loans[loanId].lender,
            loans[loanId].currency,
            amountPaidAsInstallmentToLender,
            interestToStaterPerInstallement
        );

        emit LoanPayment(
            loanId,
            msg.value,
            amountPaidAsInstallmentToLender,
            interestPerInstallement,
            interestToStaterPerInstallement,
            loans[loanId].status
        );
    }

    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) external {
        require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender, "You can't access this loan");
        require((block.timestamp >= loans[loanId].loanEnd || loans[loanId].paidAmount >= loans[loanId].amountDue) || lackOfPayment(loanId), "Not possible to finish this loan yet");
        require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED, "Incorrect state of loan");
        require(loans[loanId].status != Status.WITHDRAWN, "Loan NFTs already withdrawn");

        if ( lackOfPayment(loanId) ) {
            loans[loanId].status = Status.WITHDRAWN;
            loans[loanId].loanEnd = block.timestamp;
            // We send the items back to lender
            transferItems(
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
                transferItems(
                    address(this),
                    loans[loanId].lender,
                    loans[loanId].nftAddressArray,
                    loans[loanId].nftTokenIdArray,
                    loans[loanId].nftTokenTypeArray
                );
            } else if ( loans[loanId].paidAmount >= loans[loanId].amountDue ){
                loans[loanId].status = Status.WITHDRAWN;
                // We send the items back to borrower
                transferItems(
                    address(this),
                    loans[loanId].borrower,
                    loans[loanId].nftAddressArray,
                    loans[loanId].nftTokenIdArray,
                    loans[loanId].nftTokenTypeArray
                );
            }
        }
        
        emit ItemsWithdrawn(
            msg.sender,
            loanId,
            loans[loanId].status
        );
    }
    
    /**
     * @notice Used by the Promissory Note contract to change the ownership of the loan when the Promissory Note NFT is sold 
     * @param from The address of the current owner
     * @param to The address of the new owner
     * @param loanIds The ids of the loans that will be transferred to the new owner
     */
    function promissoryExchange(address from, address payable to, uint256[] calldata loanIds) external {
        for (uint256 i = 0; i < loanIds.length; ++i) {
            require(loans[loanIds[i]].lender == from, "Lending Methods: One of the loans doesn't belong to you, rejected.");
            require(loans[loanIds[i]].status == Status.APPROVED, "Lending Methods: One of the loans isn't in approval state, rejected.");
            require(promissoryPermissions[loanIds[i]] == from, "Lending Methods: Permission to exchange promissory not allowed, rejected.");
            loans[loanIds[i]].lender = to;
            promissoryPermissions[loanIds[i]] = to;
        }
    }
  
    /**
     * @notice Used by the Promissory Note contract to approve a list of loans to be used as a Promissory Note NFT
     * @param loanIds The ids of the loans that will be approved
     */
     function setPromissoryPermissions(uint256[] calldata loanIds, address sender) external {
        for (uint256 i = 0; i < loanIds.length; ++i){
            require(loans[loanIds[i]].status == Status.APPROVED, "Lending Methods: One of the loans isn't in approval state, rejected.");
            require(loans[loanIds[i]].lender == sender, "Lending Methods: You're not the lender of this loan");
            promissoryPermissions[loanIds[i]] = sender;
        }
    }
    
    /**
     * @notice Used by the Promissory Note contract to unset a list of loans when their promissory note has been burned
     * @param loanIds The ids of the loans that will be unset
     */
     function unsetPromissoryPermissions(uint256[] calldata loanIds, address sender) external {
        for (uint256 i = 0; i < loanIds.length; ++i){
            require(loans[loanIds[i]].status == Status.APPROVED, "Lending Methods: One of the loans isn't in approval state, rejected.");
            require(loans[loanIds[i]].lender == sender, "Lending Methods: You're not the lender of this loan");
            promissoryPermissions[loanIds[i]] = address(0);
        }
    }
}