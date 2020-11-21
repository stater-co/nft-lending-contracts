// SPDX-License-Identifier: MIT
pragma solidity ^0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";

contract Lending is ERC721Holder {

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
    uint256 installmentFrequency; // how many days between each installment ( payment )
    uint256 loanEnd; // "the point when the loan is approved to the point when it must be paid back to the lender"
    uint256 nrOfInstallments; // the number of installments that the borrower must pay.
    uint256 nrOfPayments; // the current nrOfPayments of the loan
    uint256 status; // the loan status
    address[] nftAddressArray; // the adderess of the ERC721
    address payable borrower; // the address who receives the loan
    address payable lender; // the address who gives/offers the loan to the borrower
    address currency; // the token that the borrower lends, address(0) for ETH
  }

  Loan[] loans; // the array of NFT loans

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can call this function.");
    _;
  }



  // Create a loan
  function createLoan(
    uint256 loanAmount,
    uint256 installmentFrequency,
    uint256 nrOfInstallments,
    address currency,
    uint256 assetsValue, 
    uint256 interestRate, 
    address[] calldata nftAddressArray, 
    uint256[] calldata nftTokenIdArray
  ) external returns(uint256,uint256) {
    require(nrOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");
    require(_percent(loanAmount,assetsValue,3) <= ltv, "LTV must be under 60%");
    uint256 id = loans.length;
    _transferItems(msg.sender, address(this), nftAddressArray, nftTokenIdArray, id, true);
    loans.push(
      Loan(
          nftTokenIdArray,
          id,
          loanAmount,
          assetsValue,
          interestRate,
          installmentFrequency,
          0,
          nrOfInstallments,
          0,
          10,
          nftAddressArray,
          msg.sender,
          address(0),
          currency
      )
    );

    return (id,10);
  }


  // Approve a loan
  function approveLoan(uint256 loanId) external payable returns(uint256, uint256, uint256, uint256){
    require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
    require(loans[loanId].nrOfPayments == 0, "This loan is currently not ready for lenders");
    require(loans[loanId].status == 10, "This loan is not currently ready for lenders, check later");

    // Check how much is payed
    require(msg.value == loans[loanId].loanAmount, "The quantity of ether is not enough");

    // Send 99% to borrower & 1% to company
    // Floating point problem , impossible to send rational qty of ether ( debatable )
    // The rest of the wei is sent to company by default
    IERC20(loans[loanId].currency).transfer(loans[loanId].borrower, loans[loanId].loanAmount); // Transfer complete loanAmount to borrower
    IERC20(loans[loanId].currency).transfer(owner, loans[loanId].loanAmount - ((loans[loanId].loanAmount / 100) * (100 - loanFee))); // loanFee percent on top of original loanAmount goes to contract owner

    // Borrower assigned , status is 1 , first installment ( payment ) completed
    loans[loanId].lender = msg.sender;
    loans[loanId].loanEnd = now + (loans[loanId].nrOfInstallments * loans[loanId].installmentFrequency * 1 days);
    loans[loanId].status = 11;

    uint256 installmentAmount = (loans[loanId].loanAmount + loans[loanId].interestRate) / loans[loanId].nrOfInstallments;
    // Return the start date , finish date and current nrOfPayments of loan
    return (now, loans[loanId].loanEnd, loans[loanId].nrOfPayments, installmentAmount);
  }



  // Cancel a loan
  function cancelLoan(uint256 loanId) external returns(uint256,uint256) {
    require(loans[loanId].lender == address(0), "The loan has a lender , it cannot be cancelled");
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status != 404, "This loan is already cancelled");
    require(loans[loanId].status <= 10, "This loan is no longer cancellable");
    
    // We set its validity date as now
    loans[loanId].loanEnd = now;
    loans[loanId].status = 404;

    // We return the changed values
    return (loans[loanId].nrOfPayments, loans[loanId].loanEnd);
  }



  // Withdraw loan items
  function withdrawItems(uint256 loanId) external {
    require(now >= loans[loanId].loanEnd || loans[loanId].nrOfPayments == loans[loanId].nrOfInstallments, "The loan is not finished yet");
    require(loans[loanId].borrower == msg.sender || loans[loanId].lender == msg.sender, "You're not part of this loan");
    require(loans[loanId].status != 200, "Loan is already finished");
    require(loans[loanId].status == 199 || loans[loanId].status == 404, "Loan cannot be currently finished");

    // If all payments are done by the borrower
    if (loans[loanId].nrOfPayments == loans[loanId].nrOfInstallments) 

      // We send the items back to him
      _transferItems(address(this),loans[loanId].borrower,loans[loanId].nftAddressArray,loans[loanId].nftTokenIdArray,loanId,false);

    else 

      // Otherwise the lender will receive the items
      _transferItems(address(this),loans[loanId].lender,loans[loanId].nftAddressArray,loans[loanId].nftTokenIdArray,loanId,false);

    loans[loanId].status = 200;

  }



  // The borrower can ask for a loan extension from the website , no blockchain operation required
  function extendLoan(uint256 loanId, uint256 nrOfWeeks) external returns(uint256,uint256,uint256) {
    require(loans[loanId].lender == msg.sender, "You're not the lender of this loan");
    require(loans[loanId].status < 199, "All payments have been done for this loan");
    require(loans[loanId].nrOfPayments < loans[loanId].nrOfInstallments, "All payments have been done for this loan");
    require(loans[loanId].loanEnd >= now, "Loan validity expired");
    
    // Extend the loan finish date
    loans[loanId].loanEnd += nrOfWeeks * 1 days;
    loans[loanId].nrOfPayments += nrOfWeeks;
    loans[loanId].nrOfInstallments += nrOfWeeks;

    // Returns the loan finish date , current nrOfPayments and nuber of installments
    return (loans[loanId].loanEnd, loans[loanId].nrOfPayments, loans[loanId].nrOfInstallments);
  }



  // Pay for loan
  // Multiple installments : OK
  function payLoan(uint256 loanId) external payable returns(uint256, uint256, uint256){
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status < 199, "All payments have been done for this loan");
    require(loans[loanId].loanEnd >= now, "Loan validity expired");
    require(loans[loanId].nrOfPayments < loans[loanId].nrOfInstallments, "All payments have been done for this loan");
    
    // Check how much is payed
    uint256 installmentAmount = (loans[loanId].loanAmount + loans[loanId].interestRate) / loans[loanId].nrOfInstallments;
    require(msg.value >= installmentAmount, "Not enough ether");

    // Check how many installments he's paying for
    uint256 totalPayments = msg.value / installmentAmount;

    // Check if payment doesn't exceed
    require(totalPayments <= loans[loanId].nrOfInstallments - loans[loanId].nrOfPayments, "You're trying to pay too much");

    // We check to have an exact qty of ether
    require(totalPayments * installmentAmount == msg.value, "Quantity of ether is not accurate");

    // Transfer the ether
    IERC20(loans[loanId].currency).transfer(loans[loanId].lender, (installmentAmount * totalPayments / 100) * (100 - interestRateToCompany));
    IERC20(loans[loanId].currency).transfer(owner, (installmentAmount * totalPayments) - ((installmentAmount * totalPayments / 100) * (100 - interestRateToCompany)));

    loans[loanId].nrOfPayments += totalPayments;
    
    if (loans[loanId].nrOfPayments == loans[loanId].nrOfInstallments)
      loans[loanId].status = 199;

    // Return the date of payment , current nrOfPayments and the finished boolean nrOfPayments
    return(now, loans[loanId].nrOfPayments, loans[loanId].status);
  }



  // Internal Functions 

  // Calculates a percentage
  function _percent(uint256 numerator, uint256 denominator, uint256 precision) internal pure returns(uint256) {
    return (((numerator * 10 ** (precision + 1)) / denominator) + 5) / 10;
  }

  // Transfer items fron an account to another
  // Requires approvement
  function _transferItems(
    address from, 
    address to, 
    address[] memory nftAddressArray, 
    uint256[] memory nftTokenIdArray, 
    uint256 loanId,
    bool pushable
  ) internal {
    uint256 length = nftAddressArray.length;
    require(length == nftTokenIdArray.length, "Token infos provided are invalid");
    for(uint256 i = 0; i < length; ++i) {
      IERC721(nftAddressArray[i]).safeTransferFrom(
        from,
        to,
        nftTokenIdArray[i]
      );
      if ( pushable ){
        loans[loanId].nftTokenIdArray.push(nftTokenIdArray[i]);
        loans[loanId].nftAddressArray.push(nftAddressArray[i]);
      }
    }
  }



  // Getters & Setters

  function getLoanNrOfPayments (uint256 loanId) external view returns(uint256) {
    return loans[loanId].nrOfPayments;
  }

  function getLoanStatus (uint256 loanId) external view returns(uint256) {
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



}