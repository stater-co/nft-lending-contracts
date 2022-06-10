// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;
import "./LendingCore.sol";


contract LendingMethods is LendingCore {
    
    constructor(string memory name, string memory symbol) LendingCore(name,symbol) {
        
    }

    // Borrower creates a loan
    function createLoan(
        CreateLoanParams.Struct memory input
    ) external {
        require(input.nrOfInstallments > 0 && input.loanAmount > 0 && input.nftAddressArray.length > 0);
        require(input.nftAddressArray.length == input.nftTokenIdArray.length && input.nftTokenIdArray.length == input.nftTokenTypeArray.length);
        
        loans[id].assetsValue = input.assetsValue;
        
        // Checks the loan to value ration
        checkLtv(
            input.loanAmount, 
            loans[id].assetsValue
        );
        
        // Check to see if the sender really owns these items and if we're approved for them
        checkItemsApproval(
            msg.sender,
            input.nftAddressArray,
            input.nftTokenIdArray,
            input.nftTokenTypeArray
        );

        // Computing the defaulting limit
        if ( input.nrOfInstallments <= 3 )
            loans[id].defaultingLimit = 1;
        else if ( input.nrOfInstallments <= 5 )
            loans[id].defaultingLimit = 2;
        else if ( input.nrOfInstallments >= 6 )
            loans[id].defaultingLimit = 3;
        
        // Set loan fields
        
        loans[id].nftTokenIdArray = input.nftTokenIdArray;
        loans[id].loanAmount = input.loanAmount;
        loans[id].amountDue = input.loanAmount * (interestRate + 100) / 100; // interest rate >> 20%
        loans[id].nrOfInstallments = input.nrOfInstallments;
        loans[id].installmentAmount = loans[id].amountDue % input.nrOfInstallments > 0 ? loans[id].amountDue / input.nrOfInstallments + 1 : loans[id].amountDue / input.nrOfInstallments;
        loans[id].status = Status.LISTED;
        loans[id].nftAddressArray = input.nftAddressArray;
        loans[id].borrower = payable(msg.sender);
        loans[id].currency = input.currency;
        loans[id].nftTokenTypeArray = input.nftTokenTypeArray;
        loans[id].installmentTime = 1 weeks;
        
        // Fire event
        emit NewLoan(
            msg.sender, 
            input.currency, 
            id,
            input.nftAddressArray,
            input.nftTokenIdArray,
            input.nftTokenTypeArray
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
        EditLoanParams.Struct memory input
    ) external {
        require(input.nrOfInstallments > 0 && input.loanAmount > 0);
        require(loans[input.loanId].borrower == msg.sender);
        require(loans[input.loanId].status < Status.APPROVED);
        checkLtv(input.loanAmount, input.assetsValue);
        

        loans[input.loanId].installmentTime = input.installmentTime;
        loans[input.loanId].loanAmount = input.loanAmount;
        loans[input.loanId].amountDue = input.loanAmount * (interestRate + 100) / 100;
        loans[input.loanId].installmentAmount = loans[input.loanId].amountDue % input.nrOfInstallments > 0 ? loans[input.loanId].amountDue / input.nrOfInstallments + 1 : loans[input.loanId].amountDue / input.nrOfInstallments;
        loans[input.loanId].assetsValue = input.assetsValue;
        loans[input.loanId].nrOfInstallments = input.nrOfInstallments;
        loans[input.loanId].currency = input.currency;
        
        
        /*
         * Computing the defaulting limit
         */
        if ( input.nrOfInstallments <= 3 )
            loans[input.loanId].defaultingLimit = 1;
        else if ( input.nrOfInstallments <= 5 )
            loans[input.loanId].defaultingLimit = 2;
        else if ( input.nrOfInstallments >= 6 )
            loans[input.loanId].defaultingLimit = 3;

        // Fire event
        emit EditLoan(
            input.currency, 
            input.loanId,
            input.loanAmount,
            loans[input.loanId].amountDue,
            loans[input.loanId].installmentAmount,
            loans[input.loanId].assetsValue,
            input.installmentTime,
            input.nrOfInstallments
        );

    }

    function approveLoanOffer(uint256 loanId, uint256 offerId) external {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].paidAmount == 0);
        require(loans[loanId].status == Status.LISTED);

        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = payable(loans[loanId].offerers[offerId]);
        loans[loanId].startEnd[1] = block.timestamp + loans[loanId].nrOfInstallments * loans[loanId].installmentTime;
        loans[loanId].status = Status.APPROVED;
        loans[loanId].startEnd[0] = block.timestamp;
        uint256 discount = discounts.calculateDiscount(msg.sender);

        // We send the tokens here
        transferTokens(
            address(this),
            payable(msg.sender),
            loans[loanId].currency,
            loans[loanId].offers[offerId],
            loans[loanId].offers[offerId] / lenderFee / discount
        );

        emit LoanOfferApproved(
            msg.sender,
            loanId,
            offerId,
            loans[loanId].offers[offerId],
            loans[loanId].startEnd[1]
        );

        loans[loanId].offers[offerId] = 0;

        for ( uint256 i = 0 ; i < loans[loanId].offerers.length ; ++i ) {
            transferTokens(
                address(this),
                payable(loans[loanId].offerers[i]),
                loans[loanId].currency,
                loans[loanId].offers[i],
                0
            );
        }

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

        for ( uint256 i = 0 ; i < loans[loanId].offerers.length ; ++i ) {
            transferTokens(
                address(this),
                payable(loans[loanId].offerers[i]),
                loans[loanId].currency,
                loans[loanId].offers[i],
                0
            );
        }
        
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
    
}