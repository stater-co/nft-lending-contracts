// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";
import "./lib/ERC1155Tradable.sol";

contract NFTLendingData is WhitelistedRole, Ownable {
    enum NFTLoanStatus {
        APPLICATION, // Loan application has been submitted
        APPROVED, // A submitted loan application has been approved by a lender
        MISSED_INSTALLMENTS, // An approved loan application, where the borrower has missed payments
        PAID, // An approved loan application, where the borrower has finished payments
        LIQUIDATED // The borrower has defaulted on the loan and the NFT was taken by the lender
    }

    struct NFTLoan {
        uint256 loanId; // unique Loan identifier
        address borrower; // the address who receives the loan
        address lender; // the address who gives/offers the loan to the borrower
        address nftAddress; // the adderess of the ERC721
        uint256 nftTokenId; // the unique identifier of the NFT token that the borrower uses as collateral
        uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
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
        NFTLoanStatus status; // the current status of the loan
    } // TODO Due to trunction of integer division the last installment is computed as: loanAmount - amountPerInstallment * (numberOfInstallments - 1)

    NFTLoan[] nftLoans; // the array of NFT loans

    function offerLoan(
        address _nftTokenAddress,
        uint256 _nftTokenId,
        uint256 _loanAmount,
        address _token,
        uint256 _loanDuration,
        uint256 _numberOfInstallments,
        uint256 _interestRate
    ) external returns (uint256) {
        require(
            IERC1155(_nftTokenAddress).balanceOf(msg.sender, _nftTokenId) == 1,
            "The borrower must be the owner of the NFT token"
        );
        require(
            _numberOfInstallments > 0,
            "Loan must include at least 1 installment"
        );
        require(_loanDuration > 0, "Loan duration must be higher than 0");
        require(_loanAmount > 0, "Loan amount must be higher than 0");
        require(_interestRate > 0, "Interest rate must be higher than 0");
        uint256 loanId = nftLoans.length;
        NFTLoan memory l = NFTLoan(
            loanId, // loanId
            msg.sender,
            address(0), // lender set to 0x0 at the beginning
            _nftTokenAddress,
            _nftTokenId,
            _loanAmount,
            _token, // if 0x0 then the native ETH is requested
            now, // creation timestamp
            0, // approval timestamp
            _loanDuration,
            _interestRate,
            _numberOfInstallments,
            (_loanAmount * (1 + _interestRate)) / _numberOfInstallments, // amount per installment
            0, // installments paid
            0, // amount paid
            0, // missed installments
            NFTLoanStatus.APPLICATION
        );
        nftLoans.push(l);
        return loanId;
    }

    
}
