## Loans.sol 
### Debugged ✓
### Errors : 0
### Warnings : 0
### Debugging date : 15.11.2020

# Documentation

## 1. Loan status



### Status = 10 :

#### The loan has been created
#### SHOULD BE : listed on the website
#### Waiting for a lender ( / approvement )
#### Can be cancelled



### Status 11 :

#### The loan has been chosen by a lender
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore



### Status 199 :

#### The loan has a lender
#### The loan is now handling payments ( temporarily )
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore
#### Waiting for items withdraw



### Status 200 :

#### The loan has a lender
#### The loan has finished handling the temporarily payments
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore
#### No longer available for items withdraw
#### Loan is finished



### Status 404 :

#### The loan has been cancelled
#### Its status SHOULD BE changed on the website
#### No longer available for a lender ( / approvement )
#### Can't be cancelled anymore