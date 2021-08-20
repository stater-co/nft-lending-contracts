// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "../../LendingCore.sol";
import "../../../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../../../libs/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import '../../../libs/uniswap-v3-core/test/TickMathTest.sol';
import "../../../libs/uniswap-v3-periphery/interfaces/INonfungiblePositionManager.sol";
import '../../../libs/uniswap-v3-periphery/libraries/LiquidityAmounts.sol';
import "./params/HealthFactorCreateLoanMethod.sol";


contract StaterHealthFactor is Ownable, LendingCore, HealthFactorCreateLoanMethod, TickMathTest {
    
    address public loanHandler;
    address public discountsHandler;
    uint256 public ltv = 600;
    uint256 public interestRate = 20;
    uint256 public interestRateToStater = 40;
    uint32 public lenderFee = 100;
    uint256 public liquidationTreshold = .3 ether;
    address public uniswapV3NftAddress;
    mapping(address => bool) public whitelistedCurrencies;
    using LiquidityAmounts for uint160;
    
    
    constructor(
        address _uniswapV3NftAddress,
        address[] memory _whitelistedCurrencies
    ) {
        require(_uniswapV3NftAddress != address(0), "A valid uniswap v3 address is required");
        uniswapV3NftAddress = _uniswapV3NftAddress;
        for ( uint256 i = 0; i < _whitelistedCurrencies.length; ++i )
            whitelistedCurrencies[_whitelistedCurrencies[i]] = true;
    }
    
    function setGlobalRouteVariables(address[] memory _whitelistedCurrencies, bool[] memory _status) external onlyOwner {
        require(_status.length == _whitelistedCurrencies.length, "Bad input");
        for ( uint256 i = 0; i < _whitelistedCurrencies.length; ++i )
            whitelistedCurrencies[_whitelistedCurrencies[i]] = _status[i];
    }
    
    function _positionBalance(uint256 positionId, bool isToken1) internal view returns(uint256) {
        (,,,,,int24 tickLower,int24 tickUpper,uint128 liquidity,,,,) = INonfungiblePositionManager(uniswapV3NftAddress).positions(positionId);
        uint160 sqrtLower = getSqrtRatioAtTick(tickLower);
        uint160 sqrtUpper = getSqrtRatioAtTick(tickUpper);
        return isToken1 ? sqrtUpper.getAmount1ForLiquidity(sqrtLower,liquidity) : sqrtLower.getAmount0ForLiquidity(sqrtUpper,liquidity);
    }
    
    function _positionBalance(uint256 positionId) internal view returns(uint256) {
        return _positionBalance(positionId,false);
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
        for (uint256 i = 0; i < loan.nftTokenIdArray.length; ++i) {
            healthFactor += _positionBalance(loan.nftTokenIdArray[i]) * liquidationTreshold / loanControlPanel.amountDue;
        }
        
        return healthFactor / loan.nftTokenIdArray.length;
    }
    
    function getLoanAssetsValue(HealthFactorCreateLoanMethodParams memory loan) external view returns(uint256) {
        uint256 assetsValue;
        for ( uint256 i = 0; i < loan.nftTokenIdArray.length; ++i ){
            (,,address token0,address token1,,,,,,,,) = INonfungiblePositionManager(uniswapV3NftAddress).positions(loan.nftTokenIdArray[i]);
            require(whitelistedCurrencies[token0] && whitelistedCurrencies[token1], "Pair of tokens not accepted");
            assetsValue += _positionBalance(loan.nftTokenIdArray[i]);
        }
        return assetsValue;
    }
    
    // Borrower creates a loan
    function createLoan(
        HealthFactorCreateLoanMethodParams memory loan
    ) external {
        require(loan.nrOfInstallments > 0, "Loan must have at least 1 installment");
        require(loan.nftTokenIdArray.length > 0, "Loan must have at least 1 NFT");
        
        
        for ( uint256 i = 0; i < loan.nftTokenIdArray.length; ++i ){
            (,,address token0,address token1,,,,,,,,) = INonfungiblePositionManager(uniswapV3NftAddress).positions(loan.nftTokenIdArray[i]);
            require(whitelistedCurrencies[token0] && whitelistedCurrencies[token1], "Pair of tokens not accepted");
            loans[id].assetsValue += _positionBalance(loan.nftTokenIdArray[i]);
            loans[id].nftAddressArray.push(uniswapV3NftAddress);
            loans[id].nftTokenTypeArray.push(0);
            loans[id].nftTokenIdArray.push(loan.nftTokenIdArray[i]);
        }
        
        require(loan.loanAmount <= (loans[id].assetsValue / 100) * (ltv / 10), "The LTV must be under 60%");
    
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
        loanControlPanels[id].amountDue = (loans[id].loanAmount * (loanFeesHandler[id].interestRate + 100)) / 100; // interest rate >> 20%
        loans[id].nrOfInstallments = loan.nrOfInstallments;
        loanControlPanels[id].installmentAmount = loanControlPanels[id].amountDue % loan.nrOfInstallments > 0 ? loanControlPanels[id].amountDue / loan.nrOfInstallments + 1 : loanControlPanels[id].amountDue / loan.nrOfInstallments;
        loanControlPanels[id].status = Status.LISTED;
        loanControlPanels[id].loanHandler = loanHandler;
        loanControlPanels[id].discountsHandler = discountsHandler;
        loans[id].borrower = payable(msg.sender);
        loans[id].installmentTime = 1 weeks;
        
        // Transfer the items from lender to stater contract
        transferItems(
            msg.sender, 
            address(this), 
            loans[id].nftAddressArray, 
            loans[id].nftTokenIdArray,
            loans[id].nftTokenTypeArray
        );
    

        // Fire event
        emit NewLoan(
            msg.sender, 
            uniswapV3NftAddress, 
            id,
            loans[id].nftAddressArray,
            loans[id].nftTokenIdArray,
            loans[id].nftTokenTypeArray
        );
        ++id;
    }


    /*
     * @ Edit loan
     * @ Accessible for borrower until a lender is found
     */
    function editLoan(
        uint256 loanId,
        uint16 nrOfInstallments,
        uint256 installmentTime
    ) external {
        require(nrOfInstallments > 0);
        require(loans[loanId].borrower == msg.sender);
        require(loanControlPanels[loanId].status < Status.APPROVED);
        

        loans[loanId].installmentTime = installmentTime;
        loans[loanId].nrOfInstallments = nrOfInstallments;
        
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
            loans[loanId].currency, 
            loanId,
            loans[loanId].loanAmount,
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
        require((block.timestamp >= loanControlPanels[loanId].startEnd[1] || loanControlPanels[loanId].paidAmount >= loanControlPanels[loanId].amountDue) && lackOfPayment(loanId) > 3);
        require(loanControlPanels[loanId].status == Status.LIQUIDATED || loanControlPanels[loanId].status == Status.APPROVED);

        if ( lackOfPayment(loanId) < 3 ) {
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
