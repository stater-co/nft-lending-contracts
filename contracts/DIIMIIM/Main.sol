// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";

contract Lending {

  struct Loan {
    address[] nftAddressArray; // the adderess of the ERC721
    address payable borrower; // the address who receives the loan
    address payable lender; // the address who gives/offers the loan to the borrower
    address token; // the token that the borrower lends
    uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
    uint256 id; // unique Loan identifier
    
    uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
    uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
    
    uint16 loanDurationInDays;
    uint48 loanEnd; // "the point when the loan is approved to the point when it must be paid back to the lender"

    uint256 amountPerInstallment; // the amount per installment is obtained by: loanAmount * (1 + interestRate) / numberOfInstallments
    uint256 amountPaid; // the amount paid so far by the borrower
    
    uint32 interestRate; // the total interest rate as percentage with 3 decimal digits after the comma 1234 means 1,234%
    // changed to >> 1234 , automatically converted by / 1000 on front-end or back-end

    uint16 numberOfInstallments; // the number of installments that the borrower must pay.
    // reduced to 16 bits sized uint
    
    uint16 installmentsPaid; // the number of installments paid so far by the borrower
    uint16 numberOfMissedInstallments; // the current number of missed/outstanding installments. Set to 0 when/if they are paid
    uint16 status; // the current status of the loan
  }

  Loan[] loans; // the array of NFT loans
  mapping(address => uint256[]) borrowers;
  mapping(address => uint256[]) lenders;

  function offerLoan(
    address[] calldata nftAddressArray,
    uint256[] calldata nftTokenIdArray,
    address token,
    uint256 loanAmount,
    uint256 assetsValue,
    uint32 interestRate,
    uint16 loanDurationInDays,
    uint16 numberOfInstallments
  ) external returns(uint256) {
    require(nftAddressArray.length == nftTokenIdArray.length, "Token infos provided are invalid");
    require(numberOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(interestRate > 0, "Interest rate must be higher than 0");
    
    uint48 theLoanEnd = uint48(now + loanDurationInDays * 1 days);
    require(theLoanEnd > now, "Loan duration must be higher than 0");
    
    require(percent(loanAmount,assetsValue,3) <= 500, "LTV must be under 50%");

    // Would need to be preapproved by owner before, it might be better to outright transfer the NFT 
    // to the escrow account before the contract is run
    transferLoanNftsToEscrow(nftAddressArray, nftTokenIdArray);

    uint256 id = loans.length;
    borrowers[msg.sender].push(id);
    loans.push(
      Loan(
          nftAddressArray,
          msg.sender,
          address(0),
          token,
          nftTokenIdArray,
          id,
          loanAmount,
          assetsValue,
          loanDurationInDays,
          theLoanEnd,
          (loanAmount * (1 + interestRate)) / numberOfInstallments,
          0,
          interestRate,
          numberOfInstallments,
          0,
          0,
          0
      )
    );
    return id;
  }

  function approveLoan( uint256 loanId ) external {
    require(loans[loanId].loanEnd >= now,"Loan validity expired");
    loans[loanId].borrower.transfer(loans[loanId].loanAmount);
    loans[loanId].lender = msg.sender;
    loans[loanId].status = 1;
    loans[loanId].loanEnd = uint48(now + loans[loanId].loanDurationInDays * 1 days);
    lenders[msg.sender].push(loanId);
  }

  function transferLoanNftsToEscrow( address[] memory nftAddressArray , uint256[] memory nftTokenIdArray ) internal {
    uint256 length = nftAddressArray.length;
    require(length == nftTokenIdArray.length, "Token infos provided are invalid");
    for(uint256 i = 0; i < length; i++) {
      // needs to be preapproved by owner
      IERC721(nftAddressArray[i]).safeTransferFrom(
        msg.sender,
        address(this),
        nftTokenIdArray[i]
      );
    }
  }
  
  function percent(uint numerator, uint denominator, uint precision) internal pure returns(uint256) {
         // caution, check safe-to-multiply here
        uint256 num = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint256 quot = (( num / denominator) + 5) / 10;
        return quot;
  }
}
