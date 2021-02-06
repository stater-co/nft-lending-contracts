pragma solidity 0.7.4;

contract Sc1 {

    uint value;
    
    function getValue() external view returns(uint){
        return value;
    }
    
    function setValue(uint _val) external {
        value = _val;
    }

}
