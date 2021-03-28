// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

contract StaterDiplomat {


    /*
    * @DIIMIIM This is gonna handle all the Stater Core permissions
    * @The stater admin will be able to add new permissions to current stater contracts
    */
    mapping(bytes32 => address) public permissions;
    
    
    /*
     * @DIIMIIM This method handles the Stater Core permissions
     */
    function setPermission(bytes32 _signature, address _address) external {
        permissions[_signature] = _address;
    }
    

}