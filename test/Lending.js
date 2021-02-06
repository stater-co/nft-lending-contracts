const LendingData = artifacts.require("LendingData");
const FungibleTokens = artifacts.require("FungibleTokens");
const StakingToken = artifacts.require("FungibleTokens");
const DistributionToken = artifacts.require("FungibleTokens");
const GameItems721 = artifacts.require("GameItems721");
const GameItems1155 = artifacts.require("GameItems1155");
let currencyUsed;
let tokenCommunity = 0 , tokenFounder = 0 , tokenSttr = 0;
let ltv = 600;
let communityTokenId = 0;
let founderTokenId = 1;
let installmentFrequency = 7;
let interestRate = 20;
let interestRateToStater = 40;
let createdLoanId;

// Not used for the moment
// const FungibleTokens = artifacts.require("FungibleTokens");

contract('LendingData', (accounts) => {

  // setNftAddress(address)
  it('Should set the nft token address', async () => {
    const instance = await LendingData.deployed();
    const instanceGameItems1155 = await GameItems1155.deployed();
    let setNftAddress = await instance.setNftAddress.call(instanceGameItems1155.address);
    assert.typeOf(setNftAddress, 'object', "[BUGGED] :: Not possible to set the loan NFT token address.");
  });

  // setGeyser(address)
  it('Should set the nft geyser', async () => {
    const instance = await LendingData.deployed();
    let setGeyser = await instance.setGeyser.call("0xf1007ACC8F0229fCcFA566522FC83172602ab7e3");
    assert.typeOf(setGeyser, 'object', "[BUGGED] :: Not possible to set the loan geyser.");
  });

  // setGlobalVariables(uint256,uint256,uint256)
  it('Should set the lending contract global variables', async () => {
    const instance = await LendingData.deployed();
    let setGlobalVariables = await instance.setGlobalVariables.call(ltv,communityTokenId,founderTokenId,installmentFrequency,interestRate,interestRateToStater);
    assert.typeOf(setGlobalVariables, 'object', "[BUGGED] :: Not possible to set the loan global variables.");
  });

  // balanceOfBatch(address[],uint256[])
  it('Should get the balance of a batch ( ERC1155 )', async () => {
    const instanceGameItems1155 = await GameItems1155.deployed();
    let balanceOfBatch = await instanceGameItems1155.balanceOfBatch.call([accounts[0],accounts[0]],[0,1]);
    //console.log("The batch balance is : " + JSON.stringify(balanceOfBatch));
    for ( let i = 0 , l = balanceOfBatch.length ; i < l ; ++i )
      assert.typeOf(Number(balanceOfBatch[i]), 'number', "[BUGGED] :: Not possible to get the balance of batch.");
  });

  // createLoan(uint256, uint256, address, uint256, address[] calldata, uint256[] calldata, string calldata)
  it('Should create a loan', async () => {

    const instance = await LendingData.deployed();
    const instanceGameItems721 = await GameItems721.deployed();
    const instanceGameItems1155 = await GameItems1155.deployed();
    const instanceFungibleTokens = await FungibleTokens.deployed();

    let setNftAddress = await instance.setNftAddress.call(instanceGameItems1155.address);
    assert.typeOf(setNftAddress, 'object', "[BUGGED] :: Not possible to set the Loan interfaces.");

    let loanAmount = Math.floor(Math.random() * 100000000) + 1;
    let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
    let currency = Math.floor(Math.random() * 2) === 0 ? "0x0000000000000000000000000000000000000000" : instanceFungibleTokens.address;
    currencyUsed = currency;
    let min = Math.ceil(loanAmount);
    let max = Math.floor(loanAmount * 160 / 100);
    let assetsValue = loanAmount + Math.floor(Math.random() * (max - min + 1)) + min;
    let creationId = "db_index";
    let nrOfTokensToAdd = Math.floor(Math.random() * 20);
    let nftAddressArray = [];
    let nftTokenIdArray = [];
    let nftTokenTypeArray = [];
    let tokenId = null;



    for (let i = 0, l = nrOfTokensToAdd; i < l; ++i) 

      // ERC721
      if ( Math.floor(Math.random() * 2) === 0 ){


        let createToken = await instanceGameItems721.createItem("name", "description", "image", {
          from: accounts[0]
        });

        for (let j = 0, k = createToken.logs.length; j < k; ++j)
          if (createToken.logs[j].event === "Transfer") {
            tokenId = Number(createToken.logs[j].args[2]);

            let approveTokenToContract = await instanceGameItems721.approve(instance.address, tokenId, {
              from: accounts[0]
            });
            assert.typeOf(approveTokenToContract.receipt, 'object', "[ERROR] :: Approve token for contract failed.");
            nftTokenIdArray.push(tokenId);
            nftAddressArray.push(instanceGameItems721.address);
            nftTokenTypeArray.push(0);

          }

        assert.typeOf(createToken.receipt, 'object', "[ERROR] :: Create token failed.");


        // ERC1155
      }else{


        let erc1155TokenId = Math.floor(Math.random() * 2);
        let createToken = await instanceGameItems1155.createTokens(accounts[0], erc1155TokenId, 100, '0x00', "name", "description", "image_url", {
          from: accounts[0]
        });

        for (let j = 0, k = createToken.logs.length; j < k; ++j){

          if (createToken.logs[j].event === "ItemCreation" )
            tokenId = Number(createToken.logs[j].args.tokenId);

          if (createToken.logs[j].event === "TransferSingle") {

            let approveTokenToContract = await instanceGameItems1155.setApprovalForAll(instance.address, true, {
              from: accounts[0]
            });

            assert.typeOf(approveTokenToContract.receipt, 'object', "[ERROR] :: Approve token for contract failed.");

              nftTokenIdArray.push(tokenId);
              nftAddressArray.push(instanceGameItems1155.address);
              nftTokenTypeArray.push(1);

          }
        }
        assert.typeOf(createToken.receipt, 'object', "[ERROR] :: Create token failed.");


      }

    assert.lengthOf(nftTokenIdArray, nftAddressArray.length, "[ERROR] :: Some items haven't been approved.");

    let createLoan = await instance.createLoan(loanAmount, nrOfInstallments, currency, assetsValue, nftAddressArray, nftTokenIdArray, creationId, nftTokenTypeArray, {
      from: accounts[0]
    });
    for (let j = 0, k = createLoan.logs.length; j < k; ++j)
      createdLoanId = createLoan.logs[j].args.loanId;
    assert.typeOf(createLoan.receipt, 'object', "[ERROR] :: Create loan failed.");
  });

  // getLoanApprovalCost(uint256)
  it('Should get the loan required qty of tokens for approval', async () => {
    const instance = await LendingData.deployed();
    console.log("Approval cost is getLoanApprovalCost( " + createdLoanId + " )");
    let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId);
    console.log("Approval cost is >> " + JSON.stringify(getLoanApprovalCost));
    getLoanApprovalCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanApprovalCost));
    assert.typeOf(getLoanApprovalCost, 'number', "[BUGGED] :: Not possible to receive the required qty of tokens to pay for a loan.");
  });

  // getLoanInstallmentCost(uint256,uint256)
  it('Should get the loan total qty of tokens required to pay for approval', async () => {
    const instance = await LendingData.deployed();
    let getLoanInstallmentCost = await instance.getLoanInstallmentCost.call(createdLoanId,1);
    getLoanInstallmentCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanInstallmentCost));
    assert.typeOf(getLoanInstallmentCost, 'number', "[BUGGED] :: Not possible to get the loan total qty of tokens required to pay for approval.");
  });

  // approveLoan(uint256)
  it('Should find a lender for loan', async () => {
    const instance = await LendingData.deployed();
    let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId);
    getLoanApprovalCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanApprovalCost));
    const approveLoan = await instance.approveLoan(loansCount - 1, {
      from: accounts[1],
      value: getLoanApprovalCost
    });
    assert.typeOf(approveLoan.receipt, 'object', "[BUGGED] :: Not possible to find a lender for loan.");
  });

  // lackOfPayment(uint256)
  it('Should get the loan lack of payment status', async () => {
    const instance = await LendingData.deployed();
    let loan = await instance.lackOfPayment.call(createdLoanId);
    assert.typeOf(loan, 'boolean', "[BUGGED] :: Not possible to get the loan lack of payment status.");
  });

  // payLoan(uint256)
  it('Should pay for loan, 1x installment', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getInstallmentAmount.call(createdLoanId);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    const payLoan = await instance.payLoan(createdLoanId, {
      from: accounts[0],
      value: installmentAmount
    });
    assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
  });

  // payLoan(uint256)
  it('Should pay for loan, half of the installments', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getInstallmentAmount.call(createdLoanId);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    let nrOfInstallments = await instance.getNrOfInstallments.call(Math.floor(Math.random() * loansCount));
    nrOfInstallments = web3.utils.hexToNumber(web3.utils.toHex(nrOfInstallments));
    for (let i = 0, l = nrOfInstallments / 2; i < l; ++i) {
      const payLoan = await instance.payLoan(createdLoanId, {
        from: accounts[0],
        value: installmentAmount
      });
      assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
    }
  });

  // payLoan(uint256)
  it('Should pay for loan, all installments', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getInstallmentAmount.call(createdLoanId);
    installmentAmount = web3.utils.hexToNumber(web3.utils.toHex(installmentAmount));
    let nrOfInstallments = await instance.getNrOfInstallments.call(Math.floor(Math.random() * loansCount));
    nrOfInstallments = web3.utils.hexToNumber(web3.utils.toHex(nrOfInstallments));
    for (let i = 0, l = nrOfInstallments; i < l; ++i) {
      let numberOfPayments = await instance.getNrOfPayments.call(Math.floor(Math.random() * loansCount));
      numberOfPayments = web3.utils.hexToNumber(web3.utils.toHex(numberOfPayments));
      if (numberOfPayments < nrOfInstallments) {
        const payLoan = await instance.payLoan(createdLoanId, {
          from: accounts[0],
          value: installmentAmount
        });
        assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
      }
    }
  });

  // withdrawItems(uint256)
  it('Should withdraw the loan items, after all payments', async () => {
    const instance = await LendingData.deployed();
    const withdrawItems = await instance.withdrawItems(createdLoanId,{ from : accounts[0] });
    assert.typeOf(withdrawItems.receipt, 'object', "[BUGGED] :: Not possible to withdraw items from loan.");
  });

  // terminateLoan(uint256)
  it('Should terminate the loan if lack of installments', async () => {
    const instance = await LendingData.deployed();
    const loanTermination = await instance.terminateLoan(createdLoanId,{ from : accounts[0] });
    assert.typeOf(loanTermination.receipt, 'object', "[BUGGED] :: Not possible to terminate the loan.");
  });

});