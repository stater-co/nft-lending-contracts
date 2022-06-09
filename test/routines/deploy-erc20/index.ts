import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC20Constructor } from '../contract/erc20.dto';


export async function deployERC20(input: ERC20Constructor): Promise<Contract> {
    const Deployed = await ethers.getContractFactory(input.contractName);
    const deployed = await Deployed.deploy(
        input.totalSupply,
        input.name,
        input.symbol
    );
    
    await deployed.deployed();
    expect(deployed.address).to.have.lengthOf(42);

    return deployed;
}