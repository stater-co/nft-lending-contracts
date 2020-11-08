// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import 'multi-token-standard/contracts/interfaces/IERC1155.sol';
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

// import "./lib/ERC1155Tradable.sol";

contract NFTLendingData is ERC721Holder, WhitelistedRole, Ownable {
  enum NFTLoanStatus {
    APPLICATION, // Loan application has been submitted
    APPROVED, // A submitted loan application has been approved by a lender
    MISSED_INSTALLMENTS, // An approved loan application, where the borrower has missed payments
    PAID, // An approved loan application, where the borrower has finished payments
    LIQUIDATED // The borrower has defaulted on the loan and the NFT was taken by the lender
  }

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
    NFTLoanStatus status; // the current status of the loan
  } // TODO Due to trunction of integer division the last installment is computed as: loanAmount - amountPerInstallment * (numberOfInstallments - 1)

  NFTLoan[] nftLoans; // the array of NFT loans
  mapping(address => uint256[]) borrowers;
  mapping(address => uint256[]) lenders;

  function offerLoan(
    address[] calldata _nftAddressArray,
    uint256[] calldata _nftTokenIdArray,
    uint256 _loanAmount,
    uint256 _assetsValue,
    address _token,
    uint256 _loanDuration,
    uint256 _numberOfInstallments,
    uint256 _interestRate
  ) external returns (uint256) {
    // I think we shouldn't do this check as the nft contract already does it and it's the user's
    // responsibility to own the token, if it fails it fails on his dime
    // require(
    //     IERC1155(_nftAddressArray[0]).balanceOf(msg.sender, _nftTokenIdArray[0]) == 1,
    //     "The borrower must be the owner of the NFT token"
    // );
    require(
        _numberOfInstallments > 0,
        "Loan must include at least 1 installment"
    );
    require(_loanDuration > 0, "Loan duration must be higher than 0");
    require(_loanAmount > 0, "Loan amount must be higher than 0");
    require(_interestRate > 0, "Interest rate must be higher than 0");
    require(_percent(_loanAmount, _assetsValue, 3) <= 500, "LTV must be under 50%");

    // Would need to be preapproved by owner before, it might be better to outright transfer the NFT 
    // to the escrow account before the contract is run
    _transferLoanNftsToEscrow(_nftAddressArray, _nftTokenIdArray);

    uint256 loanId = nftLoans.length;
    borrowers[msg.sender].push(loanId);
    NFTLoan memory loan = NFTLoan(
      loanId, // loanId
      msg.sender,
      address(0), // lender set to 0x0 at the beginning
      _nftAddressArray,
      _nftTokenIdArray,
      _loanAmount,
      _assetsValue,
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
    nftLoans.push(loan);
    return loanId;
  }

  function approveLoan(
    uint256 _loanId
  ) external {
    uint256 loanAmount = nftLoans[_loanId].loanAmount;
    nftLoans[_loanId].borrower.transfer(loanAmount);

    nftLoans[_loanId].lender = msg.sender;
    nftLoans[_loanId].status = NFTLoanStatus.APPROVED;
    nftLoans[_loanId].approvedTimestamp = now;
    lenders[msg.sender].push(_loanId);
  }

  function _transferLoanNftsToEscrow(
    address[] memory _nftAddressArray,
    uint256[] memory _nftTokenIdArray
  ) internal {
    uint256 length = _nftAddressArray.length;
    for(uint256 i = 0; i < length; i++) {
      address nftAddress = _nftAddressArray[i];
      uint256 nftTokenId = _nftTokenIdArray[i];
      // needs to be preapproved by owner
      IERC721(nftAddress).safeTransferFrom(
        msg.sender,
        address(this),
        nftTokenId
      );
    }
  }
  
  function _percent(uint numerator, uint denominator, uint precision) internal pure returns(uint quotient) {

         // caution, check safe-to-multiply here
        uint _numerator  = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
  }
}
