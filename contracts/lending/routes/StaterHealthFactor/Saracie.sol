// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "../../../libs/openzeppelin-solidity/contracts/access/Ownable.sol";
import "../../../libs/uniswap-v3-core/test/SqrtPriceMathTest.sol";
import '../../../libs/uniswap-v3-core/test/TickMathTest.sol';
import "../../../libs/uniswap-v3-periphery/interfaces/INonfungiblePositionManager.sol";
import "../../../libs/protocol-v2/contracts/interfaces/IPriceOracleGetter.sol";


contract StaterHealthFactor is Ownable, SqrtPriceMathTest, TickMathTest {
    
    uint256 public liquidationTreshold = .3 ether;
    address public priceOracleGetter;
    
    constructor(
        address _priceOracleGetter
    ) {
        priceOracleGetter = _priceOracleGetter;
    }
    
    function setGlobalRouteVariables(address _priceOracleGetter) external onlyOwner {
        priceOracleGetter = _priceOracleGetter;
    }
    
    function debuggingMechanism(address nftAddress, uint256 nftId) external view returns(int24,uint160,uint160) { //,uint256,uint256) {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            ,
            ,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        ) = INonfungiblePositionManager(nftAddress).positions(nftId);
        uint160 sqrtLower = getSqrtRatioAtTick(tickLower);
        uint160 sqrtUpper = getSqrtRatioAtTick(tickUpper);
        //tokensOwed1 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token1) * tokensOwed1);
        //tokensOwed0 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token0) * tokensOwed0);
        return (tickUpper,sqrtLower,sqrtUpper);//,getAmount0Delta(sqrtLower,sqrtUpper,liquidity,true),getAmount1Delta(sqrtLower,sqrtUpper,liquidity,true));
    }
    
    function getOraclePrice(address oracle,address token) external view returns(uint256) {
        return IPriceOracleGetter(oracle).getAssetPrice(token);
    }
    
    function debuggingMechanismV3(address nftAddress, uint256 nftId) external view returns(uint256,uint256) { //,uint256,uint256) {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            ,
            ,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        ) = INonfungiblePositionManager(nftAddress).positions(nftId);
        uint160 sqrtLower = getSqrtRatioAtTick(tickLower);
        uint160 sqrtUpper = getSqrtRatioAtTick(tickUpper);
        return (getAmount0Delta(sqrtLower,sqrtUpper,liquidity,true),getAmount1Delta(sqrtLower,sqrtUpper,liquidity,true));
    }
    
    function debuggingMechanismV2(address nftAddress, uint256 nftId, uint256 amountDue) external view returns(uint256,int24) {
        (
            ,
            ,
            address token0,
            address token1,
            ,
            int24 tickLower,
            int24 tickUpper,
            uint128 liquidity,
            ,
            ,
            uint128 tokensOwed0,
            uint128 tokensOwed1
        ) = INonfungiblePositionManager(nftAddress).positions(nftId);
        uint160 sqrtLower = getSqrtRatioAtTick(tickLower);
        uint160 sqrtUpper = getSqrtRatioAtTick(tickUpper);
        tokensOwed1 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token1) * tokensOwed1);
        tokensOwed0 = uint128(IPriceOracleGetter(priceOracleGetter).getAssetPrice(token0) * tokensOwed0);
        uint256 healthFactor = (getAmount0Delta(sqrtLower,sqrtUpper,liquidity,true) + getAmount1Delta(sqrtLower,sqrtUpper,liquidity,true)) * liquidationTreshold / amountDue;
        return (healthFactor,tickLower);
    }
}
