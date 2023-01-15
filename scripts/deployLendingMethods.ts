import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { LendingMethods } from '../typechain-types/LendingMethods';


export const deployLendingMethods = async (): Promise<LendingMethods | void> => {
  let contract: LendingMethods;
  try {

    contract = await deployContract({
      name: 'LendingMethods',
      constructor: [],
      props: {}
    }) as LendingMethods;
    DeploymentLogger('export LENDING_METHODS=' + contract.address);

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}