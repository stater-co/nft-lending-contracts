// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "./ProxyCore.sol";
import "../../../contracts/libs/openzeppelin-solidity/contracts/access/Ownable.sol";

contract StaterGatewayAdmin is Ownable, ProxyCore {
    
    function forcefullyUpdateBoilerplate(address onBehalfOf, address to, bytes4 method) external onlyOwner {
        boilerplate[onBehalfOf][to] = method;
    }

}