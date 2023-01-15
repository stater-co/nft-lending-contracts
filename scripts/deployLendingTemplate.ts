import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { LendingTemplate } from '../typechain-types/LendingTemplate';



export const deployLendingTemplate = async (
  promissoryNoteContractAddress: string,
  lendingMethodsContractAddress: string,
  discountsContractAddress: string
): Promise<LendingTemplate | void> => {
  let contract: LendingTemplate;
  try {

    contract = await deployContract({
      name: 'LendingTemplate',
      constructor: [promissoryNoteContractAddress, lendingMethodsContractAddress, discountsContractAddress],
      props: {}
    }) as LendingTemplate;
    DeploymentLogger('export LENDING_TEMPLATE=' + contract.address);

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}