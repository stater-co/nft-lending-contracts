// SPDX-License-Identifier: MIT
pragma solidity 0.5.12;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Holder.sol";
import "multi-token-standard/contracts/interfaces/IERC1155.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/access/roles/WhitelistedRole.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";


contract Lending is ERC721Holder, Ownable {

  using SafeMath for uint256;

  uint256 public constant PRECISION = 3;
  uint256 public loanFee = 1; // 1%
  uint256 public ltv = 600; // 60%
  uint256 public interestRateToCompany = 40; // 40%
  uint256 public interestRateToLender = 100 - interestRateToCompany;  // 60%
  uint256 public interestRate = 20; // 20%
  uint256 public installmentFrequency = 7; // days

  event newLoan(uint256 indexed loanId, address indexed owner, uint256 loanPercentage, uint256 creationDate, address indexed currency, Status status);
  event loanApproved(uint256 indexed loanId, uint256 approvalDate, uint256 loanPaymentEnd, uint256 installmentAmount, Status status);
  event loanCancelled(uint256 indexed loanId, uint256 cancellationDate, Status status);
  event itemsWithdrawn(uint256 indexed loanId, address indexed requester, Status status);
  event loanExtended(uint256 indexed loanId, uint256 extensionDate, uint256 loanPaymentEnd, uint256 nrOfInstallments);
  event loanPayment(uint256 indexed loanId, uint256 paymentDate, uint256 installmentAmount, Status status);
  event ltvChanged(uint256 newLTV);
  event interestRateToLenderChanged(uint256 newInterestRateToLender);
  event interestRateToCompanyChanged(uint256 newInterestRateToCompany);

  constructor() public {
  }

  enum Status { 
    UNINITIALIZED,
    LISTED,
    APPROVED,
    DEFAULTED, 
    LIQUIDATED,
    CANCELLED
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
    uint256 installmentAmount; // amount expected for each installment
    uint256 amountDue; // loanAmount + interest that needs to be paid back by borrower
    uint256 paidAmount; // the amount that has been paid back to the lender to date
    Status status; // the loan status
    address[] nftAddressArray; // the adderess of the ERC721
    address payable borrower; // the address who receives the loan
    address payable lender; // the address who gives/offers the loan to the borrower
    address currency; // the token that the borrower lends, address(0) for ETH
  }

  Loan[] loans; // the array of NFT loans

  // Borrower creates a loan
  function createLoan(
    uint256 loanAmount,
    uint256 nrOfInstallments,
    address currency,
    uint256 assetsValue, 
    address[] calldata nftAddressArray, 
    uint256[] calldata nftTokenIdArray
  ) external {
    require(nrOfInstallments > 0, "Loan must include at least 1 installment");
    require(loanAmount > 0, "Loan amount must be higher than 0");

    // Compute loan to value ratio for current loan application
    uint256 percentage = _percent(loanAmount, assetsValue, PRECISION); 

    require(percentage <= ltv, "LTV exceeds maximum limit allowed");
    _transferItems(msg.sender, address(this), nftAddressArray, nftTokenIdArray);
    uint256 id = loans.length;
    uint256 loanPlusInterest = loanAmount.mul(100 + interestRate).div(100);
    uint256 installmentAmount = loanPlusInterest.div(nrOfInstallments);
    loans.push(
      Loan(
          nftTokenIdArray,
          id,
          loanAmount,
          assetsValue,
          interestRate,
          installmentFrequency,
          0, // Loan end
          nrOfInstallments,
          installmentAmount,
          loanPlusInterest,
          0, // paid amount 
          Status.LISTED, // Loan added
          nftAddressArray,
          msg.sender,
          address(0), // Lender
          currency
      )
    );
    
    emit newLoan(id, msg.sender, percentage, now, currency, Status.LISTED);
  }


  // Lender approves a loan
  function approveLoan(uint256 loanId) external {
    require(loans[loanId].lender == address(0), "Someone else payed for this loan before you");
    require(loans[loanId].paidAmount == 0, "This loan is currently not ready for lenders");
    require(loans[loanId].status == Status.LISTED, "This loan is not currently ready for lenders, check later");

    // Send 99% to borrower & 1% to company
    // Floating point problem , impossible to send rational qty of ether ( debatable )
    // The rest of the wei is sent to company by default
    require(IERC20(loans[loanId].currency).transferFrom(
      msg.sender,
      loans[loanId].borrower, 
      loans[loanId].loanAmount), 
      "Transfer of liquidity failed"); // Transfer complete loanAmount to borrower

    require(IERC20(loans[loanId].currency).transferFrom(
      msg.sender,
      owner(), 
      loans[loanId].loanAmount.mul(loanFee).div(100)), 
      "Transfer of liquidity failed"); // loanFee percent on top of original loanAmount goes to contract owner

    // Borrower assigned , status is 1 , first installment ( payment ) completed
    loans[loanId].lender = msg.sender;
    loans[loanId].loanEnd = now.add(loans[loanId].nrOfInstallments.mul(loans[loanId].installmentFrequency).mul(1 days));
    loans[loanId].status = Status.APPROVED;

    emit loanApproved(loanId,
      now, 
      loans[loanId].loanEnd, 
      loans[loanId].installmentAmount, 
      Status.APPROVED);
  }



  // Borrower cancels a loan
  function cancelLoan(uint256 loanId) external {
    require(loans[loanId].lender == address(0), "The loan has a lender , it cannot be cancelled");
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status != Status.CANCELLED, "This loan is already cancelled");
    require(loans[loanId].status <= Status.LISTED, "This loan is no longer cancellable");
    
    // We set its validity date as now
    loans[loanId].loanEnd = now;
    loans[loanId].status = Status.CANCELLED;

    // We send the items back to him
    _transferItems(address(this), 
      loans[loanId].borrower, 
      loans[loanId].nftAddressArray, 
      loans[loanId].nftTokenIdArray);

    emit loanCancelled(loanId, now, Status.CANCELLED);
  }

  // Borrower pays installment for loan
  // Multiple installments : OK
  function payLoan(uint256 loanId, uint256 amountPaidAsInstallment) external {
    require(loans[loanId].borrower == msg.sender, "You're not the borrower of this loan");
    require(loans[loanId].status == Status.APPROVED, "Incorrect state of loan");
    require(loans[loanId].loanEnd >= now, "Loan validity expired");
    
    // Check how much is payed
    require(amountPaidAsInstallment >= loans[loanId].installmentAmount, "Installment amount is too low");

    // Transfer the ether
    IERC20(loans[loanId].currency).transferFrom(
      msg.sender,
      loans[loanId].lender, 
      amountPaidAsInstallment);

    IERC20(loans[loanId].currency).transferFrom(
      msg.sender,
      owner(), 
      amountPaidAsInstallment.mul(interestRateToCompany).div(100));

    loans[loanId].paidAmount = loans[loanId].paidAmount.add(amountPaidAsInstallment);

    if (loans[loanId].paidAmount >= loans[loanId].amountDue)
      loans[loanId].status = Status.LIQUIDATED;

    emit loanPayment(loanId, now, amountPaidAsInstallment, Status.APPROVED);
  }



  // Borrower can withdraw loan items if loan is LIQUIDATED
  // Lender can withdraw loan item is loan is DEFAULTED
  function withdrawItems(uint256 loanId) external {
    require(now >= loans[loanId].loanEnd || loans[loanId].paidAmount == loans[loanId].amountDue, "The loan is not finished yet");
    require(loans[loanId].status == Status.LIQUIDATED || loans[loanId].status == Status.APPROVED, "Incorrect state of loan");

    if ((now >= loans[loanId].loanEnd) && !(loans[loanId].paidAmount == loans[loanId].amountDue)) {

      loans[loanId].status = Status.DEFAULTED;
      
      // We send the items back to him
      _transferItems(address(this),
        loans[loanId].lender,
        loans[loanId].nftAddressArray,
        loans[loanId].nftTokenIdArray);

    } else if (loans[loanId].paidAmount == loans[loanId].amountDue) {

      // Otherwise the lender will receive the items
      _transferItems(address(this),
        loans[loanId].borrower,
        loans[loanId].nftAddressArray,
        loans[loanId].nftTokenIdArray);
    }

    emit itemsWithdrawn(loanId, msg.sender, Status.LIQUIDATED);

  }



  // The borrower can ask for a loan extension from the website , no blockchain operation required
  // Lender can extend loan
  function extendLoan(uint256 loanId, uint256 nrOfInstallments) external {
    require(nrOfInstallments > 0, "You need to extend by at least 1 installment");
    require(loans[loanId].lender == msg.sender, "You're not the lender of this loan");
    require(loans[loanId].status == Status.APPROVED, "Incorrect state of loan");
    require(loans[loanId].loanEnd >= now, "Loan validity expired");
    
    // Extend the loan finish date
    loans[loanId].loanEnd = loans[loanId].loanEnd.add(installmentFrequency.mul(1 days).mul(nrOfInstallments));
    loans[loanId].nrOfInstallments = loans[loanId].nrOfInstallments.add(nrOfInstallments);

    emit loanExtended(loanId, now, loans[loanId].loanEnd, loans[loanId].nrOfInstallments);
  }



  

  // Internal Functions 

  // Calculates loan to value ratio
  function _percent(uint256 numerator, uint256 denominator, uint256 precision) internal pure returns(uint256) {
    // (((numerator * 10 ** (precision + 1)) / denominator) + 5) / 10;
    return numerator.mul(10 ** (precision + 1)).div(denominator).add(5).div(10);
  }

  // Transfer items fron an account to another
  // Requires approvement
  function _transferItems(
    address from, 
    address to, 
    address[] memory nftAddressArray, 
    uint256[] memory nftTokenIdArray
  ) internal {
    uint256 length = nftAddressArray.length;
    require(length == nftTokenIdArray.length, "Token infos provided are invalid");
    for(uint256 i = 0; i < length; ++i) 
      IERC721(nftAddressArray[i]).safeTransferFrom(
        from,
        to,
        nftTokenIdArray[i]
      );
  }



  // Getters & Setters

  function getLoanStatus (uint256 loanId) external view returns(Status) {
    return loans[loanId].status;
  }

  // TODO validate input
  function setLtv(uint256 newLtv) external onlyOwner {
    ltv = newLtv;
    emit ltvChanged(newLtv);
  }

  // TODO validate input
  function setInterestRateToCompany(uint256 newInterestRateToCompany) external onlyOwner {
    interestRateToCompany = newInterestRateToCompany;
    emit interestRateToCompanyChanged(newInterestRateToCompany);
  }

  // TODO validate input
  function setInterestRateToLender(uint256 newInterestRateToLender) external onlyOwner {
    interestRateToLender = newInterestRateToLender;
    emit interestRateToLenderChanged(newInterestRateToLender);
  }

  function setLoanFee(uint256 newLoanFee) external onlyOwner {
    require(loanFee >= 0 && loanFee < 100, "Loan fee out of bounds");
    loanFee = newLoanFee;
  }

}