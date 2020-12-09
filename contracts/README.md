## Loans.sol 
### Debugged ✓
### Errors : 0
### Warnings : 0
### Debugging date : 15.11.2020

# Documentation

## 1. Loan status



### Status LISTED :

#### The loan has been created
#### SHOULD BE : listed on the website
#### Waiting for a lender ( / approvement )
#### Can be cancelled



### Status APPROVED :

#### The loan has been chosen by a lender
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore



### Status LIQUIDATED :

#### The loan has a lender
#### The loan has finished handling the temporarily payments
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore
#### Available for items withdraw by Borrower
#### Loan is finished



### Status DEFAULTED :

#### The loan has been cancelled
#### Its status SHOULD BE changed on the website
#### No longer available for a lender ( / approvement )
#### Available for items withdraw by Lender
#### Can't be cancelled anymore