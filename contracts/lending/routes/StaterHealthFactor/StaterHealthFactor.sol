// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "../../LendingCore.sol";
import "../../../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../../../libs/uniswap-v3-core/test/SqrtPriceMathTest.sol";
import '../../../libs/uniswap-v3-core/test/TickMathTest.sol';
import "../../../libs/uniswap-v3-periphery/interfaces/INonfungiblePositionManager.sol";
import "../../../libs/protocol-v2/contracts/interfaces/IPriceOracleGetter.sol";
import "../../params/CreateLoanMethod.sol";


contract StaterHealthFactor is Ownable, LendingCore, CreateLoanMethod, SqrtPriceMathTest, TickMathTest {
    
    uint256 public liquidationTreshold = .3 ether;
    address public priceOracleGetter;
    mapping(address => bool) public whitelistedCurrencies;
    
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
    
    constructor(
        address _promissoryHandler,
        address _discountsHandler,
        address _poolHandler,
        address _priceOracleGetter,
        address[] memory _whitelistedCurrencies
    ) {
        require(_discountsHandler != address(0), "A valid discounts handler is required");
        promissoryHandler = _promissoryHandler;
        discountsHandler = _discountsHandler;
        poolHandler = _poolHandler;
        priceOracleGetter = _priceOracleGetter;
        for ( uint256 i = 0; i < _whitelistedCurrencies.length; ++i )
            whitelistedCurrencies[_whitelistedCurrencies[i]] = true;
    }
    
    function setGlobalRouteVariables(address _priceOracleGetter, address[] memory _whitelistedCurrencies, bool[] memory _status) external onlyOwner {
        require(_status.length == _whitelistedCurrencies.length, "Bad input");
        priceOracleGetter = _priceOracleGetter;
        for ( uint256 i = 0; i < _whitelistedCurrencies.length; ++i )
            whitelistedCurrencies[_whitelistedCurrencies[i]] = _status[i];
    }
    
    /*
     * @DIIMIIM Determines if a loan has passed the maximum unpaid installments limit or not
     * @ => TRUE = Loan has exceed the maximum unpaid installments limit, lender can terminate the loan and get the NFTs
     * @ => FALSE = Loan has not exceed the maximum unpaid installments limit, lender can not terminate the loan
     */
    function lackOfPayment(uint256 loanId) public view returns(uint256) {
        LoanControlPanel memory loanControlPanel = loanControlPanels[loanId];
        Loan memory loan = loans[loanId];
        require(loanControlPanel.paidAmount < loanControlPanel.amountDue);
        
        uint256 healthFactor;
        for ( uint256 i = 0; i < loan.nftAddressArray.length; ++i ) {
            (
                ,
                ,
                address token0,
                address token1,
                ,
                int24 tickLower,
                int24 tickUpper,
                uint128 liquidity,
                ,
                ,
                ,
            ) = INonfungiblePositionManager(loan.nftAddressArray[i]).positions(loan.nftTokenIdArray[i]);
        
            healthFactor += ( 
                getAmount0Delta(getSqrtRatioAtTick(tickLower),getSqrtRatioAtTick(tickUpper),liquidity,true) * IPriceOracleGetter(priceOracleGetter).getAssetPrice(token0) 
                + 
                getAmount1Delta(getSqrtRatioAtTick(tickLower),getSqrtRatioAtTick(tickUpper),liquidity,true) * IPriceOracleGetter(priceOracleGetter).getAssetPrice(token1)
            ) * liquidationTreshold / loanControlPanel.amountDue;
        }
        
        return healthFactor / loan.nftAddressArray.length;
    }
    
    function debuggingMechanism(address nftAddress, uint256 nftId /*, uint256 amountDue*/) external view returns(int24,uint160,uint160,uint256,uint256) {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            ,
            ,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        ) = INonfungiblePositionManager(nftAddress).positions(nftId);
        uint160 sqrtLower = getSqrtRatioAtTick(tickLower);
        uint160 sqrtUpper = getSqrtRatioAtTick(tickUpper);
        tokensOwed1 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token1) * tokensOwed1);
        tokensOwed0 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token0) * tokensOwed0);
        //uint256 healthFactor = (getAmount0Delta(sqrtLower,sqrtUpper,liquidity,true) + getAmount1Delta(sqrtLower,sqrtUpper,liquidity,true)) * liquidationTreshold / amountDue;
        return (tickUpper,sqrtLower,sqrtUpper,getAmount0Delta(sqrtLower,sqrtUpper,liquidity,true),getAmount1Delta(sqrtLower,sqrtUpper,liquidity,true));
    }
    
    // Borrower creates a loan
    function createLoan(
        CreateLoanMethodParams memory loan
    ) external {
        require(loan.nrOfInstallments > 0 && loan.loanAmount > 0 && loan.nftAddressArray.length > 0);
        require(loan.nftAddressArray.length == loan.nftTokenIdArray.length && loan.nftTokenIdArray.length == loan.nftTokenTypeArray.length);
        
        /*
         * @ Side note : _percent is missing from the LendingCore contract , in case of any error
         * Compute loan to value ratio for current loan application
         */
        require(_percent(loan.loanAmount, loan.assetsValue) <= ltv);
        
        loans[id].assetsValue = loan.assetsValue;
        
        // Computing the defaulting limit
        if ( loan.nrOfInstallments <= 3 )
            loanControlPanels[id].defaultingLimit = 1;
        else if ( loan.nrOfInstallments <= 5 )
            loanControlPanels[id].defaultingLimit = 2;
        else if ( loan.nrOfInstallments >= 6 )
            loanControlPanels[id].defaultingLimit = 3;
        
        // Set loan fields
        loans[id].nftTokenIdArray = loan.nftTokenIdArray;
        loans[id].loanAmount = loan.loanAmount;
        loanControlPanels[id].amountDue = (loan.loanAmount * (loanFeesHandler[id].interestRate + 100)) / 100; // interest rate >> 20%
        loans[id].nrOfInstallments = loan.nrOfInstallments;
        loanControlPanels[id].installmentAmount = loanControlPanels[id].amountDue % loan.nrOfInstallments > 0 ? loanControlPanels[id].amountDue / loan.nrOfInstallments + 1 : loanControlPanels[id].amountDue / loan.nrOfInstallments;
        loanControlPanels[id].status = Status.LISTED;
        loanControlPanels[id].loanHandler = loanHandler;
        loanControlPanels[id].promissoryHandler = promissoryHandler;
        loanControlPanels[id].discountsHandler = discountsHandler;
        loanControlPanels[id].poolHandler = poolHandler;
        loans[id].nftAddressArray = loan.nftAddressArray;
        loans[id].borrower = payable(msg.sender);
        loans[id].currency = loan.currency;
        loans[id].nftTokenTypeArray = loan.nftTokenTypeArray;
        loans[id].installmentTime = 1 weeks;
        
        // Transfer the items from lender to stater contract
        transferItems(
            msg.sender, 
            address(this), 
            loan.nftAddressArray, 
            loan.nftTokenIdArray,
            loan.nftTokenTypeArray
        );
        
        // Fire event
        emit NewLoan(
            msg.sender, 
            loan.currency, 
            id,
            loan.nftAddressArray,
            loan.nftTokenIdArray,
            loan.nftTokenTypeArray
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
        require(loanControlPanels[loanId].status < Status.APPROVED);
        require(_percent(loanAmount, assetsValue) <= loanFeesHandler[loanId].ltv);
        

        loans[loanId].installmentTime = installmentTime;
        loans[loanId].loanAmount = loanAmount;
        loanControlPanels[loanId].amountDue = (loanAmount * (loanFeesHandler[loanId].interestRate + 100)) / 100;
        loanControlPanels[loanId].installmentAmount = loanControlPanels[loanId].amountDue % nrOfInstallments > 0 ? (loanControlPanels[loanId].amountDue / nrOfInstallments) + 1 : loanControlPanels[loanId].amountDue / nrOfInstallments;
        loans[loanId].assetsValue = assetsValue;
        loans[loanId].currency = currency;
        
        
        /*
         * Computing the defaulting limit
         */
        if ( nrOfInstallments <= 3 )
            loanControlPanels[loanId].defaultingLimit = 1;
        else if ( nrOfInstallments <= 5 )
            loanControlPanels[loanId].defaultingLimit = 2;
        else if ( nrOfInstallments >= 6 )
            loanControlPanels[loanId].defaultingLimit = 3;

        // Fire event
        emit EditLoan(
            currency, 
            loanId,
            loanAmount,
            loanControlPanels[loanId].amountDue,
            loanControlPanels[loanId].installmentAmount,
            loans[loanId].assetsValue,
            installmentTime,
            nrOfInstallments
        );

    }
    
    // Lender approves a loan
    function approveLoan(uint256 loanId) external payable {
        
        approveLoanCoreMechanism(loanId);
        uint256 discount = calculateDiscount(loanId,msg.sender);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount + (loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee / discount));
        
        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee / discount
        );

    }
    
    function approveLoanWithPool(uint256 loanId, uint256 poolId) external payable {

        approveLoanCoreMechanism(loanId);
        
        // We check if currency is ETH
        if ( loans[loanId].currency == address(0) )
            require(msg.value >= loans[loanId].loanAmount + (loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee));
            
        loanControlPanels[loanId].poolId = poolId;

        // We send the tokens here
        transferTokens(
            msg.sender,
            payable(loans[loanId].borrower),
            loans[loanId].currency,
            loans[loanId].loanAmount,
            loans[loanId].loanAmount / loanFeesHandler[loanId].lenderFee
        );
            
    }

    // Borrower cancels a loan
    function cancelLoan(uint256 loanId) external {
        require(loans[loanId].lender == address(0));
        require(loans[loanId].borrower == msg.sender);
        require(loanControlPanels[loanId].status == Status.LISTED);
        
        // We set its validity date as block.timestamp
        loanControlPanels[loanId].startEnd[1] = block.timestamp;
        loanControlPanels[loanId].status = Status.CANCELLED;

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
        require(loanControlPanels[loanId].status == Status.APPROVED);
        require(loanControlPanels[loanId].startEnd[1] >= block.timestamp);
        require((msg.value > 0 && loans[loanId].currency == address(0) && msg.value == amount) || (loans[loanId].currency != address(0) && msg.value == 0 && amount > 0));
        
        uint256 paidByBorrower = msg.value > 0 ? msg.value : amount;
        uint256 amountPaidAsInstallmentToLender = paidByBorrower; // >> amount of installment that goes to lender
        uint256 interestPerInstallement = paidByBorrower * loanFeesHandler[loanId].interestRate / 100; // entire interest for installment
        uint256 discount = calculateDiscount(loanId,msg.sender);
        uint256 interestToStaterPerInstallement = interestPerInstallement * loanFeesHandler[loanId].interestRateToStater / 100;

        if ( discount != 1 ){
            if ( loans[loanId].currency == address(0) ){
                require(payable(msg.sender).send(interestToStaterPerInstallement / discount));
                amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender - (interestToStaterPerInstallement / discount);
            }
            interestToStaterPerInstallement = interestToStaterPerInstallement - (interestToStaterPerInstallement / discount);
        }
        amountPaidAsInstallmentToLender = amountPaidAsInstallmentToLender - interestToStaterPerInstallement;

        loanControlPanels[loanId].paidAmount = loanControlPanels[loanId].paidAmount + paidByBorrower;
        loans[loanId].nrOfPayments = loans[loanId].nrOfPayments + (paidByBorrower / loanControlPanels[loanId].installmentAmount);

        if (loanControlPanels[loanId].paidAmount >= loanControlPanels[loanId].amountDue)
            loanControlPanels[loanId].status = Status.LIQUIDATED;

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
            loanControlPanels[loanId].status
        );
    }

    // Borrower can withdraw loan items if loan is LIQUIDATED
    // Lender can withdraw loan item is loan is DEFAULTED
    function terminateLoan(uint256 loanId) external {
        require(msg.sender == loans[loanId].borrower || msg.sender == loans[loanId].lender);
        require((block.timestamp >= loanControlPanels[loanId].startEnd[1] || loanControlPanels[loanId].paidAmount >= loanControlPanels[loanId].amountDue) || lackOfPayment(loanId) < 1);
        require(loanControlPanels[loanId].status == Status.LIQUIDATED || loanControlPanels[loanId].status == Status.APPROVED);

        if ( lackOfPayment(loanId) < 1 ) {
            loanControlPanels[loanId].status = Status.WITHDRAWN;
            loanControlPanels[loanId].startEnd[1] = block.timestamp;
            // We send the items back to lender
            transferItems(
                address(this),
                loans[loanId].lender,
                loans[loanId].nftAddressArray,
                loans[loanId].nftTokenIdArray,
                loans[loanId].nftTokenTypeArray
            );
        } else {
            if ( block.timestamp >= loanControlPanels[loanId].startEnd[1] && loanControlPanels[loanId].paidAmount < loanControlPanels[loanId].amountDue ) {
                loanControlPanels[loanId].status = Status.WITHDRAWN;
                // We send the items back to lender
                transferItems(
                    address(this),
                    loans[loanId].lender,
                    loans[loanId].nftAddressArray,
                    loans[loanId].nftTokenIdArray,
                    loans[loanId].nftTokenTypeArray
                );
            } else if ( loanControlPanels[loanId].paidAmount >= loanControlPanels[loanId].amountDue ){
                loanControlPanels[loanId].status = Status.WITHDRAWN;
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
            loanControlPanels[loanId].status
        );
    }
    
    function approveLoanCoreMechanism(uint256 loanId) internal {
        require(loans[loanId].lender == address(0));
        require(loanControlPanels[loanId].paidAmount == 0);
        require(loanControlPanels[loanId].status == Status.LISTED);

        // Borrower assigned , status is 1 , first installment ( payment ) completed
        loans[loanId].lender = payable(msg.sender);
        loanControlPanels[loanId].startEnd[1] = block.timestamp + (
            loans[loanId].nrOfInstallments * ( loans[loanId].installmentTime / loans[loanId].nrOfInstallments )
        );
        loanControlPanels[loanId].status = Status.APPROVED;
        loanControlPanels[loanId].startEnd[0] = block.timestamp;

        emit LoanApproved(
            msg.sender,
            loanId,
            loanControlPanels[loanId].startEnd[1]
        );
    }
}
