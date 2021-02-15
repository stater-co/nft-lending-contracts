const LendingData = artifacts.require("LendingData");
const FungibleTokens = artifacts.require("FungibleTokens");
const GameItems721 = artifacts.require("GameItems721");
const GameItems1155 = artifacts.require("GameItems1155");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
let currencyUsed;
let tokenCommunity = 0 , tokenFounder = 0 , tokenSttr = 0;
let ltv = 600;
let communityTokenId = 0;
let founderTokenId = 1;
let installmentFrequency = 7;
let installmentTimeScale = 5;
let interestRate = 20;
let interestRateToStater = 40;
let createdLoanId;
let tokenIdToAdd = 3;


contract('LendingData', (accounts) => {

  // addGeyserAddress(address)
  it('Should add a geyser address', () => {
    LendingData.deployed().then( async (instance) => {
      console.log("We're ok here !!");
      let addGeyserAddress = await instance.addGeyserAddress(instance.address,{ from: accounts[0] });
      console.log("We're ok here !!!");
      assert.typeOf(addGeyserAddress, 'object', "[BUGGED] :: Not possible to add geyser addresses.");
    });
  });

  // addNftTokenId(uint256)
  /*
  it('Should add a nft token id', () => {
    LendingData.deployed().then( async (instance) => {
      let addNftTokenId = await instance.addNftTokenId(tokenIdToAdd,{ from: accounts[0] });
      assert.typeOf(addNftTokenId, 'object', "[BUGGED] :: Not possible to add nft token ids.");
    });
  });

  // setGlobalVariables(uint256,uint256,uint256)
  it('Should set the lending contract global variables', () => {
    LendingData.deployed().then( async (instance) => {
      console.log("We call it here >> " + ltv,installmentFrequency,interestRate,interestRateToStater);
      let setGlobalVariables = await instance.setGlobalVariables(ltv,installmentFrequency,interestRate,interestRateToStater,{ from: accounts[0] });
      console.log("Global variables are >> " + JSON.stringify(setGlobalVariables));
      assert.typeOf(setGlobalVariables, 'object', "[BUGGED] :: Not possible to set the loan global variables.");
    });
  });
  */

});


//contract('LendingData', async (accounts) => {

  /*

  

  // balanceOfBatch(address[],uint256[])
  it('Should get the balance of a batch ( ERC1155 )', async () => {
    const instanceGameItems1155 = await GameItems1155.deployed();
    let balanceOfBatch = await instanceGameItems1155.balanceOfBatch.call([accounts[0],accounts[0]],[0,1]);
    console.log("The balance of batch : " + JSON.stringify(balanceOfBatch));
    for ( let i = 0 , l = balanceOfBatch.length ; i < l ; ++i )
      assert.typeOf(Number(balanceOfBatch[i]), 'number', "[BUGGED] :: Not possible to get the balance of batch.");
  });

  // createLoan(uint256, uint256, address, uint256, address[] calldata, uint256[] calldata, string calldata)
  it('Should create a loan', async () => {

    const instance = await LendingData.deployed();
    const instanceGameItems721 = await GameItems721.deployed();
    const instanceGameItems1155 = await GameItems1155.deployed();
    const instanceFungibleTokens = await FungibleTokens.deployed();

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

    let transferFungibleTokensToParties = await instanceFungibleTokens.transfer(accounts[1],assetsValue,{
      from : accounts[0]
    });
    assert.typeOf(transferFungibleTokensToParties, 'object', "[ERROR] :: Cannot send fungible tokens to borrower.");

    transferFungibleTokensToParties = await instanceFungibleTokens.transfer(accounts[1],assetsValue,{
      from : accounts[1]
    });
    assert.typeOf(transferFungibleTokensToParties, 'object', "[ERROR] :: Cannot send fungible tokens to lender.");

    console.log("Create loan with : " + loanAmount, nrOfInstallments, currency, assetsValue, nftAddressArray, nftTokenIdArray, creationId, nftTokenTypeArray);
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
    console.group("Get loan approval cost for : " + createdLoanId);
    let getLoanApprovalCost = await instance.getLoanApprovalCost(createdLoanId,{ from : accounts[1] });
    console.log("The loan approval cost should be >> " + JSON.stringify(getLoanApprovalCost));
    getLoanApprovalCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanApprovalCost));
    assert.typeOf(getLoanApprovalCost, 'number', "[BUGGED] :: Not possible to receive the required qty of tokens to pay for a loan.");
  });

  // getLoanInstallmentCost(uint256,uint256)
  it('Should get the loan total qty of tokens required to pay for approval', async () => {
    const instance = await LendingData.deployed();
    let getLoanInstallmentCost = await instance.getLoanInstallmentCost(createdLoanId,1,{ from : accounts[1] });
    let overallInstallmentCost = Number(getLoanInstallmentCost.overallInstallmentAmount);
    assert.typeOf(overallInstallmentCost, 'number', "[BUGGED] :: Not possible to get the loan total qty of tokens required to pay for approval.");
  });

  // loans(uint256)
  it('Should get the loan object', async () => {
    const instance = await LendingData.deployed();
    let loanObject = await instance.loans.call(createdLoanId);
    //console.log("The loan obj >> " + JSON.stringify(loanObject));
    assert.typeOf(loanObject, 'object', "[BUGGED] :: Not possible to get the loan object.");
  });

  // approveLoan(uint256)
  it('Should find a lender for loan', async () => {
    const instance = await LendingData.deployed();
    let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId,{ from : accounts[1] });
    console.log("To pay for approval >> " + getLoanApprovalCost + " , " + createdLoanId);
    let loanObject = await instance.loans.call(createdLoanId);
    console.log("The loan obj >> " + JSON.stringify(loanObject));
    const approveLoan = await instance.approveLoan(createdLoanId, {
      from: accounts[1],
      value: getLoanApprovalCost * 50
    });
    console.log("Approve loan is >> " + JSON.stringify(approveLoan));
    assert.typeOf(approveLoan.receipt, 'object', "[BUGGED] :: Not possible to find a lender for loan.");
  });

  // lackOfPayment(uint256
  it('Should get the loan lack of payment status', async () => {
    const instance = await LendingData.deployed();
    let loan = await instance.lackOfPayment.call(createdLoanId);
    assert.typeOf(loan, 'boolean', "[BUGGED] :: Not possible to get the loan lack of payment status.");
  });

  // payLoan(uint256)
  it('Should pay for loan, 1x installment', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
    installmentAmount = web3.utils.hexToNumber("0x" + installmentAmount.overallInstallmentAmount);
    const payLoan = await instance.payLoan(createdLoanId, {
      from: accounts[0],
      value: installmentAmount
    });
    //console.log(">>>> " + typeof payLoan);
    assert.typeOf(payLoan, 'object', "[BUGGED] :: Not possible to pay for loan.");
  });

  // payLoan(uint256)
  it('Should pay for loan, half of the installments', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
    let loanObject = await instance.loans.call(createdLoanId);
    console.log("The loan obj >> " + JSON.stringify(loanObject));
    let nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
    console.log("To pay for " + nrOfInstallments + " installments");
    for (let i = 0, l = nrOfInstallments / 2; i < l; ++i) {
      const payLoan = await instance.payLoan(createdLoanId, {
        from: accounts[0],
        value: installmentAmount.overallInstallmentAmount
      });
      console.log("Now we check for the " + i + "x installment");
      assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
    }
  });

  // payLoan(uint256)
  it('Should pay for loan, all installments', async () => {
    const instance = await LendingData.deployed();
    let loanObject = await instance.loans.call(createdLoanId);
    //console.log("The loan obj >> " + JSON.stringify(loanObject));
    let nrOfInstallments = web3.utils.hexToNumber("0x" + loanObject.nrOfInstallments) - web3.utils.hexToNumber("0x" + loanObject.nrOfPayments);
    //console.log("To pay for " + nrOfInstallments + " installments");
    let installmentAmount = web3.utils.hexToNumber("0x" + loanObject.installmentAmount);

    for (let i = 0, l = nrOfInstallments; i < l; ++i) {
        const payLoan = await instance.payLoan(createdLoanId, {
          from: accounts[0],
          value: installmentAmount
        });
        assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
    }
  });

  // terminateLoan(uint256)
  it('Should terminate the loan if lack of installments', async () => {
    const instance = await LendingData.deployed();
    const loanTermination = await instance.terminateLoan(createdLoanId,{ from : accounts[0] });
    assert.typeOf(loanTermination.receipt, 'object', "[BUGGED] :: Not possible to terminate the loan.");
  });
  */

//});