import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { ERC721Constructor } from '../contract/erc721.dto';


export async function deployERC721(input: ERC721Constructor): Promise<Contract> {
    const Deployed = await ethers.getContractFactory(input.contractName);
    const deployed = await Deployed.deploy(input.name,input.symbol);
    await deployed.deployed();
    expect(deployed.address).to.have.lengthOf(42);
    return deployed;
}