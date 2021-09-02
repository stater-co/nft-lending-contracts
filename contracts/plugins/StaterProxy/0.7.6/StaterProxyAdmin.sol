// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
import "./ProxyCore.sol";
import "../../../libs/openzeppelin-solidity/0.7.6/access/Ownable.sol";

contract StaterProxyAdmin is Ownable, ProxyCore {
    
    function forcefullyUpdateBoilerplate(address onBehalfOf, address to, bytes4 method) external onlyOwner {
        boilerplate[onBehalfOf][to] = method;
    }

}