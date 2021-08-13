// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;
import "./ProxyCore.sol";
import "./StaterProxyAdmin.sol";


contract StaterProxy is ProxyCore, StaterProxyAdmin {
    
    /*
     * @DIIMIIM: call() implementation
     * @param to: Represents the address of the smart contract to call, will also be checked within this method
     * @param input: Represents the method payload encoded as bytes
     */
    function vanillaCall(address to, bytes calldata input) external guarded(to) returns(bytes memory){
        return abi.decode(_call(to,input),(bytes));
    }

    /*
     * @DIIMIIM: delegatecall() implementation
     * @param to: Represents the address of the smart contract to call, will also be checked within this method
     * @param input: Represents the method payload encoded as bytes
     */
    function delegateCall(address to, bytes calldata input) external guarded(to) {
        _delegatecall(to,input);
    }

    /*
     * @DIIMIIM: Boilerplate setter
     */
    function updateBoilerplate(address to, bytes4 method) external {
        boilerplate[msg.sender][to] = method;
    }
    
    function _delegatecall(address to, bytes calldata payload) internal returns(bytes memory) {
        (bool success, bytes memory output) = to.delegatecall(payload);
        require(success, "StaterGateway: Delegate call failed");
        return output;
    }
    
    function _call(address to, bytes calldata payload) internal returns(bytes memory) {
        (bool success, bytes memory output) = to.call(payload);
        require(success, "StaterGateway: Vamilla call failed");
        return output;
    }

}