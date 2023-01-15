import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { StaterDiscounts } from '../typechain-types/StaterDiscounts';
import { DeploymentParams } from '../common/dto/deployment/deploymentParams.dto';


export const staterDiscountsSetup = async (params?: DeploymentParams): Promise<StaterDiscounts | void> => {
  let contract: StaterDiscounts;
  try {

    contract = await deployContract({
      name: 'StaterDiscounts',
      constructor: [],
      props: {},
      verifyAddress: params ? params.testing : false
    }) as StaterDiscounts;

    if ( !params ) {
      DeploymentLogger('export DISCOUNTS=' + contract.address);
    } else {
      if ( params.logging ) {
        DeploymentLogger('export DISCOUNTS=' + contract.address);
      }
    }

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}