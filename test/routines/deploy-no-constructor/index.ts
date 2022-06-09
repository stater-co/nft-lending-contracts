import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";


export async function deployNoConstructor(contractName: string): Promise<Contract> {
    const Deployed = await ethers.getContractFactory(contractName);
    const deployed = await Deployed.deploy();
    
    await deployed.deployed();
    expect(deployed.address).to.have.lengthOf(42);

    return deployed;
}