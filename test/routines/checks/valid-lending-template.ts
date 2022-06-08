import { expect } from "chai";
import { ethers } from "hardhat";
import { LendingMethods } from "../../../types/LendingMethods";
import { LendingTemplate } from "../../../types/LendingTemplate";

export async function main(
    lendingTemplate: LendingTemplate, 
    lendingTemplateAddress: string,
    lendingMethods: LendingMethods,
    lendingMethodsAddress: string
) {
    const address0: string = '0x0000000000000000000000000000000000000000';
    let discountsAddressFromLendingTemplate: string = await lendingTemplate.discounts();
    let methodsAddressFromLendingTemplate: string = await lendingTemplate.lendingMethodsAddress();
    console.log(discountsAddressFromLendingTemplate);
    console.log(methodsAddressFromLendingTemplate);
    expect(discountsAddressFromLendingTemplate !== address0 && methodsAddressFromLendingTemplate !== address0);
    expect(discountsAddressFromLendingTemplate === lendingTemplateAddress && methodsAddressFromLendingTemplate === lendingMethodsAddress);
}