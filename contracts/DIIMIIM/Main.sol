// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721.sol";

contract Lending {

  address payable public owner;
  uint256 public loanFee = 1;
  uint256 public ltv = 600;
  uint256 public interestRateToCompany = 40;
  uint256 public interestRateToLender = 60;

  constructor() public {
    owner = msg.sender;
  }

  struct Loan {
    uint256[] nftTokenIdArray; // the unique identifier of the NFT token that the borrower uses as collateral
    uint256 id; // unique Loan identifier
    uint256 loanAmount; // the amount, denominated in tokens (see next struct entry), the borrower lends
    uint256 assetsValue; // important for determintng LTV which has to be under 50-60%
    uint256 interestRate; // the total interest rate as percentage with 3 decimal digits after the comma 1234 means 1,234%
    // changed to >> 1234 , automatically converted by / 1000 on front-end or back-end
    uint256 installmentFrequency; // how many weeks between each installment ( payment )
    uint256 loanEnd; // "the point when the loan is approved to the point when it must be paid back to the lender"
    uint256 numberOfInstallments; // the number of installments that the borrower must pay.
    // reduced to 16 bits sized uint
    uint256 status; // the current status of the loan
    address[] nftAddressArray; // the adderess of the ERC721
    address payable borrower; // the address who receives the loan
    address payable lender; // the address who gives/offers the loan to the borrower
    address token; // the token that the borrower lends
  }

  Loan[] loans; // the array of NFT loans

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function.");
    _;
  }

  function getLoanStatus ( uint256 loanId ) external view onlyOwner returns(uint256) {
    return loans[loanId].status;
  }

  function setLtv(uint256 newLtv) external onlyOwner returns(uint256) {
    ltv = newLtv;
    return(ltv);
  }

  function setInterestRateToCompany(uint256 newInterestRateToCompany) external onlyOwner returns(uint256) {
    interestRateToCompany = newInterestRateToCompany;
    return(ltv);
  }

  function setInterestRateToLender(uint256 newInterestRateToLender) external onlyOwner returns(uint256) {
    interestRateToLender = newInterestRateToLender;
    return(ltv);
  }

  function _percent(uint numerator, uint denominator, uint precision) internal pure returns(uint256) {
    uint256 num = numerator * 10 ** (precision+1);
    return (( num / denominator) + 5) / 10;
  }

  function _transferLoanNftsToEscrow( address[] memory nftAddressArray , uint256[] memory nftTokenIdArray ) internal {
    uint256 length = nftAddressArray.length;
    require(length == nftTokenIdArray.length, "Token infos provided are invalid");
    for(uint256 i = 0; i < length; i++) 
      IERC721(nftAddressArray[i]).safeTransferFrom(
        msg.sender,
        address(this),
        nftTokenIdArray[i]
      );
  }

  function createLoan(
    address[] calldata nftAddressArray,
    uint256[] calldata nftTokenIdArray,
    address token,
    uint256 loanAmount,
    uint256 assetsValue,
    uint256 interestRate,
    uint256 installmentFrequency,
    uint256 numberOfInstallments
  ) external returns(uint256) {
    require(nftAddressArray.length == nftTokenIdArray.length, "Token infos provided are invalid");
    require(numberOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(interestRate > 0, "Interest rate must be higher than 0");
    require(_percent(loanAmount,assetsValue,3) <= ltv, "LTV must be under 60%");

    // To avoid the "Stack too deep" error
    _transferLoanNftsToEscrow(nftAddressArray, nftTokenIdArray);

    uint256 id = loans.length;
    loans.push(
      Loan(
          nftTokenIdArray,
          id,
          loanAmount,
          assetsValue,
          interestRate,
          installmentFrequency,
          0,
          numberOfInstallments,
          0,
          nftAddressArray,
          address(0),
          msg.sender,
          token
      )
    );

    return id;
  }

  function chooseLoan( uint256 loanId ) external payable returns(uint256, uint256, uint256){
    require(loans[loanId].loanEnd >= now,"Loan validity expired");
    require(loans[loanId].borrower == address(0),"Someone else payed for this loan before you");
    require(loans[loanId].status == 0, "This loan is currently not ready for borrowers");

    // Check how much is payed
    uint256 installmentAmount = loans[loanId].loanAmount / loans[loanId].numberOfInstallments;
    require(msg.value == installmentAmount,"Not enough ether");

    // Send 99% to lender & 1% to company
    // Floating point problem , impossible to send rational qty of ether ( debatable )
    // The rest of the wei is sent to company by default
    loans[loanId].lender.transfer(installmentAmount / 100 * 99);
    owner.transfer(installmentAmount - installmentAmount / 100 * 99);

    // Borrower assigned , status is 1 ( approved ) + first installment ( payment ) completed
    loans[loanId].borrower = msg.sender;
    loans[loanId].status = 1;
    loans[loanId].loanEnd = now + loans[loanId].installmentFrequency * 1 weeks;

    // Return the start date , finish date and current status of loan
    return (now,loans[loanId].loanEnd,loans[loanId].status);
  }


  // The borrower can ask for a loan extension from the website , no blockchain operation required
  function extendLoan( uint256 loanId , uint256 nrOfWeeks ) external returns(uint256,uint256,uint256) {
    require(loans[loanId].lender == msg.sender);
    require(loans[loanId].status >= 1, "You can't extend a loan without an active borrower");
    require(loans[loanId].status < loans[loanId].numberOfInstallments, "All payments have been done for this loan");
    
    // Extend the loan finish date
    // The extension is automatically considered as paid installments ( complexity reasons ) ( debatable )
    loans[loanId].loanEnd += nrOfWeeks * 1 weeks;
    loans[loanId].status += nrOfWeeks;
    loans[loanId].numberOfInstallments += nrOfWeeks;

    // Returns the loan finish date , current status and nuber of installments
    return (loans[loanId].loanEnd,loans[loanId].status,loans[loanId].numberOfInstallments);
  }

  function payLoan( uint256 loanId ) external payable returns(uint256, uint256, bool){
    require(loans[loanId].loanEnd >= now,"Loan validity expired");
    require(loans[loanId].borrower == msg.sender,"You're not the borrower of this loan");
    require(loans[loanId].status >= 1, "You must choose the loan first");
    require(loans[loanId].status < loans[loanId].numberOfInstallments, "All payments have been done for this loan");
    
    // Check how much is payed
    uint256 installmentAmount = loans[loanId].loanAmount / loans[loanId].numberOfInstallments;
    // Check if payment doesn't exceed
    require(installmentAmount <= loans[loanId].numberOfInstallments - loans[loanId].status);
    require(msg.value < installmentAmount,"Not enough ether");

    // If interest rate can be greater than 1x installment amount >> BUG ( to discuss )

    // Check how many installments he's paying for
    uint256 totalPayments = msg.value / installmentAmount;

    // If this is not the last installment
    if ( loans[loanId].status < loans[loanId].numberOfInstallments - 1 )
      // We check to have an exact qty of ether
      require(totalPayments * installmentAmount == msg.value);
    else
      // Otherwise we check for both : last installment + interest rate 
      require(totalPayments * installmentAmount + loans[loanId].interestRate == msg.value);

    // Transfer the ether
    loans[loanId].lender.transfer( installmentAmount * totalPayments / 100 * 99);
    owner.transfer(installmentAmount * totalPayments - installmentAmount * totalPayments / 100 * 99);

    loans[loanId].status += totalPayments;

    bool isFinished = loans[loanId].status == loans[loanId].numberOfInstallments;
    if ( isFinished ){
      // Transfer the ether
      loans[loanId].lender.transfer( loans[loanId].interestRate / 100 * 60);
      owner.transfer(loans[loanId].interestRate - loans[loanId].interestRate / 100 * 40);
    }

    // Return the date of payment , current status and the finished boolean status
    return( now , loans[loanId].status , isFinished );
  }

}