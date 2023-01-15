import DeploymentError from '../logs/deployment/printers/errors';
import DeploymentLogger from '../logs/deployment/printers/deployment';
import { deployContract } from '../plugins/deployContract';
import { StaterDiscounts } from '../typechain-types/StaterDiscounts';


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