const LendingData = artifacts.require("LendingData");
const GameItems721 = artifacts.require("GameItems721");
const GameItems1155 = artifacts.require("GameItems1155");

// Not used for the moment
// const FungibleTokens = artifacts.require("FungibleTokens");

contract('LendingData', (accounts) => {

  // createLoan(uint256, uint256, address, uint256, address[] calldata, uint256[] calldata, string calldata)
  it('Should create a loan', async () => {
    const instance = await LendingData.deployed();
    const tokenInstance = await GameItems721.deployed();
    let loanAmount = Math.floor(Math.random() * 100000000) + 1;
    let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
    let currency = "0x0000000000000000000000000000000000000000";
    let min = Math.ceil(loanAmount);
    let max = Math.floor(loanAmount * 160 / 100);
    let assetsValue = loanAmount + Math.floor(Math.random() * (max - min + 1)) + min;
    let creationId = "db_index";
    let nrOfTokensToAdd = Math.floor(Math.random() * 20);
    let nftAddressArray = new Array(nrOfTokensToAdd).fill(tokenInstance.address);
    let nftTokenIdArray = [];
    for (let i = 0, l = nrOfTokensToAdd; i < l; ++i) {
      let createToken = await tokenInstance.createItem("name", "description", "image", {
        from: accounts[0]
      });
      for (let j = 0, k = createToken.logs.length; j < k; ++j)
        if (createToken.logs[j].event === "Transfer") {
          let tokenId = Number(createToken.logs[j].args[2]);
          let approveTokenToContract = await tokenInstance.approve(instance.address, tokenId, {
            from: accounts[0]
          });
          assert.typeOf(approveTokenToContract.receipt, 'object', "[ERROR] :: Approve token for contract failed.");
          nftTokenIdArray.push(tokenId);
        }
      assert.typeOf(createToken.receipt, 'object', "[ERROR] :: Create token failed.");
    }
    assert.lengthOf(nftTokenIdArray, nftAddressArray.length, "[ERROR] :: Some items haven't been approved.");
    let createLoan = await instance.createLoan(loanAmount, nrOfInstallments, currency, assetsValue, nftAddressArray, nftTokenIdArray, creationId, {
      from: accounts[0]
    });
    assert.typeOf(createLoan.receipt, 'object', "[ERROR] :: Create loan failed.");
  });

  // getLoansCount()
  it('Should get the loans count', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    assert.typeOf(loansCount, 'number', "[BUGGED] :: Not possible to receive the total loans count.");
  });

  // toPayForApprove(uint256)
  it('Should get the loan required qty of tokens for approval', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let toPayForApprove = await instance.toPayForApprove.call(Math.floor(Math.random() * loansCount));
    toPayForApprove = web3.utils.hexToNumber(web3.utils.toHex(toPayForApprove));
    assert.typeOf(toPayForApprove, 'number', "[BUGGED] :: Not possible to receive the required qty of tokens to pay for a loan.");
  });

  // getCurrency(uint256)
  it('Should get the loan currency', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let currency = await instance.getCurrency.call(Math.floor(Math.random() * loansCount));
    assert.typeOf(currency, 'string', "[BUGGED] :: Not possible to receive the loan currency.");
    expect(currency).to.have.lengthOf(42, "[BUGGED] :: Not a valid ethereum address");
  });

  // getNrOfPayments(uint256)
  it('Should get the loan number of payments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let numberOfPayments = await instance.getNrOfPayments.call(Math.floor(Math.random() * loansCount));
    numberOfPayments = web3.utils.hexToNumber(web3.utils.toHex(numberOfPayments));
    assert.typeOf(numberOfPayments, 'number', "[BUGGED] :: Not possible to receive the loan number of payments.");
  });

  // getLoanStatus(uint256)
  it('Should get the loan status', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loanStatus = await instance.getLoanStatus.call(Math.floor(Math.random() * loansCount));
    loanStatus = web3.utils.hexToNumber(web3.utils.toHex(loanStatus));
    assert.typeOf(loanStatus, 'number', "[BUGGED] :: Not possible to get the loan status.");
  });

  // getLoanApproveTotalPayment(uint256)
  it('Should get the loan total qty of tokens required to pay for approval', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loanApproveTotalPayment = await instance.getLoanApproveTotalPayment.call(Math.floor(Math.random() * loansCount));
    loanApproveTotalPayment = web3.utils.hexToNumber(web3.utils.toHex(loanApproveTotalPayment));
    assert.typeOf(loanApproveTotalPayment, 'number', "[BUGGED] :: Not possible to get the loan total qty of tokens required to pay for approval.");
  });

  // getInstallmentAmount(uint256)
  it('Should get the loan installment amount', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let installmentAmount = await instance.getInstallmentAmount.call(Math.floor(Math.random() * loansCount));
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    assert.typeOf(installmentAmount, 'number', "[BUGGED] :: Not possible to get the loan installment amount.");
  });

  // getNrOfInstallments(uint256)
  it('Should get the loan number of installments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let nrOfInstallments = await instance.getNrOfInstallments.call(Math.floor(Math.random() * loansCount));
    nrOfInstallments = web3.utils.hexToNumber(web3.utils.toHex(nrOfInstallments));
    assert.typeOf(nrOfInstallments, 'number', "[BUGGED] :: Not possible to get the loan number of installments.");
  });

  // approveLoan(uint256)
  it('Should find a lender for loan', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let toPayForApprove = await instance.toPayForApprove.call(loansCount - 1);
    toPayForApprove = web3.utils.hexToNumber(web3.utils.toHex(toPayForApprove));
    const approveLoan = await instance.approveLoan(loansCount - 1, {
      from: accounts[1],
      value: toPayForApprove
    });
    assert.typeOf(approveLoan.receipt, 'object', "[BUGGED] :: Not possible to find a lender for loan.");
  });

  // getLoanAmount(uint256)
  it('Should get the loan amount', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loanAmount = await instance.getLoanAmount.call(Math.floor(Math.random() * loansCount));
    loanAmount = web3.utils.hexToNumber(web3.utils.toHex(loanAmount));
    assert.typeOf(loanAmount, 'number', "[BUGGED] :: Not possible to get the loan amount.");
  });

  // getAssetsValue(uint256)
  it('Should get the loan assets value', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let assetsValue = await instance.getAssetsValue.call(Math.floor(Math.random() * loansCount));
    assetsValue = web3.utils.hexToNumber(web3.utils.toHex(assetsValue));
    assert.typeOf(assetsValue, 'number', "[BUGGED] :: Not possible to get the loan assets value.");
  });

  // getLoanStart(uint256)
  it('Should get the loan start date', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loanStartDate = await instance.getLoanStart.call(Math.floor(Math.random() * loansCount));
    loanStartDate = web3.utils.hexToNumber(web3.utils.toHex(loanStartDate));
    assert.typeOf(loanStartDate, 'number', "[BUGGED] :: Not possible to get the loan start date.");
  });

  // getLoanEnd(uint256)
  it('Should get the loan start date', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loanEndDate = await instance.getLoanEnd.call(Math.floor(Math.random() * loansCount));
    loanEndDate = web3.utils.hexToNumber(web3.utils.toHex(loanEndDate));
    assert.typeOf(loanEndDate, 'number', "[BUGGED] :: Not possible to get the loan end date.");
  });

  // getAmountDue(uint256)
  it('Should get the loan amount due', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let amountDue = await instance.getAmountDue.call(Math.floor(Math.random() * loansCount));
    amountDue = web3.utils.hexToNumber(web3.utils.toHex(amountDue));
    assert.typeOf(amountDue, 'number', "[BUGGED] :: Not possible to get the loan amount due.");
  });

  // getPaidAmount(uint256)
  it('Should get the loan paid amount', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let paidAmount = await instance.getPaidAmount.call(Math.floor(Math.random() * loansCount));
    paidAmount = web3.utils.hexToNumber(web3.utils.toHex(paidAmount));
    assert.typeOf(paidAmount, 'number', "[BUGGED] :: Not possible to get the loan paid amount.");
  });

  // getDefaultingLimit(uint256)
  it('Should get the loan defaulting limit', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let defaultingLimit = await instance.getDefaultingLimit.call(Math.floor(Math.random() * loansCount));
    defaultingLimit = web3.utils.hexToNumber(web3.utils.toHex(defaultingLimit));
    assert.typeOf(defaultingLimit, 'number', "[BUGGED] :: Not possible to get the loan defaulting limit.");
  });

  // getBorrower(uint256)
  it('Should get the loan borrower', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let borrower = await instance.getBorrower.call(Math.floor(Math.random() * loansCount));
    expect(borrower).to.have.lengthOf(42, "[BUGGED] :: Not a valid ethereum address");
  });

  // getLender(uint256)
  it('Should get the loan lender', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let lender = await instance.getLender.call(Math.floor(Math.random() * loansCount));
    expect(lender).to.have.lengthOf(42, "[BUGGED] :: Not a valid ethereum address");
  });

  // getLoanById(uint256)
  it('Should get the loan by loanId', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loan = await instance.getLoanById.call(Math.floor(Math.random() * loansCount));
    assert.typeOf(loan, 'object', "[BUGGED] :: Not possible to get the loan by loanId.");
  });

  // lackOfPayment(uint256)
  it('Should get the loan lack of payment status', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let loan = await instance.lackOfPayment.call(Math.floor(Math.random() * loansCount));
    assert.typeOf(loan, 'boolean', "[BUGGED] :: Not possible to get the loan lack of payment status.");
  });

  // setLtv(uint256)
  it('Should set the global ltv', async () => {
    const instance = await LendingData.deployed();
    const ltv = await instance.setLtv(600, {
      from: accounts[0]
    });
    assert.typeOf(ltv.receipt, 'object', "[BUGGED] :: Not possible to set the global LTV.");
  });

  // getNftAddressArray(uint256)
  it('Should get the loan NFT address array', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let addressArray = await instance.getNftAddressArray.call(Math.floor(Math.random() * loansCount));
    for (let i = 0, l = addressArray.length; i < l; ++i)
      expect(addressArray[i]).to.have.lengthOf(42, "[BUGGED] :: Not a valid ethereum address");
  });

  // getNftTokenIdArray(uint256)
  it('Should get the loan NFT IDs array', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let nftTokenIdArray = await instance.getNftTokenIdArray.call(Math.floor(Math.random() * loansCount));
    for (let i = 0, l = nftTokenIdArray.length; i < l; ++i)
      assert.equal(isNaN(Number(nftTokenIdArray[i])), false, "Invalid NFT ID");
  });

  // payLoan(uint256)
  it('Should pay for loan, 1x installment', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let installmentAmount = await instance.getInstallmentAmount.call(loansCount - 1);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    const payLoan = await instance.payLoan(loansCount - 1, {
      from: accounts[0],
      value: installmentAmount
    });
    assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
  });

  // payLoan(uint256)
  it('Should pay for loan, half of the installments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let installmentAmount = await instance.getInstallmentAmount.call(loansCount - 1);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    let nrOfInstallments = await instance.getNrOfInstallments.call(Math.floor(Math.random() * loansCount));
    nrOfInstallments = web3.utils.hexToNumber(web3.utils.toHex(nrOfInstallments));
    for (let i = 0, l = nrOfInstallments / 2; i < l; ++i) {
      const payLoan = await instance.payLoan(loansCount - 1, {
        from: accounts[0],
        value: installmentAmount
      });
      assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
    }
  });

  // payLoan(uint256)
  it('Should pay for loan, all installments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    let installmentAmount = await instance.getInstallmentAmount.call(loansCount - 1);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    let nrOfInstallments = await instance.getNrOfInstallments.call(Math.floor(Math.random() * loansCount));
    nrOfInstallments = web3.utils.hexToNumber(web3.utils.toHex(nrOfInstallments));
    for (let i = 0, l = nrOfInstallments; i < l; ++i) {
      let numberOfPayments = await instance.getNrOfPayments.call(Math.floor(Math.random() * loansCount));
      numberOfPayments = web3.utils.hexToNumber(web3.utils.toHex(numberOfPayments));
      if (numberOfPayments < nrOfInstallments) {
        const payLoan = await instance.payLoan(loansCount - 1, {
          from: accounts[0],
          value: installmentAmount
        });
        assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
      }
    }
  });

  // withdrawItems(uint256)
  /*
    it('Should withdraw the loan items, after all payments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    const withdrawItems = await instance.withdrawItems(loansCount-1,{ from : accounts[0] });
      assert.typeOf(withdrawItems.receipt, 'object', "[BUGGED] :: Not possible to withdraw items from loan.");
    });
  */

  // terminateLoan(uint256)
  /*
    it('Should terminate the loan if lack of installments', async () => {
    const instance = await LendingData.deployed();
    let loansCount = await instance.getLoansCount.call();
    loansCount = web3.utils.hexToNumber(web3.utils.toHex(loansCount));
    const loanTermination = await instance.terminateLoan(loansCount-1,{ from : accounts[0] });
      assert.typeOf(loanTermination.receipt, 'object', "[BUGGED] :: Not possible to terminate the loan.");
    });
  */

});