import DeploymentError from '../logs/deployment/printers/errors';
import { StaterDiscounts } from '../typechain-types/StaterDiscounts';
import { StaterPromissoryNote } from '../typechain-types/StaterPromissoryNote';
import { LendingMethods } from '../typechain-types/LendingMethods';
import { LendingTemplate } from '../typechain-types/LendingTemplate';
import { staterDiscountsSetup } from './deployStaterDiscounts';
import { staterPromissoryNoteSetup } from './deployStaterPromissoryNote';
import { deployLendingMethods } from './deployLendingMethods';
import { deployLendingTemplate } from './deployLendingTemplate';



export const deployContractsInfrastructure = async () => {
  try {

    const discounts: StaterDiscounts | void = await staterDiscountsSetup();
    const promissoryNotes: StaterPromissoryNote | void = await staterPromissoryNoteSetup();
    const lendingMethods: LendingMethods | void = await deployLendingMethods();
    
    if ( !discounts || !promissoryNotes || !lendingMethods ) {
      DeploymentError("Some of the Lending Template Contract dependencies failed to properly deploy. Aborted.");
      return;
    }

    const lendingTemplate: LendingTemplate | void = await deployLendingTemplate(promissoryNotes.address, lendingMethods.address, discounts.address);
    if ( !lendingTemplate ) {
      DeploymentError("Lending Template failed to deploy. Aborted.");
      return;
    }
    promissoryNotes.setLendingDataAddress(lendingTemplate.address);

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployContractsInfrastructure()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
