// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;

contract StaterPermissions {


    /*
    * @DIIMIIM This is gonna handle all the Stater Core permissions
    * @The stater admin will be able to add new permissions to current stater contracts
    */
    mapping(address => address[]) public permissions;
    
    
    /*
     * @DIIMIIM This method handles the Stater Core permissions
     */
    function setPermission(address _staterContract, uint32 _index, address _address) external {
        permissions[_staterContract][_index] = _address;
    }


    /*
     * @DIIMIIM This method handles the Stater Core permissions
     */
    function pushPermission(address _staterContract, address _address) external {
        permissions[_staterContract].push(_address);
    }


    /*
     * @DIIMIIM uint32 and not uint8 because : https://ethereum.stackexchange.com/questions/3067/why-does-uint8-cost-more-gas-than-uint256
     */
    mapping(address => uint32) public discounts;
    
    
    /*
     * @DIIMIIM This method handles the Stater Core discounts
     */
    function setDiscounts(address _contract, uint32 _discount) external {
        discounts[_contract] = _discount;
    }
    

}