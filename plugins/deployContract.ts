import hre from 'hardhat'
import { ethers } from "ethers";
import { deploymentMessage } from "./deploymentMessage";
import { ContractParams } from '../common/dto/contracts/contractParams.dto';
import { TestLogger } from '../logs/test/printers/logs';
import { expect } from 'chai';


export async function deployContract(contractParams: ContractParams): Promise<ethers.Contract> {
    const Contract: ethers.ContractFactory = await hre.ethers.getContractFactory(contractParams.name,contractParams.props);

    const contract: ethers.Contract = await Contract.deploy(...contractParams.constructor);
    await contract.deployed();
  
    if ( contractParams.logs ) {
      deploymentMessage(contractParams.name,contract.address);
    }

    if ( contractParams.verifyAddress ) {
      expect(contract.address).to.have.lengthOf(42);
    }

    TestLogger("Contract: " + contractParams.name + ", deployed at: " + contract.address);
    return contract;
  }