const LendingData = artifacts.require("LendingData");
const FungibleTokens = artifacts.require("FungibleTokens");
const GameItems721 = artifacts.require("GameItems721");
const GameItems1155 = artifacts.require("GameItems1155");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const TokenGeyser = artifacts.require("TokenGeyser");
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





contract('LendingData', async (accounts) => {


  // addGeyserAddress(address)
  it('Should add a geyser address', async () => {
    const instance = await LendingData.deployed();
    const geyser = await TokenGeyser.deployed();
    let addGeyserAddress = await instance.addGeyserAddress(geyser.address,{ from: accounts[0] });
    assert.typeOf(addGeyserAddress, 'object', "[BUGGED] :: Not possible to add geyser addresses.");
  });


  // addNftTokenId(uint256)
  it('Should add a nft token id', async () => {
    const instance = await LendingData.deployed(); 
    let addNftTokenId = await instance.addNftTokenId(tokenIdToAdd,{ from: accounts[0] });
    assert.typeOf(addNftTokenId, 'object', "[BUGGED] :: Not possible to add nft token ids.");
  });


  // nftAddress
  it('Should get the nft address used by lending contract', async () => {
    const instance = await LendingData.deployed(); 
    const nftAddress = await instance.nftAddress.call();
    //console.log("THE NFT ADDRESS IS >> " + nftAddress);
    assert.notEqual(nftAddress, "0x0000000000000000000000000000000000000000", "[WARNING] :: No NFT address used by Lending Contract.");
  });


  // geyserAddressArray
  it('Should get the geyser address array', async () => {
    const instance = await LendingData.deployed(); 
    const geyserAddressArray = await instance.geyserAddressArray.call(0);
    //console.log("THE GEYSER ADDRESSES IS >> " + geyserAddressArray);
    assert.typeOf(geyserAddressArray, 'string', "[BUGGED] :: Geyser address is not a valid address");
    assert.notEqual(geyserAddressArray, "0x0000000000000000000000000000000000000000", "[WARNING] :: One of the geyser addresses used by Lending Contract is not a valid address.");
  });


  // staterNftTokenIdArray
  it('Should get the nft token id array', async () => {
    const instance = await LendingData.deployed(); 
    let staterNftTokenIdArray = await instance.staterNftTokenIdArray.call(0);
    staterNftTokenIdArray = web3.utils.hexToNumber(web3.utils.toHex(staterNftTokenIdArray));
    //console.log("THE GEYSER ADDRESSES IS >> " + staterNftTokenIdArray);
    assert.isNotNaN(Number(staterNftTokenIdArray), "[WARNING] :: One of the nft token ids used by Lending Contract is not a id.");
  });


  // setGlobalVariables(uint256,uint256,uint256)
  it('Should set the lending contract global variables', async () => {
    const instance = await LendingData.deployed(); 
    let setGlobalVariables = await instance.setGlobalVariables(ltv,installmentFrequency,interestRate,interestRateToStater,{ from: accounts[0] });
    assert.typeOf(setGlobalVariables, 'object', "[BUGGED] :: Not possible to set the loan global variables.");
  });


  // balanceOfBatch(address[],uint256[])
  it('Should get the balance of a batch ( ERC1155 )', async () => {
    const instanceGameItems1155 = await GameItems1155.deployed();
    const balanceOfBatch = await instanceGameItems1155.balanceOfBatch.call([accounts[0],accounts[0]],[0,1]);
    //console.log("The balance of batch : " + JSON.stringify(balanceOfBatch));
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
    //console.group("Get loan approval cost for : " + createdLoanId);
    let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId,{ from : accounts[1] });
    getLoanApprovalCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanApprovalCost));
    console.log("The loan approval cost should be >> " + getLoanApprovalCost);
    assert.typeOf(getLoanApprovalCost, 'number', "[BUGGED] :: Not possible to receive the required qty of tokens to pay for a loan.");
  });

  
  // getLoanInstallmentCost(uint256,uint256)
  it('Should get the loan total qty of tokens required to pay for approval', async () => {
    const instance = await LendingData.deployed();
    const getLoanInstallmentCost = await instance.getLoanInstallmentCost(createdLoanId,1,{ from : accounts[1] });
    const overallInstallmentCost = Number(getLoanInstallmentCost.overallInstallmentAmount);
    assert.typeOf(overallInstallmentCost, 'number', "[BUGGED] :: Not possible to get the loan total qty of tokens required to pay for approval.");
  });


  // loans(uint256)
  it('Should get the loan object', async () => {
    const instance = await LendingData.deployed();
    const loanObject = await instance.loans.call(createdLoanId);
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
    console.log("WATCH HERE >> " + loanObject.currency);
    if ( loanObject.currency !== "0x0000000000000000000000000000000000000000" ){
      let instanceFungibleTokens = await FungibleTokens.deployed();
      let transferFungibleTokensToParties = await instanceFungibleTokens.transfer(accounts[1],web3.utils.toHex(9000000000000000000),{
        from : accounts[0]
      });
      assert.typeOf(transferFungibleTokensToParties, 'object', "[ERROR] :: Cannot send fungible tokens to borrower.");
    }

    const approveLoan = await instance.approveLoan(createdLoanId, {
      from: accounts[1],
      value: getLoanApprovalCost * 2
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
    console.log("The installment amount is : " + JSON.stringify(installmentAmount));
    const payLoan = await instance.payLoan(createdLoanId, {
      from: accounts[0],
      value: installmentAmount.overallInstallmentAmount
    });
    console.log(">>>> " + typeof payLoan + " and " + JSON.stringify(payLoan));
    assert.typeOf(payLoan, 'object', "[BUGGED] :: Not possible to pay for loan.");
  });


  // payLoan(uint256)
  it('Should pay for loan, half of the installments', async () => {
    const instance = await LendingData.deployed();
    let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
    let loanObject = await instance.loans.call(createdLoanId);
    //console.log("The loan obj >> " + JSON.stringify(loanObject));
    let nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
    //console.log("To pay for " + nrOfInstallments + " installments");
    for (let i = 0, l = nrOfInstallments / 2; i < l; ++i) {
      const payLoan = await instance.payLoan(createdLoanId, {
        from: accounts[0],
        value: installmentAmount.overallInstallmentAmount
      });
      //console.log("Now we check for the " + i + "x installment");
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
    const lackOfPayment = await instance.lackOfPayment(createdLoanId);
    //console.log("The lack of payment is : " + lackOfPayment);
    assert.typeOf(lackOfPayment, 'boolean', "[BUGGED] :: Not possible to get the lack of payment loan status.");
    if ( lackOfPayment ){
      const loanTermination = await instance.terminateLoan(createdLoanId,{ from : accounts[0] });
      assert.typeOf(loanTermination.receipt, 'object', "[BUGGED] :: Not possible to terminate the loan.");
    }
  });


});