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

contract Sc2 {

    uint value;
    Sc1 sc1;
    
    function getValue() external view returns(uint){
        return value;
    }
    
    function setSc1(address _sc1) external {
        sc1 = Sc1(_sc1);
    }
    
    function setValue(uint _val) external {
        value = _val;
    }
    
    function setValueExternal() external {
        value = sc1.getValue();
    }
    
    function getValueExternal() external view returns(uint) {
        return sc1.getValue();
    }

}
