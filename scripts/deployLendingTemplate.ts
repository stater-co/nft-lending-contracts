import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { LendingTemplate } from '../typechain-types/LendingTemplate';
import { DeploymentParams } from '../common/dto/deployment/deploymentParams.dto';



export const deployLendingTemplate = async (
  promissoryNoteContractAddress: string,
  lendingMethodsContractAddress: string,
  discountsContractAddress: string,
  params?: DeploymentParams
): Promise<LendingTemplate | void> => {
  let contract: LendingTemplate;
  try {

    contract = await deployContract({
      name: 'LendingTemplate',
      constructor: [promissoryNoteContractAddress, lendingMethodsContractAddress, discountsContractAddress],
      props: {},
      verifyAddress: params ? params.testing : false
    }) as LendingTemplate;

    if ( !params ) {
      DeploymentLogger('export LENDING_TEMPLATE=' + contract.address);
    } else {
      if ( params.logging ) {
        DeploymentLogger('export LENDING_TEMPLATE=' + contract.address);
      }
    }

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}