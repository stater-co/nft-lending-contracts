import { network } from 'hardhat';

const POLYGON_MAINNET_OPENSEA_CONTRACT_ADDRESS = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE";
const POLYGON_MUMBAI_OPENSEA_CONTRACT_ADDRESS = "0xff7Ca10aF37178BdD056628eF42fD7F799fAc77c";
const address0: string = '0x0000000000000000000000000000000000000000';

interface GlobalParams {
    address0: string;
    OPENSEA_CONTRACT_ADDRESS: string;
};

const getOpenseaContractAddress = (): string => {
    switch ( network.name ) {
        case "polygonMumbai": 
            return POLYGON_MUMBAI_OPENSEA_CONTRACT_ADDRESS;
        case "polygonMainnet":
            return POLYGON_MAINNET_OPENSEA_CONTRACT_ADDRESS;
        default:
            return address0;
    }
}

export const globalParams: GlobalParams = {
    address0: address0,
    OPENSEA_CONTRACT_ADDRESS: getOpenseaContractAddress()
};