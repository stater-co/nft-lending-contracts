import { globalParams } from '../common/params';

export const generateLoanParams = (erc20Address: string): [number, number, number, string] => {
    const randomValue: number = Math.floor(Math.random() * 99999999) + 1;
    const randomLtv: number = Math.floor(Math.random() * 59) + 1;
    const assetsValue: number = randomValue;
    const loanValue: number = parseInt(String((assetsValue / 100) * randomLtv));
    const nrOfInstallments: number = Math.floor(Math.random() * 20) + 1;
    const currency: string = Math.floor(Math.random() * 2) + 1 === 1 ? globalParams.address0 : erc20Address;
    return [assetsValue,loanValue,nrOfInstallments,currency];
}