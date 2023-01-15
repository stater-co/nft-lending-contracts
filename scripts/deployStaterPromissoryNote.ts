import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { StaterPromissoryNote } from '../typechain-types/StaterPromissoryNote';


export const staterPromissoryNoteSetup = async (): Promise<StaterPromissoryNote | void> => {
  let contract: StaterPromissoryNote;
  try {

    contract = await deployContract({
      name: 'StaterPromissoryNote',
      constructor: ["Test Promissory Note","TPN"],
      props: {}
    }) as StaterPromissoryNote;
    DeploymentLogger('export PROMISSORY_NOTE=' + contract.address);

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}