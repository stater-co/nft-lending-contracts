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
    return [randomValue, loanValue, nrOfInstallments, currency, collateralType];
}

export async function main(
    input: CreateLoanParams
): Promise<any> {
    let loanParams: Array<number | string> = generateLoanParams(input.erc20.address);
    let nftAddressArray: Array<string> = [];
    let nftTokenIdArray: Array<number> = [];
    let nftTokenTypeArray: Array<number> = [];
    const [owner] = await ethers.getSigners();

    for ( let i: number = 0 , l: number = Number(loanParams[2]) ; i < l ; ++i ) {
        if ( loanParams[4] === 0 ) {
            await input.erc721.createItem(
                "name",
                "description",
                "image_url"
            );
            let itemId = await input.erc721.totalCreated();
            await input.erc721.setApprovalForAll(input.lending.address,true);
            nftAddressArray.push(input.erc721.address);
            nftTokenIdArray.push(Number(itemId)-1);
            nftTokenTypeArray.push(0);
        } else {
            await input.erc1155.createTokens(
                owner.address,
                1,
                '0x00',
                "name",
                "description",
                "image_url"
            );
            // let items = await input.erc1155.items(i);
            // console.log(items);
            await input.erc1155.setApprovalForAll(input.lending.address,true);
            nftAddressArray.push(input.erc1155.address);
            nftTokenIdArray.push(1);
            nftTokenTypeArray.push(0);
        }
    }

    console.log([
        Number(loanParams[1]),
        Number(loanParams[2]),
        String(loanParams[3]),
        Number(loanParams[1]) * 2,
        nftAddressArray,
        nftTokenIdArray,
        nftTokenTypeArray
    ]);
    return await input.lending.createLoan(
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