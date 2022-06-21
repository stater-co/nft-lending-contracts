const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");


let discounts, erc721, erc1155, stakingTokens, distributionTokens, lendingMethods, lendingTemplate, erc20;
const address0x0 = "0x0000000000000000000000000000000000000000";
const nrOfWorkflowsToTest = 10;
const ERC721_TYPE = 0;
const ERC1155_TYPE = 1;
const TOKEN_GEYSER_TYPE = 2;


function generateLoanParams() {
  let randomValue = Math.floor(Math.random() * 99999999) + 1;
  let randomLtv = Math.floor(Math.random() * 59) + 1;
  let assetsValue = randomValue;
  let loanValue = parseInt((assetsValue / 100) * randomLtv);
  let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
  let currency = Math.floor(Math.random() * 2) + 1 === 1 ? address0x0 : erc20.address;
  return [assetsValue,loanValue,nrOfInstallments,currency];
}


describe("Smart Contracts Setup", function () {

  it("Should deploy the erc20 contract", async function () {
    const FungibleTokens = await ethers.getContractFactory("FungibleTokens");
    const _fungibleTokens = await FungibleTokens.deploy(BigNumber.from("1000000000000000000"),"Test ERC20","TERC20");
    await _fungibleTokens.deployed();
    expect(_fungibleTokens.address).to.have.lengthOf(42);
    erc20 = _fungibleTokens;
  });

  it("Should deploy the discounts contract", async function () {
    const Discounts = await ethers.getContractFactory("StaterDiscounts");
    const _discounts = await Discounts.deploy();
    await _discounts.deployed();
    expect(_discounts.address).to.have.lengthOf(42);
    discounts = _discounts;
  });

  it("Should deploy the ERC721 contract", async function () {
    const NFT721 = await ethers.getContractFactory("GameItems721");
    const _nft721 = await NFT721.deploy("Test","T");
    await _nft721.deployed();
    expect(_nft721.address).to.have.lengthOf(42);
    erc721 = _nft721;
  });

  it("Should deploy the ERC1155 contract", async function () {
    const NFT1155 = await ethers.getContractFactory("GameItems1155");
    const _nft1155 = await NFT1155.deploy("Test");
    await _nft1155.deployed();
    expect(_nft1155.address).to.have.lengthOf(42);
    erc1155 = _nft1155;
  });

  it("Should deploy the token geyser contract", async function () {

    const StakingTokens = await ethers.getContractFactory("FungibleTokens");
    const _stakingTokens = await StakingTokens.deploy(BigNumber.from('1000000000000000000'),"Test Staking Tokens", "TST");
    await _stakingTokens.deployed();
    expect(_stakingTokens.address).to.have.lengthOf(42);
    stakingTokens = _stakingTokens;

    const Distributiontokens = await ethers.getContractFactory("FungibleTokens");
    const _distributionTokens = await Distributiontokens.deploy(BigNumber.from('1000000000000000000'),"Test Distribution Tokens", "TDT");
    await _distributionTokens.deployed();
    expect(_distributionTokens.address).to.have.lengthOf(42);
    distributionTokens = _distributionTokens;

  });

  it("Should deploy the lending methods", async function () {
    const LendingMethods = await ethers.getContractFactory("LendingMethods");
    const _lendingMethods = await LendingMethods.deploy("Lending Methods","LM");
    await _lendingMethods.deployed();
    expect(_lendingMethods.address).to.have.lengthOf(42);
    lendingMethods = _lendingMethods;
  });

  it("Should deploy the lending template", async function () {
    const LendingTemplate = await ethers.getContractFactory("LendingTemplate");
    const _lendingTemplate = await LendingTemplate.deploy("Lending Template","LT");
    await _lendingTemplate.deployed();
    expect(_lendingTemplate.address).to.have.lengthOf(42);

    // @DIIMIIM: Change this if you want to swith between lendingTemplate and lendingMethods
    lendingTemplate = _lendingTemplate;

    await lendingTemplate.setGlobalVariables(
        600,  
        40, 
        20, 
        100,
        lendingMethods.address,
        discounts.address
    );

    await lendingMethods.setGlobalVariables(
        600,  
        40, 
        20, 
        100,
        lendingMethods.address,
        discounts.address
    );

  });

});


describe("Preparations", function () {

  it("Approve lending template on erc1155 contract", async function () {
    const operation = await erc1155.setApprovalForAll(lendingTemplate.address,true);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check lending template approval on erc1155 contract", async function () {
    const [deployer] = await ethers.getSigners();
    const isApproved = await erc1155.isApprovedForAll(deployer.address,lendingTemplate.address);
    expect(isApproved);
  });

  it("Approve lending template on erc721 contract", async function () {
    const operation = await erc721.setApprovalForAll(lendingTemplate.address,true);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check lending template approval on erc721 contract", async function () {
    const [deployer] = await ethers.getSigners();
    const isApproved = await erc721.isApprovedForAll(deployer.address,lendingTemplate.address);
    expect(isApproved);
  });

  it("Should create the ERC721 discount", async function () {
    const operation = await discounts.addDiscount(0,erc721.address,4,[...Array(10).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the ERC1155 discount", async function () {
    const operation = await discounts.addDiscount(1,erc1155.address,2,[...Array(10).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

});


describe("Lending Unit Tests", function () {
  
  for ( let i = 1 , l = nrOfWorkflowsToTest; i <= l; ++i ) {
    let nrOfAssets;
    let nftAddressArray = [];
    let nftTokenIdArray = [];
    let nftTokenTypeArray = [];

    it("Create loan " + i, async function () {
      const [deployer] = await ethers.getSigners();
      nrOfAssets = Math.floor(Math.random() * 10) + 1;
      let params = generateLoanParams();
      let assetsValue = params[0];
      let loanValue = params[1];
      let nrOfInstallments = params[2];
      let currency = params[3];
      let newSupply, balanceOf, tokenId;
      await lendingTemplate.checkLtv(loanValue,assetsValue);
      for ( let j = 0 , k = nrOfAssets; j < k; ++j ) {
        const assetType = Math.floor(Math.random() * 2);
        switch ( assetType ) {
          case 0:
            // ERC721
            await erc721.createItem("Token 1", "Token 1 description", "Token 1 URL");
            newSupply = await erc721.totalSupply();
            await erc721.approve(Number(newSupply) - 1, deployer.address);
            console.log("Total erc721 supply: " + Number(newSupply));
            tokenId = Number((BigNumber.from(newSupply._hex).toString()))-1;
            nftAddressArray.push(erc721.address);
            nftTokenIdArray.push(tokenId);
          break;

          case 1:
            // ERC1155
            await erc1155.createTokens(deployer.address,1,'0x00',"name","description","image url");
            newSupply = await erc1155.totalSupply();
            await erc1155.setApprovalForAll(deployer.address,lendingTemplate.address);
            console.log("Total erc1155 supply: " + Number(newSupply));
            tokenId = Number((BigNumber.from(newSupply._hex).toString()))-1;
            nftAddressArray.push(erc1155.address);
            nftTokenIdArray.push(tokenId);

            balanceOf = await erc1155.balanceOf(deployer.address,tokenId);
            balanceOf = Number((BigNumber.from(balanceOf._hex).toString()));
            expect(balanceOf > 0, "Token " + tokenId + " of loan: " + i + " is not owned by loan creator ( [deployer.address] : " + deployer.address + " )");
          break;
        }
        nftTokenTypeArray.push(assetType);
      }

        console.log(            [
            loanValue,
            nrOfInstallments,
            currency,
            assetsValue,
            nftAddressArray,
            nftTokenIdArray,
            nftTokenTypeArray
        ]);

        const operation = await lendingTemplate.createLoan(
            [
                loanValue,
                nrOfInstallments,
                currency,
                assetsValue,
                nftAddressArray,
                nftTokenIdArray,
                nftTokenTypeArray
            ]
        );
      expect(operation.hash).to.have.lengthOf(66);

    });

    /*
    it("Check loan " + i + " existence", async function () {
      const loan = await lendingTemplate.loans(i);
      expect(loan[0] !== address0x0);
    });

    const willEdit = Math.floor(Math.random() * 2) + 1 === 1 ? true : false;
    const willApprove = Math.floor(Math.random() * 10) + 1 > 2 ? true : false;
  
    if ( willEdit ) {
      let initialLoan;

      it("Edit loan " + i, async function () {
        const [deployer] = await ethers.getSigners();
        let params = generateLoanParams();
        let assetsValue = params[0];
        let loanValue = params[1];
        let nrOfInstallments = params[2];
        let currency = params[3];
        await lendingTemplate.checkLtv(loanValue,assetsValue);
        // Somewhere between 1 week and 3 months
        let installmentTime = Math.floor(Math.random() * 7889231) + 604800;
        
        initialLoan = await lendingTemplate.loans(i);
        const operation = await lendingTemplate.editLoan(i,loanValue,nrOfInstallments,currency,assetsValue,installmentTime);
        expect(operation.hash).to.have.lengthOf(66);

      });

      if ( initialLoan ) {
        it("Check loan edit " + i, async function () {
          const loan = await lendingTemplate.loans(i);
          expect(loan[4].hex !== initialLoan[4].hex || loan[2] !== initialLoan[2] || loan[6].hex !== initialLoan[6].hex || loan[7].hex !== initialLoan[7].hex || loan[12] !== initialLoan[12]);
        });
      }

    }

    const willCancel = Math.floor(Math.random() * 10) + 1 <= 2 ? true : false;
    if ( willCancel ) {
      it("Cancel loan " + i, async function () {
        const [deployer] = await ethers.getSigners();
        const operation = await lendingTemplate.cancelLoan(i);
        expect(operation.hash).to.have.lengthOf(66);
      });
      it("Check loan " + i + " cancellation", async function () {
        const cancelledLoan = await lendingTemplate.loans(i);
        expect(cancelledLoan[3] === 3);
      });
    }

    if ( willCancel ) {
      it("Approve loan after cancellation " + i, async function () {
        try {

          const loan = await lendingTemplate.loans(i);
          const approvalCosts = await lendingTemplate.getLoanApprovalCost(i);

          if ( loan[2] !== address0x0 ) {
            const approvetokens = await erc20.approve(lendingTemplate.address,Number((BigNumber.from(approvalCosts[0]._hex).toString())));
            expect(approvetokens.hash).to.have.lengthOf(66);
          }
          
          await lendingTemplate.approveLoan(i, { value: Number((BigNumber.from(approvalCosts[0]._hex).toString())) });
          expect(false);

        } catch (err) {
          expect(true);
        }
      });
    } else {
      if ( willApprove ) {

        const willUseDiscount = Math.floor(Math.random() * 10) + 1 <= 7 ? true : false;
        const willUseExistingDiscount = Math.floor(Math.random() * 10) + 1 <= 5 ? true : false;

        if ( willUseDiscount ) {

          if ( willUseExistingDiscount ) {

            it("Will edit discount before using it for loan " + i + " approval", async function () {
              const [deployer] = await ethers.getSigners();
              let discountId = await discounts.discountId();
              discountId = Number((BigNumber.from(discountId._hex).toString())) -1;

              const possibleDiscounts = [erc721.address,erc1155.address,tokenGeyser.address];
              const discountIndexToUse = Math.floor(Math.random() * possibleDiscounts.length);
              const discountValue = Math.floor(Math.random() * 9) + 2;
              let tokensForDiscount, erc721TotalSupply, usedErc1155TokenId;
              
              if ( discountId > 0 ) {
                const discountToEdit = Math.floor(Math.random() * (discountId-1));
                let usedErc1155TokenIds = [];

                switch ( discountIndexToUse ) {
                  case 0:
                    // ERC721
                    tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                    for ( let j = 0; j < tokensForDiscount; ++j )
                      await erc721.createItem("Token " + j, "Token " + j + " description", "Token " + j + " URL");
                    erc721TotalSupply = await erc721.totalSupply();
                    erc721TotalSupply = Number((BigNumber.from(erc721TotalSupply._hex).toString()));
                    await discounts.editDiscount(
                      discountToEdit,
                      possibleDiscounts[discountIndexToUse],
                      discountValue,
                      Array.from({length: tokensForDiscount}, (_, i) => i + erc721TotalSupply - tokensForDiscount),
                      ERC721_TYPE
                    );
                  break;

                  case 1:
                    // ERC1155
                    tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                    for ( let j = 0; j < tokensForDiscount; ++j ) {
                      usedErc1155TokenId = Math.floor(Math.random() * 9) + 2;
                      usedErc1155TokenIds.push(usedErc1155TokenId);
                      await erc1155.createTokens(
                        deployer.address,
                        Math.floor(Math.random() * nrOfAssets) + 1,
                        '0x00',
                        "name " + j,
                        "description " + j,
                        "image url " + j
                      );
                    }
                    await discounts.editDiscount(
                      discountToEdit,
                      possibleDiscounts[discountIndexToUse],
                      discountValue,
                      usedErc1155TokenIds,
                      ERC1155_TYPE
                    );
                  break;

                  case 2:
                    // Token Geyser
                    await discounts.editDiscount(
                      discountToEdit,
                      possibleDiscounts[discountIndexToUse],
                      discountValue,
                      [],
                      TOKEN_GEYSER_TYPE
                    );
                  break;
                }

              } else {

                let usedTokens = [];

                switch ( discountIndexToUse ) {
                  case 0:
                    // ERC721
                    tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                    for ( let j = 0; j < tokensForDiscount; ++j )
                      await erc721.createItem("Token " + j, "Token " + j + " description", "Token " + j + " URL");
                    erc721TotalSupply = await erc721.totalSupply();
                    erc721TotalSupply = Number((BigNumber.from(erc721TotalSupply._hex).toString()));
                    usedTokens = Array.from({length: tokensForDiscount}, (_, i) => i + erc721TotalSupply - tokensForDiscount);
                  break;

                  case 1:
                    // ERC1155
                    tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                    for ( let j = 0; j < tokensForDiscount; ++j ) {
                      usedErc1155TokenId = Math.floor(Math.random() * 9) + 2;
                      usedTokens.push(usedErc1155TokenId);
                      await erc1155.createTokens(
                        deployer.address,
                        Math.floor(Math.random() * nrOfAssets) + 1,
                        '0x00',
                        "name " + j,
                        "description " + j,
                        "image url " + j
                      );
                    }
                  break;

                  case 2:
                    // Token Geyser
                    usedTokens = [];
                  break;
                }

                await discounts.addDiscount(discountIndexToUse,possibleDiscounts[discountIndexToUse],discountValue,usedTokens);

              }

              const loan = await lendingTemplate.loans(i);

              if ( loan[1] === address0x0 ) {

                const approvalCosts = await lendingTemplate.getLoanApprovalCost(i);              
                
                if ( loan[2] !== address0x0 ) {
              
                  await erc20.transfer(deployer.address, approvalCosts[0]._hex);
                  
                  const approvetokens = await erc20.approve(lendingTemplate.address,approvalCosts[0]._hex);
                  expect(approvetokens.hash).to.have.lengthOf(66);
                  
                }

                const operation = await lendingTemplate.approveLoan(i, { value: Number((BigNumber.from(approvalCosts[0]._hex).toString())) });
                expect(operation.hash).to.have.lengthOf(66);
              
              }

            });

          } else {
          

            it("Will create a new discount before using it for loan " + i + " approval", async function () {
              const [deployer] = await ethers.getSigners();
              const possibleDiscounts = [erc721.address,erc1155.address,tokenGeyser.address];
              const discountIndexToUse = Math.floor(Math.random() * possibleDiscounts.length);
              const discountValue = Math.floor(Math.random() * 9) + 2;
              let tokensForDiscount, erc721TotalSupply, erc1155TotalSupply;
              let usedTokens = [];

              switch ( discountIndexToUse ) {
                case 0:
                  // ERC721
                  tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                  for ( let j = 0; j < tokensForDiscount; ++j )
                    await erc721.createItem("Token " + j, "Token " + j + " description", "Token " + j + " URL");
                  erc721TotalSupply = await erc721.totalSupply();
                  erc721TotalSupply = Number((BigNumber.from(erc721TotalSupply._hex).toString()));
                  usedTokens = Array.from({length: tokensForDiscount}, (_, i) => i + erc721TotalSupply - tokensForDiscount);
                break;
  
                case 1:
                  // ERC1155
                  tokensForDiscount = Math.floor(Math.random() * 4) + 1;
                  for ( let j = 0; j < tokensForDiscount; ++j ) {
                    erc1155TotalSupply = await erc1155.totalSupply();
                    usedTokens.push(Number((BigNumber.from(erc1155TotalSupply._hex).toString())));
                    await erc1155.createTokens(
                      deployer.address,
                      Math.floor(Math.random() * nrOfAssets) + 1,
                      '0x00',
                      "name " + j,
                      "description " + j,
                      "image url " + j
                    );
                  }
                break;
  
                case 2:
                  // Token Geyser
                  usedTokens = [];
                break;
              }
  
              await discounts.addDiscount(discountIndexToUse,possibleDiscounts[discountIndexToUse],discountValue,usedTokens);

            });

          }
        }

        it("Approve loan " + i, async function () {
          const [deployer] = await ethers.getSigners();
          const loan = await lendingTemplate.loans(i);
          const approvalCosts = await lendingTemplate.getLoanApprovalCost(i);

          if ( loan[1] === address0x0 ) {

            if ( loan[2] !== address0x0 ) {
              
              await erc20.transfer(deployer.address, approvalCosts[0]._hex);
              
              const approvetokens = await erc20.approve(lendingTemplate.address,approvalCosts[0]._hex);
              expect(approvetokens.hash).to.have.lengthOf(66);
              
            }
            
            const operation = await lendingTemplate.approveLoan(i, { value: approvalCosts[0]._hex });
            expect(operation.hash).to.have.lengthOf(66);

          }

        });

        it("It will pay loan " + i + " with 1 installment", async function () {
        const installmentCost = await lendingTemplate.getLoanInstallmentCost(i,1);
        const loan = await lendingTemplate.loans(i);

        if ( loan[2] !== address0x0 ) {

            const approvetokens = await erc20.approve(lendingTemplate.address,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(approvetokens.hash).to.have.lengthOf(66);

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(operation.hash).to.have.lengthOf(66);

        } else {

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())), { value : Number((BigNumber.from(installmentCost.overallInstallmentAmount))) });
            expect(operation.hash).to.have.lengthOf(66);

        }

        });

        it("It will pay loan " + i + " 50% of its remaining installments", async function () {
        const installmentCost = await lendingTemplate.getLoanInstallmentCost(i,1);
        const loan = await lendingTemplate.loans(i);
        const nrOfPayments = Number((BigNumber.from(loan.nrOfPayments).toString()));
        const nrOfInstallments = Number((BigNumber.from(loan.nrOfInstallments).toString()));
        const remainingInstallments = nrOfInstallments - nrOfPayments;
        const halfRemainingInstallments = remainingInstallments / 2;

        for ( let j = 0; j < halfRemainingInstallments; ++j ) {
            if ( loan[2] !== address0x0 ) {

            const approvetokens = await erc20.approve(lendingTemplate.address,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(approvetokens.hash).to.have.lengthOf(66);

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(operation.hash).to.have.lengthOf(66);

            } else {

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())), { value : Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())) });
            expect(operation.hash).to.have.lengthOf(66);

            }

        }

        });

        it("It will pay loan " + i + " rest of the remaining installments", async function () {
        const installmentCost = await lendingTemplate.getLoanInstallmentCost(i,1);
        const loan = await lendingTemplate.loans(i);
        const nrOfPayments = Number((BigNumber.from(loan.nrOfPayments).toString()));
        const nrOfInstallments = Number((BigNumber.from(loan.nrOfInstallments).toString()));
        const remainingInstallments = nrOfInstallments - nrOfPayments;

        for ( let j = 0; j < remainingInstallments; ++j ) {
            if ( loan[2] !== address0x0 ) {

            const approvetokens = await erc20.approve(lendingTemplate.address,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(approvetokens.hash).to.have.lengthOf(66);

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())));
            expect(operation.hash).to.have.lengthOf(66);

            } else {

            const operation = await lendingTemplate.payLoan(i,Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())), { value : Number((BigNumber.from(installmentCost.overallInstallmentAmount).toString())) });
            expect(operation.hash).to.have.lengthOf(66);

            }

        }

        });

      }
    }

    let isTerminated;
    if ( willCancel ) {
      it("It will try to terminate cancelled loan " + i, async function () {
        try {
          await lendingTemplate.terminateLoan(i);
          expect(false,"[BUG]: Cancelled loan " + i + " has been terminated!");
          isTerminated = true;
        } catch (err) {
          expect(true);
        }
      });
    }

    if ( willApprove ) {
      it("It will try to terminate approved loan " + i, async function () {
        const loan = await lendingTemplate.loans(i);
        if ( Number((BigNumber.from(loan.nrOfPayments).toString())) >= Number((BigNumber.from(loan.nrOfInstallments).toString())) ) {
          await lendingTemplate.terminateLoan(i);
          isTerminated = true;
        }
      });
    }

    if ( isTerminated ) {
      it("It will try to terminate terminated loan " + i, async function () {
        try {
          await lendingTemplate.terminateLoan(i);
          expect(false,"[BUG]: Terminated loan " + i + " has been terminated again!");
          isTerminated = true;
        } catch (err) {
          expect(true);
        }
      });
    }

    */
  }

});

/*
describe("Finishing Test Results", function () {

  it("Check loan id", async function () {
    const lastLoan = await lendingTemplate.loans(nrOfWorkflowsToTest);
    const afterLastLoan = await lendingTemplate.loans(nrOfWorkflowsToTest + nrOfWorkflowsToTest);
    expect(lastLoan[0] !== address0x0 && afterLastLoan === address0x0);
  });

});
*/