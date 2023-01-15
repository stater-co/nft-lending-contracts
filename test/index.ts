import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
import { deployContract } from '../plugins/deployContract';
import { FungibleTokens } from '../typechain-types/FungibleTokens';
import { StaterDiscounts } from '../typechain-types/StaterDiscounts';
import { GameItems721 } from '../typechain-types/GameItems721';
import { GameItems1155 } from '../typechain-types/GameItems1155';
import { StaterPromissoryNote } from '../typechain-types/StaterPromissoryNote';
import { StakingTokens } from '../typechain-types/StakingTokens';
import { DistributionTokens } from '../typechain-types/DistributionTokens';
import { TokenGeyser } from '../typechain-types/TokenGeyser';
import { LendingMethods } from '../typechain-types/LendingMethods';
import { LendingTemplate } from '../typechain-types/LendingTemplate';
import { expecting } from '../plugins/expecting';
import { globalParams } from '../common/params';
import { generateLoanParams } from '../plugins/generateLoanParams';
import { staterDiscountsSetup } from '../scripts/deployStaterDiscounts';
import { deployLendingMethods } from '../scripts/deployLendingMethods';
import { staterPromissoryNoteSetup } from '../scripts/deployStaterPromissoryNote';
import { deployLendingTemplate } from '../scripts/deployLendingTemplate';


let discounts: StaterDiscounts, 
  erc721: GameItems721, 
  erc1155: GameItems1155, 
  tokenGeyser: TokenGeyser, 
  stakingTokens: StakingTokens, 
  distributionTokens: DistributionTokens, 
  promissoryNote: StaterPromissoryNote, 
  lendingMethods: LendingMethods, 
  lendingTemplate: LendingTemplate, 
  erc20: FungibleTokens;
const nrOfWorkflowsToTest: number = 20;
const ERC721_TYPE: number = 0;
const ERC1155_TYPE: number = 1;
const TOKEN_GEYSER_TYPE: number = 2;



describe("Smart Contracts Setup", function () {

  it("Should deploy the erc20 contract", async function () {
    erc20 = await deployContract({
      name: 'FungibleTokens',
      constructor: [BigNumber.from("1000000000000000000"),"Test ERC20","TERC20"],
      props: {}
    }) as FungibleTokens;
    expect(erc20.address).to.have.lengthOf(42);
  });

  it("Should deploy the discounts contract", async function () {
    discounts = await staterDiscountsSetup({
      logging: false,
      testing: true
    }) as StaterDiscounts;
  });

  it("Should deploy the ERC721 contract", async function () {
    erc721 = await deployContract({
      name: 'GameItems721',
      constructor: [],
      props: {}
    }) as GameItems721;
    expect(erc721.address).to.have.lengthOf(42);
  });

  it("Should deploy the ERC1155 contract", async function () {
    erc1155 = await deployContract({
      name: 'GameItems1155',
      constructor: [],
      props: {}
    }) as GameItems1155;
    expect(erc1155.address).to.have.lengthOf(42);
  });

  it("Should deploy the promissory contract", async function () {
    promissoryNote = await staterPromissoryNoteSetup({
      logging: false,
      testing: true
    }) as StaterPromissoryNote;
  });

  it("Should deploy the token geyser contract", async function () {

    stakingTokens = await deployContract({
      name: 'StakingTokens',
      constructor: [BigNumber.from('1000000000000000000'),"Test Staking Tokens", "TST"],
      props: {}
    }) as StakingTokens;
    expect(stakingTokens.address).to.have.lengthOf(42);

    distributionTokens = await deployContract({
      name: 'DistributionTokens',
      constructor: [BigNumber.from('1000000000000000000'),"Test Distribution Tokens", "TDT"],
      props: {}
    }) as DistributionTokens;
    expect(distributionTokens.address).to.have.lengthOf(42);

    tokenGeyser = await deployContract({
      name: 'TokenGeyser',
      constructor: [stakingTokens.address,distributionTokens.address,10000,100,1000,100],
      props: {}
    }) as TokenGeyser;
    expect(tokenGeyser.address).to.have.lengthOf(42);

  });

  it("Should deploy the lending methods", async function () {
    lendingMethods = await deployLendingMethods({
      logging: false,
      testing: true
    }) as LendingMethods;
  });

  it("Should deploy the lending template", async function () {
    lendingTemplate = await deployLendingTemplate(promissoryNote.address, lendingMethods.address, discounts.address, {
      logging: false,
      testing: true
    }) as LendingTemplate;
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
    expecting(isApproved);
  });

  it("Approve lending template on erc721 contract", async function () {
    const operation = await erc721.setApprovalForAll(lendingTemplate.address,true);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Check lending template approval on erc721 contract", async function () {
    const [deployer] = await ethers.getSigners();
    const isApproved = await erc721.isApprovedForAll(deployer.address,lendingTemplate.address);
    expecting(isApproved);
  });

  it("Should create the ERC721 discount", async function () {
    const operation = await discounts.addDiscount(0,erc721.address,4,[...Array(10).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the ERC1155 discount", async function () {
    const operation = await discounts.addDiscount(1,erc1155.address,2,[...Array(10).keys()]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Should create the token geyser discount", async function () {
    const operation = await discounts.addDiscount(1,tokenGeyser.address,6,[]);
    expect(operation.hash).to.have.lengthOf(66);
  });

  it("Configure Promissory Note connection to Lending Template", async function () {
    const operation = await promissoryNote.setLendingDataAddress(lendingTemplate.address);
    expect(operation.hash).to.have.lengthOf(66);
  });

});


describe("Lending Unit Tests", function () {
  
  for ( let i = 1 , l = nrOfWorkflowsToTest; i <= l; ++i ) {
    let nrOfAssets: number;
    let nftAddressArray: Array<string> = [];
    let nftTokenIdArray: Array<number> = [];
    let nftTokenTypeArray: Array<number> = [];

    it("Create loan " + i, async function () {
      const [deployer] = await ethers.getSigners();
      nrOfAssets = Math.floor(Math.random() * 10) + 1;
      let params: [number, number, number, string] = generateLoanParams(erc20.address);
      let assetsValue: number = params[0];
      let loanValue: number = params[1];
      let nrOfInstallments: number = params[2];
      let currency: string = params[3];
      let newSupply, balanceOf, tokenId;
      await lendingTemplate.checkLtv(loanValue,assetsValue);
      for ( let j = 0 , k = nrOfAssets; j < k; ++j ) {
        const assetType = Math.floor(Math.random() * 2);
        switch ( assetType ) {
          case 0:
            // ERC721
            await erc721.createItem("Token 1", "Token 1 description", "Token 1 URL");
            newSupply = await erc721.totalSupply();
            tokenId = Number((BigNumber.from(newSupply._hex).toString()))-1;
            nftAddressArray.push(erc721.address);
            nftTokenIdArray.push(tokenId);
          break;

          case 1:
            // ERC1155
            await erc1155.createTokens(deployer.address,1,'0x00',"name","description","image url");
            newSupply = await erc1155.totalSupply();
            tokenId = Number((BigNumber.from(newSupply._hex).toString()))-1;
            nftAddressArray.push(erc1155.address);
            nftTokenIdArray.push(tokenId);

            balanceOf = await erc1155.balanceOf(deployer.address,tokenId);
            balanceOf = Number((BigNumber.from(balanceOf._hex).toString()));
            expecting(balanceOf > 0, "Token " + tokenId + " of loan: " + i + " is not owned by loan creator ( [deployer.address] : " + deployer.address + " )");
          break;
        }
        nftTokenTypeArray.push(assetType);
      }

      const operation = await lendingTemplate.createLoan(loanValue,nrOfInstallments,currency,assetsValue,nftAddressArray,nftTokenIdArray,nftTokenTypeArray);
      expect(operation.hash).to.have.lengthOf(66);

    });

    it("Check loan " + i + " existence", async function () {
      const loan = await lendingTemplate.loans(i);
      expecting(loan[0] !== globalParams.address0);
    });

    const willEdit = Math.floor(Math.random() * 2) + 1 === 1 ? true : false;
    const willApprove = Math.floor(Math.random() * 10) + 1 > 2 ? true : false;
    let loanLenderTransferredViaPromissoryNote = false;
  
    if ( willEdit ) {
      let initialLoan;

      it("Edit loan " + i, async function () {
        const [deployer] = await ethers.getSigners();
        let params = generateLoanParams(erc20.address);
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
          expecting(loan[4]._hex !== initialLoan[4].hex || loan[2] !== initialLoan[2] || loan[6]._hex !== initialLoan[6].hex || loan[7]._hex !== initialLoan[7].hex || loan[12] !== initialLoan[12]);
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
        expecting(cancelledLoan[3] === 3);
      });
    }

    if ( willCancel ) {
      it("Approve loan after cancellation " + i, async function () {
        try {

          const loan = await lendingTemplate.loans(i);
          const approvalCosts = await lendingTemplate.getLoanApprovalCost(i);

          if ( loan[2] !== globalParams.address0 ) {
            const approvetokens = await erc20.approve(lendingTemplate.address,Number((BigNumber.from(approvalCosts[0]._hex).toString())));
            expect(approvetokens.hash).to.have.lengthOf(66);
          }
          
          await lendingTemplate.approveLoan(i, { value: Number((BigNumber.from(approvalCosts[0]._hex).toString())) });
          expecting(false);

        } catch (err) {
          expecting(true);
        }
      });
    } else {
      if ( willApprove ) {

        const willUseDiscount = Math.floor(Math.random() * 10) + 1 <= 7 ? true : false;
        const willUseExistingDiscount = Math.floor(Math.random() * 10) + 1 <= 5 ? true : false;
        const willCreatePromissoryNoteWithIt = Math.floor(Math.random() * 10) + 1 <= 4 ? true : false;

        if ( willUseDiscount ) {

          if ( willUseExistingDiscount ) {

            it("Will edit discount before using it for loan " + i + " approval", async function () {
              const [deployer] = await ethers.getSigners();
              const discountId: number = Number(await discounts.discountId()) - 1;

              const possibleDiscounts = [erc721.address,erc1155.address,tokenGeyser.address];
              const discountIndexToUse = Math.floor(Math.random() * possibleDiscounts.length);
              const discountValue = Math.floor(Math.random() * 9) + 2;
              let tokensForDiscount, erc721TotalSupply, usedErc1155TokenId: number;
              
              if ( discountId > 0 ) {
                const discountToEdit = Math.floor(Math.random() * (discountId-1));
                let usedErc1155TokenIds: Array<number> = [];

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

                let usedTokens: Array<number> = [];

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

              if ( loan[1] === globalParams.address0 ) {

                const approvalCosts = await lendingTemplate.getLoanApprovalCost(i);              
                
                if ( loan[2] !== globalParams.address0 ) {
              
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
              let usedTokens: Array<number> = [];

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

          if ( loan[1] === globalParams.address0 ) {

            if ( loan[2] !== globalParams.address0 ) {
              
              await erc20.transfer(deployer.address, approvalCosts[0]._hex);
              
              const approvetokens = await erc20.approve(lendingTemplate.address,approvalCosts[0]._hex);
              expect(approvetokens.hash).to.have.lengthOf(66);
              
            }
            
            const operation = await lendingTemplate.approveLoan(i, { value: approvalCosts[0]._hex });
            expect(operation.hash).to.have.lengthOf(66);

          }

        });

        const willBurnPromissoryNote = Math.floor(Math.random() * 10) + 1 <= 3 ? true : false;

        if ( willCreatePromissoryNoteWithIt ) {
          it("Will allow the promissory note creation for loan " + i, async function () {
            const [deployer] = await ethers.getSigners();
            const operation = await lendingTemplate.setPromissoryPermissions([i],deployer.address);
            expect(operation.hash).to.have.lengthOf(66);
          });

          it("Will create a promissory note for loan " + i, async function () {
            const operation = await promissoryNote.createPromissoryNote([i]);
            expect(operation.hash).to.have.lengthOf(66);
          });

          if ( willBurnPromissoryNote ) {
            it("Will burn the promissory note", async function () {
              const promissoryNoteId: number = Number(await promissoryNote.promissoryNoteId()) - 1;
              const operation = await promissoryNote.burnPromissoryNote(promissoryNoteId);
              expect(operation.hash).to.have.lengthOf(66);
            });
          } else {
            it("Will transfer the promissory note", async function () {
              const [deployer] = await ethers.getSigners();
              const promissoryNoteId: number = Number(await promissoryNote.promissoryNoteId()) - 1;
              const operation = await promissoryNote.transferFrom(deployer.address,lendingMethods.address,promissoryNoteId);
              expect(operation.hash).to.have.lengthOf(66);
              loanLenderTransferredViaPromissoryNote = true;
            });
          }
        }

        if ( loanLenderTransferredViaPromissoryNote === false && willBurnPromissoryNote ) {

          it("It will pay loan " + i + " with 1 installment", async function () {
            const installmentCost = await lendingTemplate.getLoanInstallmentCost(i,1);
            const loan = await lendingTemplate.loans(i);

            if ( loan[2] !== globalParams.address0 ) {

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
              if ( loan[2] !== globalParams.address0 ) {

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
              if ( loan[2] !== globalParams.address0 ) {

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
    }

    let isTerminated;
    if ( willCancel && loanLenderTransferredViaPromissoryNote === false ) {
      it("It will try to terminate cancelled loan " + i, async function () {
        try {
          await lendingTemplate.terminateLoan(i);
          expecting(false,"[BUG]: Cancelled loan " + i + " has been terminated!");
          isTerminated = true;
        } catch (err) {
          expecting(true);
        }
      });
    }

    if ( willApprove && loanLenderTransferredViaPromissoryNote === false ) {
      it("It will try to terminate approved loan " + i, async function () {
        const loan = await lendingTemplate.loans(i);
        if ( Number((BigNumber.from(loan.nrOfPayments).toString())) >= Number((BigNumber.from(loan.nrOfInstallments).toString())) ) {
          await lendingTemplate.terminateLoan(i);
          isTerminated = true;
        }
      });
    }

    if ( isTerminated && loanLenderTransferredViaPromissoryNote === false ) {
      it("It will try to terminate terminated loan " + i, async function () {
        try {
          await lendingTemplate.terminateLoan(i);
          expecting(false,"[BUG]: Terminated loan " + i + " has been terminated again!");
          isTerminated = true;
        } catch (err) {
          expecting(true);
        }
      });
    }

  }

});

describe("Finishing Test Results", function () {

  it("Check loan id", async function () {
    const lastLoan: number = Number(await lendingTemplate.id());
    expecting(lastLoan >= nrOfWorkflowsToTest);
  });

});