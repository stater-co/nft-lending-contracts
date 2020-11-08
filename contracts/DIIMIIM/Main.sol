pragma solidity ^0.7.4;

interface Asset {
    function transfer(address _to, uint256 _value) external returns (bool success);
    function transferFrom(address _from, address _to, uint256 _tokenId) external returns (bool success);
}

contract Main {

  address constant escrow = address(0xdafbF3fE1aC5BBfE7c29A59907f84F41c2CC7613);

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
    uint256 interestRate; // the total interest rate as percentage with 3 decimal digits after the comma 1234 means 1,234%
    uint256 numberOfInstallments; // the number of installments that the borrower must pay.
    uint256 amountPerInstallment; // the amount per installment is obtained by: loanAmount * (1 + interestRate) / numberOfInstallments
    uint256 installmentsPaid; // the number of installments paid so far by the borrower
    uint256 amountPaid; // the amount paid so far by the borrower
    uint256 numberOfMissedInstallments; // the current number of missed/outstanding installments. Set to 0 when/if they are paid
    uint16 status; // the current status of the loan
  }

    function escrowDeposit(address[] calldata addresses, uint256[] calldata ids, uint256 totalPrice) external returns(uint256){
        require(addresses.length == ids.length, "Weird input provided");
        for ( uint32 i = 0 ; i < addresses.length ; ++i )
            Asset(addresses[i]).transferFrom(msg.sender, escrow, ids[i]);
    }
    
}
