const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat")
const address0 = '0x0000000000000000000000000000000000000000';

function generateLoanParams(erc20Address) {
  let randomValue = Math.floor(Math.random() * 99999999) + 1;
  let randomLtv = Math.floor(Math.random() * 59) + 1;
  let loanValue = parseInt(String((randomValue / 100) * randomLtv));
  let nrOfInstallments = Math.floor(Math.random() * 20) + 1;
  let currency = Math.floor(Math.random() * 2) + 1 === 1 ? address0 : erc20Address;
  let collateralType = Math.floor(Math.random() * 2);
  
  return [
      randomValue, // 1 - 99999999
      loanValue,  // 1 - 60
      nrOfInstallments, // 1 - 21
      currency, // address(0) || custom ERC20 address
      collateralType // 0 - ERC721, 1 - ERC1155
  ];
}

describe("Create Loan", async function () {
  let lending_methods, loan, erc721, erc1155, erc20, lending_template, discounts;

  beforeEach(async () => {
    erc20 = await ethers.getContractFactory("FungibleTokens");
    erc20 = await erc20.deploy(
      BigNumber.from("1000000000000000000"),
      "Test ERC20",
      "TERC20"
    );
    await erc20.deployed();
    expect(erc20.address).to.have.lengthOf(42);

    erc721 = await ethers.getContractFactory("GameItems721");
    erc721 = await erc721.deploy(
      "Test ERC721",
      "TERC721"
    );
    await erc721.deployed();
    expect(erc721.address).to.have.lengthOf(42);

    erc1155 = await ethers.getContractFactory("GameItems1155");
    erc1155 = await erc1155.deploy(
      "Test ERC1155"
    );
    await erc1155.deployed();
    expect(erc1155.address).to.have.lengthOf(42);

    lending_methods = await ethers.getContractFactory("LendingMethods");
    lending_methods = await lending_methods.deploy(
      "Loans NFT",
      "LNFT"
    );
    await lending_methods.deployed();
    expect(lending_methods.address).to.have.lengthOf(42);

    lending_template = await ethers.getContractFactory("LendingTemplate");
    lending_template = await lending_template.deploy(
      "Loans NFT",
      "LNFT"
    );
    await lending_template.deployed();
    expect(lending_template.address).to.have.lengthOf(42);

    discounts = await ethers.getContractFactory("StaterDiscounts");
    discounts = await discounts.deploy();
    await discounts.deployed();
    expect(discounts.address).to.have.lengthOf(42);
  })

  describe("Creation", () => {
    it("Status", async () => {

      const loanParams = generateLoanParams(erc20.address);
      const currentId = Number(await lending_template.id()) - 1;

      const nftAddressArray = [];
      const nftTokenIdArray = [];
      const nftTokenTypeArray = [];

      const [owner] = await ethers.getSigners();

      // Filling up the creat loan array params
      for ( let i = 0 , l = Number(loanParams[2]) ; i < l ; ++i ) {

        // If the nft to be used it's supposed to be ERC721
        if ( loanParams[4] === 0 ) {

            // We create the nft
            await erc721.createItem(
                "name",
                "description",
                "image_url"
            );

            // Get its ID
            let itemId = Number(await erc721.totalCreated()) - 1;

            // And approve the lending contract for all
            await erc721.approve(lending_template.address,itemId);

            nftAddressArray.push(erc721.address);
            nftTokenIdArray.push(itemId);
            nftTokenTypeArray.push(0);

        // Otherwise, ERC1155
        } else {

            // We create the nft
            await erc1155.createTokens(
                owner.address,
                1,
                '0x00',
                "name",
                "description",
                "image_url"
            );

            // And approve the lending contract for all
            await erc1155.setApprovalForAll(lending_template.address,true);
            
            nftAddressArray.push(erc1155.address);
            nftTokenIdArray.push(1);
            nftTokenTypeArray.push(0);

        }
      }

      await lending_template.setGlobalVariables(
        600,  
        20, 
        40, 
        100,
        lending_methods.address,
        discounts.address
      );

      console.log([
        Number(loanParams[1]),
        Number(loanParams[2]),
        String(loanParams[3]),
        Number(loanParams[1]) * 2,
        nftAddressArray,
        nftTokenIdArray,
        nftTokenTypeArray
      ]);

      loan = await lending_template.createLoan(
        [
          Number(loanParams[1]),
          Number(loanParams[2]),
          loanParams[3],
          Number(loanParams[1]) * 2,
          nftAddressArray,
          nftTokenIdArray,
          nftTokenTypeArray
        ]
      );
    
      console.log(loan);

      //expect(contract.address).to.have.lengthOf(42);
    })
  })
  
});