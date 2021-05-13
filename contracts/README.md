# Documentation

<br />
<br />
<br />

## 1. Loan status

<br />

#### Status LISTED :

##### The loan has been created
##### SHOULD BE : listed on the website
##### Waiting for a lender ( / approvement )
##### Can be cancelled

<br />

### Status APPROVED :

#### The loan has been chosen by a lender
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore

<br />

### Status LIQUIDATED :

#### The loan has a lender
#### The loan has finished handling the temporarily payments
#### Its status SHOULD BE changed on the website
#### No longer waiting for a lender ( / approvement )
#### Can't be cancelled anymore
#### Available for items withdraw by Borrower
#### Loan is finished

<br />

### Status DEFAULTED :

#### The loan has been cancelled
#### Its status SHOULD BE changed on the website
#### No longer available for a lender ( / approvement )
#### Available for items withdraw by Lender
#### Can't be cancelled anymore

<br />
<br />
<br />

## 2. Smart Contracts deploy

<br />

#### Stater Loans :

##### Deploy the core/LendingSetters.sol

##### Deploy the core/LendingCore.sol and use the LendingSetters smart contract address in its constructor

<br />

#### Promissory note :

##### To be added

<br />

#### Stater Pooling :

##### In progress

<br />
<br />
<br />

## 3. Back-end configuration

<br />

#### Truffle tests :

##### `truffle develop`
##### `test` ( from the repo root )
##### ( Optional ) For using a custom network check the truffle-config.js