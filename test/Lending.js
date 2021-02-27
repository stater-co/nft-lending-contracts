const LendingData = artifacts.require("LendingData");
const FungibleTokens = artifacts.require("FungibleTokens");
const GameItems721 = artifacts.require("GameItems721");
const GameItems1155 = artifacts.require("GameItems1155");
const StakingTokens = artifacts.require("StakingTokens");
const DistributionTokens = artifacts.require("DistributionTokens");
const TokenGeyser = artifacts.require("TokenGeyser");



contract('GameItems1155', (accounts) => {

  describe("1 > Should check the NFT1155 getters", function () {

    // balanceOfBatch(address[],uint256[])
    it('Should get the balance of a batch ( ERC1155 )', async () => {
      const instanceGameItems1155 = await GameItems1155.deployed();
      const balanceOfBatch = await instanceGameItems1155.balanceOfBatch.call([accounts[0],accounts[0]],[0,1]);
      for ( let i = 0 , l = balanceOfBatch.length ; i < l ; ++i )
        assert.typeOf(Number(balanceOfBatch[i]), 'number', "[BUGGED] :: Not possible to get the balance of batch.");
    });

    // balanceOf(address,uint256)
    it('Should get the balance of a user in tokens', async () => {
      const instanceGameItems1155 = await GameItems1155.deployed();
      let balanceOf = await instanceGameItems1155.balanceOf.call(accounts[0],0);
      assert.isNotNaN(Number(balanceOf), "[WARNING] :: Balance getter doesn't work");
      balanceOf = await instanceGameItems1155.balanceOf.call(accounts[0],1);
      assert.isNotNaN(Number(balanceOf), "[WARNING] :: Balance getter doesn't work");
      balanceOf = await instanceGameItems1155.balanceOf.call(accounts[1],0);
      assert.isNotNaN(Number(balanceOf), "[WARNING] :: Balance getter doesn't work");
      balanceOf = await instanceGameItems1155.balanceOf.call(accounts[1],1);
      assert.isNotNaN(Number(balanceOf), "[WARNING] :: Balance getter doesn't work");
    });

  });

});



contract('TokenGeyser', (accounts) => {

  describe("2 > Should set the Token Geyser constructor parameters", async function () {

    it('Should set the Token Geyser constructor parameters', async () => {
      const instance = await TokenGeyser.deployed();
      const stakingToken = await StakingTokens.deployed();
      const distributionToken = await DistributionTokens.deployed();
      let setStakingToken = await instance.setStakingToken(stakingToken.address, { from: accounts[0] });
      assert.typeOf(setStakingToken, 'object', "[BUGGED] :: Not possible to set the staking token.");
      let setDistributionToken = await instance.setDistributionToken(distributionToken.address, { from: accounts[0] });
      assert.typeOf(setDistributionToken, 'object', "[BUGGED] :: Not possible to set the distribution token.");
    });

  });

  describe("3 > Should check the Token Geyser stake", async function () {

    it('Should check the token geyser stake', async () => {
      const instance = await TokenGeyser.deployed();
      let totalStakedFor = await instance.totalStakedFor.call(accounts[0]);
      assert.isNotNaN(Number(totalStakedFor), "[WARNING] :: Total staked for mechanism doesn't work");
      totalStakedFor = await instance.totalStakedFor.call(accounts[1]);
      assert.isNotNaN(Number(totalStakedFor), "[WARNING] :: Total staked for mechanism doesn't work");
    });

  });

});



contract('LendingData', async (accounts) => {

  let ltv = 600;
  let installmentFrequency = 1;
  let interestRate = 20;
  let interestRateToStater = 40;
  let createdLoanId;
  let tokenIdToAdd = 3;
  let timeStampWeeks = 3;

  describe("4 > Should set all Lending Contract global variables", function () {

    // addGeyserAddress(address)
    it('Should add a geyser address', async () => {
      const instance = await LendingData.deployed();
      const geyser = await TokenGeyser.deployed();
      let addGeyserAddress = await instance.addGeyserAddress(geyser.address, { from: accounts[0] });
      assert.typeOf(addGeyserAddress, 'object', "[BUGGED] :: Not possible to add geyser addresses.");
    });

    // addNftTokenId(uint256)
    it('Should add a nft token id', async () => {
      const instance = await LendingData.deployed(); 
      let addNftTokenId = await instance.addNftTokenId(tokenIdToAdd, { from: accounts[0] });
      assert.typeOf(addNftTokenId, 'object', "[BUGGED] :: Not possible to add nft token ids.");
    });

    // setGlobalVariables(uint256,uint256,uint256)
    it('Should set the lending contract global variables', async () => {
      const instance = await LendingData.deployed(); 
      let setGlobalVariables = await instance.setGlobalVariables(ltv,installmentFrequency,timeStampWeeks,interestRate,interestRateToStater,{ from: accounts[0] });
      assert.typeOf(setGlobalVariables, 'object', "[BUGGED] :: Not possible to set the loan global variables.");
    });

    // setNftAddress(address)
    it('Should set the nft address', async () => {
      const instance = await LendingData.deployed();
      const nft1155 = await GameItems1155.deployed(); 
      let setNftAddress = await instance.setNftAddress(nft1155.address,{ from: accounts[0] });
      assert.typeOf(setNftAddress, 'object', "[BUGGED] :: Not possible to set the loan global variables.");
    });
    
  });



  describe("5 > Should check the Lending Contract global variables", function () {

    // nftAddress
    it('Should get the nft address used by lending contract', async () => {
      const instance = await LendingData.deployed(); 
      const nftAddress = await instance.nftAddress.call();
      assert.notEqual(nftAddress, "0x0000000000000000000000000000000000000000", "[WARNING] :: No NFT address used by Lending Contract.");
    });

    // geyserAddressArray
    it('Should get the geyser address array', async () => {
      const instance = await LendingData.deployed(); 
      const geyserAddressArray = await instance.geyserAddressArray.call(0);
      assert.typeOf(geyserAddressArray, 'string', "[BUGGED] :: Geyser address is not a valid address");
      assert.notEqual(geyserAddressArray, "0x0000000000000000000000000000000000000000", "[WARNING] :: One of the geyser addresses used by Lending Contract is not a valid address.");
    });

    // staterNftTokenIdArray
    it('Should get the nft token id array', async () => {
      const instance = await LendingData.deployed(); 
      let staterNftTokenIdArray = await instance.staterNftTokenIdArray.call(0);
      staterNftTokenIdArray = web3.utils.hexToNumber(web3.utils.toHex(staterNftTokenIdArray));
      assert.isNotNaN(Number(staterNftTokenIdArray), "[WARNING] :: One of the nft token ids used by Lending Contract is not a id.");
    });
    
    // calculateDiscount(address)
    it('Should calculate the discount for both testing accounts', async () => {
      const instance = await LendingData.deployed(); 
      let calculateDiscount = await instance.calculateDiscount(accounts[0]);
      assert.isNotNaN(Number(calculateDiscount), "[WARNING] :: One of the nft token ids used by Lending Contract is not a id.");
      calculateDiscount = await instance.calculateDiscount(accounts[1]);
      assert.isNotNaN(Number(calculateDiscount), "[WARNING] :: One of the nft token ids used by Lending Contract is not a id.");
    });

  });

  let numberOfLoansToTest = Math.floor(Math.random() * 10) + 1;

  for ( let i = 0 ; i < numberOfLoansToTest ; ++i ){

    describe("6 > Loan creation [ Loan : " + i + " / " + numberOfLoansToTest + " ]", function () {

      // createLoan(uint256, uint256, address, uint256, address[] calldata, uint256[] calldata, string calldata)
      it('Should create a loan', async () => {

        const instance = await LendingData.deployed();
        const instanceGameItems721 = await GameItems721.deployed();
        const instanceGameItems1155 = await GameItems1155.deployed();
        const instanceFungibleTokens = await FungibleTokens.deployed();

        let loanAmount = Math.floor(Math.random() * 100000000) + 1;
        let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
        let currency = Math.floor(Math.random() * 2) === 0 ? "0x0000000000000000000000000000000000000000" : instanceFungibleTokens.address;
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
      it('Should find a lender for loan', async () => {
        const instance = await LendingData.deployed();
        let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId,{ from : accounts[1] });
        let loanObject = await instance.loans.call(createdLoanId);
        let txOptions = { from: accounts[1] };

        // If a custom currency is used for the loan
        if ( loanObject.currency !== "0x0000000000000000000000000000000000000000" ){
          let instanceFungibleTokens = await FungibleTokens.deployed();

          // Transfer the required tokens for approval from the owner of the fungible contract to accounts[1]
          let transferFungibleTokensToParties = await instanceFungibleTokens.transfer(accounts[1],getLoanApprovalCost,{
            from : accounts[0]
          });
          assert.typeOf(transferFungibleTokensToParties, 'object', "[ERROR] :: Cannot send fungible tokens to borrower.");
          
          // Approves them for Lending Contract
          let approveFungibleTokensToParties = await instanceFungibleTokens.approve(instance.address,getLoanApprovalCost,{
            from : accounts[1]
          });
  
          assert.typeOf(approveFungibleTokensToParties, 'object', "[ERROR] :: Cannot approve the sent fungible tokens.");
          
        }else{
          txOptions.value = getLoanApprovalCost;
        }
      
        const approveLoan = await instance.approveLoan(createdLoanId, txOptions);
        assert.typeOf(approveLoan.receipt, 'object', "[BUGGED] :: Not possible to find a lender for loan.");
      });

    });



    describe("7 > Should check the loan variables [ Loan : " + i + " / " + numberOfLoansToTest + " ]", function () {

      // getLoanApprovalCost(uint256)
      it('Should get the loan required qty of tokens for approval', async () => {
        const instance = await LendingData.deployed();
        let getLoanApprovalCost = await instance.getLoanApprovalCost.call(createdLoanId,{ from : accounts[1] });
        getLoanApprovalCost = web3.utils.hexToNumber(web3.utils.toHex(getLoanApprovalCost));
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
        assert.typeOf(loanObject, 'object', "[BUGGED] :: Not possible to get the loan object.");
      });

      // lackOfPayment(uint256)
      it('Should get the loan lack of payment status', async () => {
        const instance = await LendingData.deployed();
        let loanObject = await instance.loans.call(createdLoanId);
        if ( loanObject.lender !== "0x0000000000000000000000000000000000000000" ){
          let loan = await instance.lackOfPayment.call(createdLoanId);
          assert.typeOf(loan, 'boolean', "[BUGGED] :: Not possible to get the loan lack of payment status.");
        }
      });


      // payLoan(uint256)
      it('Should pay for loan, 1x installment', async () => {
        const instance = await LendingData.deployed();
        const instanceFungibleTokens = await FungibleTokens.deployed();
        let loanObject = await instance.loans.call(createdLoanId);
        let txOptions = { from: accounts[0] };
        let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
        installmentAmount = installmentAmount.overallInstallmentAmount;
        /*
        if ( ( web3.utils.hexToNumber(loanObject.installmentAmount) * 1.5 ) < web3.utils.hexToNumber(installmentAmount) )
          installmentAmount = web3.utils.hexToNumber("0x" + installmentAmount);
        */
        let regExp = /[a-zA-Z]/g;      
        if(regExp.test(installmentAmount))
          installmentAmount = web3.utils.hexToNumber(installmentAmount);

        assert.equal(web3.utils.hexToNumber(loanObject.nrOfPayments), 0, "[BUGGED] :: Loan should have no payment at this point.");

        console.log("We pay : " + installmentAmount + " where max amount is : " + web3.utils.hexToNumber(loanObject.amountDue));
        if ( loanObject.currency !== "0x0000000000000000000000000000000000000000" ){
          txOptions.value = 0;
          let approveFungibleTokensToParties = await instanceFungibleTokens.approve(instance.address,installmentAmount,{
            from : accounts[0]
          });
          assert.typeOf(approveFungibleTokensToParties, 'object', "[ERROR] :: Cannot approve the sent fungible tokens.");
        }else{
          txOptions.value = installmentAmount;
        }

        const payLoan = await instance.payLoan(createdLoanId, txOptions);
        assert.typeOf(payLoan, 'object', "[BUGGED] :: Not possible to pay for loan.");

        loanObject = await instance.loans.call(createdLoanId);
        assert.equal(web3.utils.hexToNumber(loanObject.nrOfPayments), 1, "[BUGGED] :: Loan should have 1 payment at this point.");
      });


      // payLoan(uint256)
      it('Should pay for loan, half of the installments', async () => {
        const instance = await LendingData.deployed();
        const instanceFungibleTokens = await FungibleTokens.deployed();
        let loanObject = await instance.loans.call(createdLoanId);

        let txOptions = { from: accounts[0] };
        let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
        installmentAmount = installmentAmount.overallInstallmentAmount;
        /*
        if ( ( web3.utils.hexToNumber(loanObject.installmentAmount) * 1.5 ) < web3.utils.hexToNumber(installmentAmount) )
          installmentAmount = web3.utils.hexToNumber("0x" + installmentAmount);
        */
        let regExp = /[a-zA-Z]/g;      
        if(regExp.test(installmentAmount))
          installmentAmount = web3.utils.hexToNumber(installmentAmount);

        if ( loanObject.currency !== "0x0000000000000000000000000000000000000000" ){
          txOptions.value = 0;
          let approveFungibleTokensToParties = await instanceFungibleTokens.approve(instance.address,installmentAmount,{
            from : accounts[0]
          });
          assert.typeOf(approveFungibleTokensToParties, 'object', "[ERROR] :: Cannot approve the sent fungible tokens.");
        }else{
          txOptions.value = installmentAmount;
        }

        let nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
        let initialNrOfPayments = web3.utils.hexToNumber(loanObject.nrOfPayments);
        if ( ( nrOfInstallments / 2 ) < ( nrOfInstallments - initialNrOfPayments ) )
          for (let i = 0, l = nrOfInstallments / 2; i < l; ++i) {
            loanObject = await instance.loans.call(createdLoanId);
            nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
            initialNrOfPayments = web3.utils.hexToNumber(loanObject.nrOfPayments);
            if ( initialNrOfPayments < nrOfInstallments ){
              console.log("We pay : " + installmentAmount + " where max amount is : " + web3.utils.hexToNumber(loanObject.amountDue));
              const payLoan = await instance.payLoan(createdLoanId, txOptions);
              assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan. >> " + nrOfInstallments + " && " + web3.utils.hexToNumber(loanObject.nrOfPayments));
            }
          }

          loanObject = await instance.loans.call(createdLoanId);
          let nrOfPayments = web3.utils.hexToNumber(loanObject.nrOfPayments);
          assert.equal(parseInt(initialNrOfPayments + ( nrOfInstallments / 2 )),nrOfPayments,"[BUGGED] :: Number of payments is not accurate, possible paid too much / less.");
      });


      // payLoan(uint256)
      it('Should pay for loan, all installments', async () => {
        const instance = await LendingData.deployed();
        const instanceFungibleTokens = await FungibleTokens.deployed();
        let loanObject = await instance.loans.call(createdLoanId);

        let txOptions = { from: accounts[0] };
        let installmentAmount = await instance.getLoanInstallmentCost.call(createdLoanId,1);
        installmentAmount = installmentAmount.overallInstallmentAmount;
        /*
        if ( ( web3.utils.hexToNumber(loanObject.installmentAmount) * 1.5 ) < web3.utils.hexToNumber(installmentAmount) )
          installmentAmount = web3.utils.hexToNumber("0x" + installmentAmount);
        */
        let regExp = /[a-zA-Z]/g;      
        if(regExp.test(installmentAmount))
          installmentAmount = web3.utils.hexToNumber(installmentAmount);

        if ( loanObject.currency !== "0x0000000000000000000000000000000000000000" ){
          txOptions.value = 0;
          let approveFungibleTokensToParties = await instanceFungibleTokens.approve(instance.address,installmentAmount,{
            from : accounts[0]
          });
          assert.typeOf(approveFungibleTokensToParties, 'object', "[ERROR] :: Cannot approve the sent fungible tokens.");
        }else{
          txOptions.value = installmentAmount;
        }

        let nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
        let initialNrOfPayments = web3.utils.hexToNumber(loanObject.nrOfPayments);
        if ( initialNrOfPayments < nrOfInstallments ){
          let nrOfInstallments = loanObject.nrOfInstallments - loanObject.nrOfPayments;
          for (let i = 0, l = nrOfInstallments; i < l; ++i) {
            loanObject = await instance.loans.call(createdLoanId);
            nrOfInstallments = web3.utils.hexToNumber(loanObject.nrOfInstallments);
            initialNrOfPayments = web3.utils.hexToNumber(loanObject.nrOfPayments);
            if ( initialNrOfPayments < nrOfInstallments ){
              console.log("We pay : " + installmentAmount + " where max amount is : " + web3.utils.hexToNumber(loanObject.amountDue));
              const payLoan = await instance.payLoan(createdLoanId, txOptions);
              assert.typeOf(payLoan.receipt, 'object', "[BUGGED] :: Not possible to pay for loan.");
            }
          }
        }
      });


      // terminateLoan(uint256)
      it('Should terminate the loan if lack of installments', async () => {
        const instance = await LendingData.deployed();
        let loanObject = await instance.loans.call(createdLoanId);
        if ( loanObject.lender !== "0x0000000000000000000000000000000000000000" ){
          const lackOfPayment = await instance.lackOfPayment(createdLoanId);
          assert.typeOf(lackOfPayment, 'boolean', "[BUGGED] :: Not possible to get the lack of payment loan status.");
          if ( lackOfPayment ){
            const loanTermination = await instance.terminateLoan(createdLoanId,{ from : accounts[0] });
            assert.typeOf(loanTermination.receipt, 'object', "[BUGGED] :: Not possible to terminate the loan.");
          }
        }
      });

    });

  }


});