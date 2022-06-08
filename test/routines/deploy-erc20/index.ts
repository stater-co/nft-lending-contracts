import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import { IndexParams } from './index-params.dto';


export async function deployERC20(input: IndexParams): Promise<Contract> {

    return new Promise(function(resolve, ) {
        describe(input.describeLabel, async function () {

            it(input.itLabel, async function () {
                const Deployed = await ethers.getContractFactory(input.contractName);
                const deployed = await Deployed.deploy(
                    input.constructorParams.totalSupply,
                    input.constructorParams.name,
                    input.constructorParams.symbol
                );
                await deployed.deployed();
                expect(deployed.address).to.have.lengthOf(42);
                resolve(deployed);
            });
    
        });
    });

}