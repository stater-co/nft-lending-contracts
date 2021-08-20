// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;
import "./LendingCore.sol";
import "./LendingCoreMethods.sol";
import "../plugins/StaterProxy/StaterProxy.sol";
import "../libs/openzeppelin-solidity/contracts/access/Ownable.sol";


contract LendingTemplate is LendingCore, LendingCoreMethods, StaterProxy {
    
    address public loanHandler;
    address public discountsHandler;
    uint256 public ltv = 600;
    uint256 public interestRate = 20;
    uint256 public interestRateToStater = 40;
    uint32 public lenderFee = 100;

    constructor(
        address _discountsHandler,
        address _loanHandler
    ) {
        require(_discountsHandler != address(0), "A valid discounts handler is required");
        require(_loanHandler != address(0), "A valid loan handler is required");
        discountsHandler = _discountsHandler;
        loanHandler = _loanHandler;
    }

    function setGlobalVariables(LoanFeesHandler memory feesHandler, Handlers memory handlers) external onlyOwner {
        ltv = feesHandler.ltv;
        interestRate = feesHandler.interestRate;
        interestRateToStater = feesHandler.interestRateToStater;
        lenderFee = feesHandler.lenderFee;
        loanHandler = handlers.loanHandler;
        discountsHandler = handlers.discountsHandler;
    }

    /*
     * @DIIMIIM
     * Loan methods inherited 
     */

    /*
     * @DIIMIIM
     * Promissory methods inherited 
     */
  
}