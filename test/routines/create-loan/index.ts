import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers } from 'hardhat';
import { CreateLoanParams } from './index-params.dto';

const address0: string = '0x0000000000000000000000000000000000000000';

function generateLoanParams(erc20Address: string): Array<number | string> {
    let randomValue: number = Math.floor(Math.random() * 99999999) + 1;
    let randomLtv: number = Math.floor(Math.random() * 59) + 1;
    let loanValue: number = parseInt(String((randomValue / 100) * randomLtv));
    let nrOfInstallments: number = Math.floor(Math.random() * 20) + 1;
    let currency: string = Math.floor(Math.random() * 2) + 1 === 1 ? address0 : erc20Address;
    let collateralType: number = Math.floor(Math.random() * 2);
    
    return [
        randomValue, // 1 - 99999999
        loanValue,  // 1 - 60
        nrOfInstallments, // 1 - 21
        currency, // address(0) || custom ERC20 address
        collateralType // 0 - ERC721, 1 - ERC1155
    ];
}

export async function checkNftApprovalState(
    nftTokenIdArray: Array<number>,
    nftTokenTypeArray: Array<number>,
    lending: Contract,
    erc721: Contract,
    erc1155: Contract
): Promise<void> {
    // Get default signer
    const [owner] = await ethers.getSigners();
    console.log(nftTokenIdArray,nftTokenTypeArray);

    for ( let i = 0 , l = nftTokenIdArray.length ; i < l && l === nftTokenTypeArray.length ; ++i ) {
        let status: Boolean = true;
        console.log(nftTokenIdArray[i]);
        switch ( nftTokenTypeArray[i] ) {
            case 0:
                console.log("erc721: " + nftTokenIdArray[i]);
                status = await erc721.getApproved(nftTokenIdArray[i]) === lending.address;
                if ( !status ) {
                    expect.fail("Failed");
                }
            break;

            case 1:
                status = await erc1155.isApprovedForAll(owner.address,lending.address);
                if ( !status ) {
                    expect.fail("Failed");
                }
            break;
        }
    }
}

export async function main(
    input: CreateLoanParams
): Promise<number> {

    // Generate random loan params
    let loanParams: Array<number | string> = generateLoanParams(input.erc20.address);
    let currentId = Number(await input.lending.id()) - 1;

    let nftAddressArray: Array<string> = [];
    let nftTokenIdArray: Array<number> = [];
    let nftTokenTypeArray: Array<number> = [];

    // Get default signer
    const [owner] = await ethers.getSigners();

    // Filling up the creat loan array params
    for ( let i: number = 0 , l: number = Number(loanParams[2]) ; i < l ; ++i ) {

        // If the nft to be used it's supposed to be ERC721
        if ( loanParams[4] === 0 ) {

            let itemIdBefore = Number(await input.erc721.totalCreated());

            // We create the nft
            await input.erc721.createItem(
                "name",
                "description",
                "image_url"
            );

            // Get its ID
            let itemId = Number(await input.erc721.totalCreated()) - 1;
            if ( itemIdBefore + 1 === itemId ) {

            // And approve the lending contract for all
            await input.erc721.approve(input.lending.address,itemId);

            nftAddressArray.push(input.erc721.address);
            nftTokenIdArray.push(itemId);
            nftTokenTypeArray.push(0);

            }

        // Otherwise, ERC1155
        } else {

            let itemIdBefore = Number(await input.erc1155.totalSupply());

            // We create the nft
            await input.erc1155.createTokens(
                owner.address,
                1,
                '0x00',
                "name",
                "description",
                "image_url"
            );

            // Get its ID
            let itemId = Number(await input.erc1155.totalSupply()) - 1;
            if ( itemIdBefore + 1 === itemId ) {

                // And approve the lending contract for all
                await input.erc1155.setApprovalForAll(input.lending.address,true);
                
                nftAddressArray.push(input.erc1155.address);
                nftTokenIdArray.push(1);
                nftTokenTypeArray.push(0);

            }

        }
    }

    if ( nftAddressArray.length > 0 ) {

        await checkNftApprovalState(
            nftTokenIdArray, 
            nftTokenTypeArray, 
            input.lending,
            input.erc721,
            input.erc1155
        );

        await input.lending.createLoan(
            [
                Number(loanParams[1]),
                Number(loanParams[2]),
                String(loanParams[3]),
                Number(loanParams[1]) * 2,
                nftAddressArray,
                nftTokenIdArray,
                nftTokenTypeArray
            ]
        );

    }

    let id = Number(await input.lending.id()) - 1;

    return id;

}