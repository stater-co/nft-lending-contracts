// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

interface Asset {
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external returns (bool success);
}

contract Main {

    struct NFTLoan {
        uint256 loanId; // unique Loan identifier
        address payable borrower; // the address who receives the loan
        address payable lender; // the address who gives/offers the loan to the borrower
        address[] nftAddressArray; // the adderess of the ERC721
        uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
        uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
        address token; // the token that the borrower lends
        uint256 creationTimestamp; // the timestamp when this loan was created
        uint256 approvedTimestamp; // the timestamp when this loan was approved
        uint256 loanDuration; // the duration (in seconds) from the point when the loan is approved to the point when it must be paid back to the lender
        uint256 numberOfInstallments; // the number of installments that the borrower must pay.
        uint256 amountPerInstallment; // the amount per installment is obtained by: loanAmount * (1 + interestRate) / numberOfInstallments
        uint256 installmentsPaid; // the number of installments paid so far by the borrower
        uint256 amountPaid; // the amount paid so far by the borrower
        uint256 numberOfMissedInstallments; // the current number of missed/outstanding installments. Set to 0 when/if they are paid
        uint32 interestRate; // the total interest rate as percentage with 3 decimal digits after the comma 1234 means 1,234%
        uint16 status; // the current status of the loan
    }


  function _percent(uint numerator, uint denominator, uint precision) internal pure returns(uint quotient) {

        require(numerator * ( 10 ** ( precision + 1 ) ) > numerator);
        uint _numerator  = numerator * ( 10 ** (precision+1) );
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
  }

    function escrowDeposit(
        address[] calldata addresses, 
        address token,
        uint256[] calldata ids, 
        uint256 totalPrice,
        uint256 loanAmount,
        uint256 assetsValue,
        uint16 loanDuration,
        uint256 numberOfInstallments,
        uint256 interestRate
    ) external returns(uint256){
        require(addresses.length == ids.length, "The assets details are incorrect.");
        require(numberOfInstallments > 0,"Loan must include at least 1 installment");
        require(loanDuration > 0, "Loan duration must be higher than 0");
        require(loanAmount > 0, "Loan amount must be higher than 0");
        require(interestRate > 0, "Interest rate must be higher than 0");
        require(_percent(loanAmount, assetsValue, 3) <= 500, "LTV must be under 50%");
        
        for ( uint32 i = 0 ; i < addresses.length ; ++i )
            require(Asset(addresses[i]).safeTransferFrom(msg.sender, address(this), ids[i]),"One of the assets is not approved");
    }

}
