import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { LendingMethods } from '../typechain-types/LendingMethods';
import { DeploymentParams } from '../common/dto/deployment/deploymentParams.dto';


export const deployLendingMethods = async (params?: DeploymentParams): Promise<LendingMethods | void> => {
  let contract: LendingMethods;
  try {

    contract = await deployContract({
      name: 'LendingMethods',
      constructor: [],
      props: {},
      verifyAddress: params ? params.testing : false
    }) as LendingMethods;

    if ( !params ) {
      DeploymentLogger('export LENDING_METHODS=' + contract.address);
    } else {
      if ( params.logging ) {
        DeploymentLogger('export LENDING_METHODS=' + contract.address);
      }
    }
    
    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}