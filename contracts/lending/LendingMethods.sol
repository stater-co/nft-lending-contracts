// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "./LendingCore.sol";
import "../libs/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract LendingMethods is Ownable, LendingCore {
    using SafeMath for uint256;
    using SafeMath for uint16;
    using SafeMath for uint8;
    
    
    /*
     * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
     * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
     * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
     */
    function lackOfPayment(uint256 loanId) public view returns(bool) {
        return 
            loans[loanId].status == Status.APPROVED 
                && 
            loans[loanId].startEnd[0].add(
                loans[loanId].nrOfPayments.mul(
                    loans[loanId].installmentTime.div(
                        loans[loanId].nrOfInstallments
                    )
                )
            ) <= block.timestamp.sub(
                loans[loanId].defaultingLimit.mul(
                    loans[loanId].installmentTime.div(
                        loans[loanId].nrOfInstallments
                    )
                )
            );
    }

    // Calculates loan to value ratio
    function _percent(uint256 numerator, uint256 denominator) public pure returns(uint256) {
        return numerator.mul(10000).div(denominator).add(5).div(10);
    }
    
    
    /*
     * @DIIMIIM : The loan events
     */
    event NewLoan(
        address indexed owner,
        address indexed currency,
        uint256 indexed loanId,
        address[] nftAddressArray,
        uint256[] nftTokenIdArray,
        uint8[] nftTokenTypeArray
    );
    event EditLoan(
        address indexed currency,
        uint256 indexed loanId,
        uint256 loanAmount,
        uint256 amountDue,
        uint256 installmentAmount,
        uint256 assetsValue,
        uint256 frequencyTime,
        uint256 frequencyTimeUnit
    );
    event LoanApproved(
        address indexed lender,
        uint256 indexed loanId,
        uint256 loanPaymentEnd
    );
    event LoanCancelled(
        uint256 indexed loanId
    );
    event ItemsWithdrawn(
        address indexed requester,
        uint256 indexed loanId,
        Status status
    );
    event LoanPayment(
        uint256 indexed loanId,
        uint256 installmentAmount,
        uint256 amountPaidAsInstallmentToLender,
        uint256 interestPerInstallement,
        uint256 interestToStaterPerInstallement,
        Status status
    );
    
    
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
        require(nrOfInstallments > 0 && loanAmount > 0 && nftAddressArray.length > 0);
        require(nftAddressArray.length == nftTokenIdArray.length && nftTokenIdArray.length == nftTokenTypeArray.length);
        
        loans[id].assetsValue = assetsValue;
        /*
         * @ Side note : _percent is missing from the LendingCore contract , in case of any error
         */
        // Compute loan to value ratio for current loan application
        require(_percent(loanAmount, loans[id].assetsValue) <= ltv);
        
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
            id,
            nftAddressArray,
            nftTokenIdArray,
            nftTokenTypeArray
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
        uint256 installmentTime
    ) external {
        require(nrOfInstallments > 0 && loanAmount > 0);
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status < Status.APPROVED);
        require(_percent(loanAmount, assetsValue) <= ltv);
        

        loans[loanId].installmentTime = installmentTime;
        loans[loanId].loanAmount = loanAmount;
        loans[loanId].amountDue = loanAmount.mul(interestRate.add(100)).div(100);
        loans[loanId].installmentAmount = loans[loanId].amountDue.mod(nrOfInstallments) > 0 ? loans[loanId].amountDue.div(nrOfInstallments).add(1) : loans[loanId].amountDue.div(nrOfInstallments);
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
        
        approveLoanCoreMechanism(loanId);
        uint256 discount = discounts.calculateDiscount(msg.sender);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee).div(discount)));
        
        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount.div(lenderFee).div(discount)
        );

    }
    
    function approveLoanWithPool(uint256 loanId, uint256 poolId) external payable {

        approveLoanCoreMechanism(loanId);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount.add(loans[loanId].loanAmount.div(lenderFee)));
            
        loans[loanId].poolId = poolId;

        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount.div(lenderFee)
        );
            
    }

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status != Status.CANCELLED);
        require(loans[loanId].status == Status.LISTED);
        
        // We set its validity date as block.timestamp
        loans[loanId].startEnd[1] = block.timestamp;
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
        require(loans[loanId].borrower == msg.sender);
        require(loans[loanId].status == Status.APPROVED);
        require(loans[loanId].startEnd[1] >= block.timestamp);
        require((msg.value > 0 && loans[loanId].currency == address(0) && msg.value == amount) || (loans[loanId].currency != address(0) && msg.value == 0 && amount > 0));
        
        uint256 paidByBorrower = msg.value > 0 ? msg.value : amount;
        uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
        uint256 interestPerInstallement = paidByBorrower.mul(interestRate).div(100); // entire interest for installment
        uint256 discount = discounts.calculateDiscount(msg.sender);
        uint256 interestToStaterPerInstallement = interestPerInstallement.mul(interestRateToStater).div(100);

        if ( discount != 1 ){
            if ( loans[loanId].currency == address(0) ){
                require(msg.sender.send(interestToStaterPerInstallement.div(discount)));
                amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement.div(discount));
            }
            interestToStaterPerInstallement = interestToStaterPerInstallement.sub(interestToStaterPerInstallement.div(discount));
        }
        amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender.sub(interestToStaterPerInstallement);

        loans[loanId].paidAmount = loans[loanId].paidAmount.add(paidByBorrower);
        loans[loanId].nrOfPayments = loans[loanId].nrOfPayments.add(paidByBorrower.div(loans[loanId].installmentAmount));

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
        require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender);
        require(loans[loanId].status != Status.WITHDRAWN);
        require((block.timestamp >= loans[loanId].startEnd[1] || loans[loanId].paidAmount >= loans[loanId].amountDue) || lackOfPayment(loanId));
        require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED);

        if ( lackOfPayment(loanId) ) {
            loans[loanId].status = Status.WITHDRAWN;
            loans[loanId].startEnd[1] = block.timestamp;
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
     function setPromissoryPermissions(uint256[] calldata loanIds, address sender, address allowed) external isPromissoryNote {
        for (uint256 i = 0; i < loanIds.length; ++i){
            require(loans[loanIds[i]].lender == sender);
            if (allowed != address(0))
                require(loans[loanIds[i]].status == Status.APPROVED);
            promissoryPermissions[loanIds[i]] = allowed;
        }
    }
    
    function approveLoanCoreMechanism(uint256 loanId) internal {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].paidAmount == 0);
        require(loans[loanId].status == Status.LISTED);

        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = msg.sender;
        loans[loanId].startEnd[1] = block.timestamp.add(
            loans[loanId].nrOfInstallments.mul(
                loans[loanId].installmentTime.div(
                    loans[loanId].nrOfInstallments
                )
            )
        );
        loans[loanId].status = Status.APPROVED;
        loans[loanId].startEnd[0] = block.timestamp;

        emit LoanApproved(
            msg.sender,
            loanId,
            loans[loanId].startEnd[1]
        );
    }
}
