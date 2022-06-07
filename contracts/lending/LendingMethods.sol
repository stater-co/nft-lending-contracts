// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
import '@openzeppelin/contracts/access/Ownable.sol';
import "./LendingCore.sol";


contract LendingMethods is Ownable, LendingCore {
    
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
        require(nrOfInstallments > 0 && loanAmount > 0 && nftAddressArray.length > 0);
        require(nftAddressArray.length == nftTokenIdArray.length && nftTokenIdArray.length == nftTokenTypeArray.length);
        
        loans[id].assetsValue = assetsValue;
        
        // Checks the loan to value ration
        checkLtv(loanAmount, loans[id].assetsValue);
        
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
        loans[id].amountDue = loanAmount * (interestRate + 100) / 100; // interest rate >> 20%
        loans[id].nrOfInstallments = nrOfInstallments;
        loans[id].installmentAmount = loans[id].amountDue % nrOfInstallments > 0 ? loans[id].amountDue / nrOfInstallments + 1 : loans[id].amountDue / nrOfInstallments;
        loans[id].status = Status.LISTED;
        loans[id].nftAddressArray = nftAddressArray;
        loans[id].borrower = payable(msg.sender);
        loans[id].currency = currency;
        loans[id].nftTokenTypeArray = nftTokenTypeArray;
        loans[id].installmentTime = 1 weeks;
        
        // Fire event
        emit NewLoan(
            msg.sender, 
            currency, 
            id,
            nftAddressArray,
            nftTokenIdArray,
            nftTokenTypeArray
        );
        ++id;
    }


    /*
     * @ Make loan offer
     * @ Accessible for lenders as long as the loan is available
     */
    function offer(
        uint256 loanId,
        uint256 offeredAmount
    ) external payable {
        require(loans[loanId].status == Status.LISTED);
        require(offeredAmount <= loans[loanId].loanAmount);
        require(loans[loanId].currency == address(0) ? msg.value >= offeredAmount : offeredAmount <= checkTokensApproval(msg.sender,loans[loanId].currency));
        bool exists;
        uint256 offerPosition;
        for ( uint256 i = 0 ; i < loans[loanId].offerers.length ; ++i ) {
            if ( loans[loanId].offerers[i] == msg.sender ) {
                loans[loanId].offers[i] = offeredAmount;
                exists = true;
                offerPosition = i;
                break;
            }
        }
        if ( !exists ) {
            offerPosition = loans[loanId].offerers.length;
            loans[loanId].offerers.push(msg.sender);
            loans[loanId].offers.push(offeredAmount);
        }

        emit LoanOffer(loanId,msg.sender,offeredAmount,offerPosition);
    }

    function closeOffer(
        uint256 loanId,
        uint256 position
    ) external {
        require(loans[loanId].status == Status.LISTED);
        require(loans[loanId].offerers[position] == msg.sender);

        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(msg.sender),
            loans[loanId].currency,
            loans[loanId].offers[position],
            0
        );

        loans[loanId].offers[position] = 0;
        emit CloseLoanOffer(loanId,msg.sender,position);
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
        uint256 installmentTime
    ) external {
        require(nrOfInstallments > 0 && loanAmount > 0);
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status < Status.APPROVED);
        checkLtv(loanAmount, assetsValue);
        

        loans[loanId].installmentTime = installmentTime;
        loans[loanId].loanAmount = loanAmount;
        loans[loanId].amountDue = loanAmount * (interestRate + 100) / 100;
        loans[loanId].installmentAmount = loans[loanId].amountDue % nrOfInstallments > 0 ? loans[loanId].amountDue / nrOfInstallments + 1 : loans[loanId].amountDue / nrOfInstallments;
        loans[loanId].assetsValue = assetsValue;
        loans[loanId].nrOfInstallments = nrOfInstallments;
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

        // Fire event
        emit EditLoan(
            currency, 
            loanId,
            loanAmount,
            loans[loanId].amountDue,
            loans[loanId].installmentAmount,
            loans[loanId].assetsValue,
            installmentTime,
            nrOfInstallments
        );

    }
    
    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].paidAmount == 0);
        require(loans[loanId].status == Status.LISTED);
        
        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = payable(msg.sender);
        loans[loanId].startEnd[1] = block.timestamp + loans[loanId].nrOfInstallments * loans[loanId].installmentTime;
        loans[loanId].status = Status.APPROVED;
        loans[loanId].startEnd[0] = block.timestamp;
        uint256 discount = discounts.calculateDiscount(msg.sender);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount + loans[loanId].loanAmount / lenderFee / discount);
        
        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount / lenderFee / discount
        );
        
        emit LoanApproved(
            msg.sender,
            loanId,
            loans[loanId].startEnd[1]
        );

    }

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status != Status.CANCELLED);
        require(loans[loanId].status == Status.LISTED);
        loans[loanId].status = Status.CANCELLED;

        emit LoanCancelled(
            loanId
        );
    }

    // Borrower pays installment for loan
    // Multiple installments : OK
    function payLoan(uint256 loanId,uint256 amount) external payable {
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status == Status.APPROVED);
        require(loans[loanId].startEnd[1] >= block.timestamp);
        require((msg.value > 0 && loans[loanId].currency == address(0) && msg.value == amount) || (loans[loanId].currency != address(0) && msg.value == 0 && amount > 0));
        
        uint256 paidByBorrower = msg.value > 0 ? msg.value : amount;
        uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
        uint256 interestPerInstallement = paidByBorrower * interestRate / 100; // entire interest for installment
        uint256 discount = discounts.calculateDiscount(msg.sender);
        uint256 interestToStaterPerInstallement = interestPerInstallement * interestRateToStater / 100;

        if ( discount != 1 ){
            if ( loans[loanId].currency == address(0) ){
                require(payable(msg.sender).send(interestToStaterPerInstallement / discount));
                amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender - (interestToStaterPerInstallement / discount);
            }
            interestToStaterPerInstallement = interestToStaterPerInstallement - (interestToStaterPerInstallement / discount);
        }
        amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender - interestToStaterPerInstallement;

        loans[loanId].paidAmount = loans[loanId].paidAmount + paidByBorrower;
        loans[loanId].nrOfPayments = loans[loanId].nrOfPayments + (paidByBorrower / loans[loanId].installmentAmount);

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
            paidByBorrower,
            amountPaidAsInstallmentToLender,
            interestPerInstallement,
            interestToStaterPerInstallement,
            loans[loanId].status
        );
    }

    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) external {
        require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender);
        require(loans[loanId].status != Status.WITHDRAWN);
        require((block.timestamp >= loans[loanId].startEnd[1] || loans[loanId].paidAmount >= loans[loanId].amountDue) || canBeTerminated(loanId));
        require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED);

        if ( canBeTerminated(loanId) ) {
            loans[loanId].status = Status.WITHDRAWN;
            // We send the items back to lender
            transferItems(
                address(this),
                loans[loanId].lender,
                loans[loanId].nftAddressArray,
                loans[loanId].nftTokenIdArray,
                loans[loanId].nftTokenTypeArray
            );
        } else {
            if ( block.timestamp >= loans[loanId].startEnd[1] && loans[loanId].paidAmount < loans[loanId].amountDue ) {
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
    function promissoryExchange(address from, address payable to, uint256[] calldata loanIds) external isPromissoryNote {
        for (uint256 i = 0; i < loanIds.length; ++i) {
            require(loans[loanIds[i]].lender == from);
            require(loans[loanIds[i]].status == Status.APPROVED);
            require(promissoryPermissions[loanIds[i]] == from);
            loans[loanIds[i]].lender = to;
            promissoryPermissions[loanIds[i]] = to;
        }
    }
  
    /**
     * @notice Used by the Promissory Note contract to approve a list of loans to be used as a Promissory Note NFT
     * @param loanIds The ids of the loans that will be approved
     */
     function setPromissoryPermissions(uint256[] calldata loanIds, address allowed) external {
        require(allowed != address(0));
        for (uint256 i = 0; i < loanIds.length; ++i) {
            require(loans[loanIds[i]].lender == msg.sender);
            require(loans[loanIds[i]].status == Status.APPROVED);
            promissoryPermissions[loanIds[i]] = allowed;
        }
    }
}