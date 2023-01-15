import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { StaterPromissoryNote } from '../typechain-types/StaterPromissoryNote';
import { DeploymentParams } from '../common/dto/deployment/deploymentParams.dto';


export const staterPromissoryNoteSetup = async (params?: DeploymentParams): Promise<StaterPromissoryNote | void> => {
  let contract: StaterPromissoryNote;
  try {

    contract = await deployContract({
      name: 'StaterPromissoryNote',
      constructor: ["Test Promissory Note","TPN"],
      props: {},
      verifyAddress: params ? params.testing : false
    }) as StaterPromissoryNote;

    if ( !params ) {
      DeploymentLogger('export PROMISSORY_NOTE=' + contract.address);
    } else {
      if ( params.logging ) {
        DeploymentLogger('export PROMISSORY_NOTE=' + contract.address);
      }
    }

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}