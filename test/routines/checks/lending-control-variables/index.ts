import { LendingTemplateControlVariables } from "./index-params.dto";


export async function main(
    input: LendingTemplateControlVariables
): Promise<Boolean> {

        const address0: string = '0x0000000000000000000000000000000000000000';

        await input.lendingMethods.setGlobalParameters(input.lendingTemplate.address, input.discountsAddress);
        await input.lendingTemplate.setGlobalParameters(input.lendingMethods.address, input.discountsAddress);

        let discountsAddressFromLendingTemplate: string = await input.lendingTemplate.discounts();
        let methodsAddressFromLendingTemplate: string = await input.lendingTemplate.lendingMethodsAddress();
        let discountsAddressFromLendingMethods: string = await input.lendingMethods.discounts();
        let methodsAddressFromLendingMethods: string = await input.lendingMethods.lendingMethodsAddress();

        return (
            discountsAddressFromLendingTemplate !== address0 && methodsAddressFromLendingTemplate !== address0
        ) && (
            discountsAddressFromLendingTemplate === input.discountsAddress &&  methodsAddressFromLendingTemplate === input.lendingMethods.address
        ) && (
            discountsAddressFromLendingMethods !== address0 && methodsAddressFromLendingMethods !== address0
        ) && (
            discountsAddressFromLendingMethods === input.discountsAddress && methodsAddressFromLendingMethods === input.lendingTemplate.address
        );
        
}