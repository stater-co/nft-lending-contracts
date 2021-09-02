// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
import "./ProxyCore.sol";
import "../../../contracts/libs/openzeppelin-solidity/contracts/access/Ownable.sol";

contract StaterProxyAdmin is Ownable, ProxyCore {
    
    function forcefullyUpdateBoilerplate(address onBehalfOf, address to, bytes4 method) external onlyOwner {
        boilerplate[onBehalfOf][to] = method;
    }

}