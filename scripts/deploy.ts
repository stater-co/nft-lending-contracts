import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { StaterDiscounts } from '../typechain-types/StaterDiscounts';
import { StaterPromissoryNote } from '../typechain-types/StaterPromissoryNote';
import { LendingMethods } from '../typechain-types/LendingMethods';
import { LendingTemplate } from '../typechain-types/LendingTemplate';

export const staterDiscountsSetup = async (): Promise<StaterDiscounts | void> => {
  let contract: StaterDiscounts;
  try {

    contract = await deployContract({
      name: 'StaterDiscounts',
      constructor: [],
      props: {}
    }) as StaterDiscounts;
    DeploymentLogger('export DISCOUNTS=' + contract.address);

    await contract.addDiscount(2,"0x1a08a4be4c59d808ee730d57a369b1c09ed62352",20,[]);

    await contract.addDiscount(1,"0x4100670ee2f8aef6c47a4ed13c7f246e621228ec",2,[1,4,5,2]);

    return contract;

  } catch(err) {
    console.error(err);
    DeploymentError((err as NodeJS.ErrnoException).message);
  }
}

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
