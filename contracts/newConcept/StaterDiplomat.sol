// SPDX-License-Identifier: MIT
pragma solidity 0.7.4;
import "../openzeppelin-solidity/contracts/access/Ownable.sol";

contract StaterDiplomat is Ownable {


    /*
    * @DIIMIIM This is gonna handle all the Stater Core permissions
    * @The stater admin will be able to add new permissions to current stater contracts
    */
    mapping(string => address) public permissions;
    
    
    /*
     * @DIIMIIM This method handles the Stater Core permissions
     */
    function setDiplomacy(string calldata signature, address target) external onlyOwner {
        permissions[signature] = target;
    }
    
    function revokeDiplomacy(string calldata signature) external onlyOwner {
        delete permissions[signature];
    }
    
    function getDiplomacy(string calldata signature) external view returns(address) {
        return permissions[signature];
    }

}