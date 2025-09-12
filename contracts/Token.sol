//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract ERC20Token {
    uint256 public totalSupply;
    address public owner;
    uint256 public balance;
    string public name;
    string public symbol;
    uint8 public decimals;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;
        owner = msg.sender;
        balances[msg.sender] = _totalSupply;
    }

    function balanceOf(address account) external view returns(uint256) {
        return balances[account];
    }

    function Transfer(address receiver, uint256 amount) external returns(bool) {
        require(receiver != address(0), "Address is not correct");
        require(balances[msg.sender] > 0, "Insufficient balance");
        balances[msg.sender] -= (amount);
        balances[receiver] += (amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns(bool) {
        require(spender != address(0), "False address");
        allowances[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address receiver, uint256 amount ) external returns(bool) {
        require(receiver != address(0), "Address is not correct");
        require(balances[from] > 0, "Insufficient balance");
        require(allowances[from][msg.sender] >= amount, "Amount mismatch"); 
        balances[from] -= amount;
        allowances[from][msg.sender] -= amount;
        balances[receiver] += (amount);
        return true;
    }

    function allowance(address spender) external view returns(uint256) {
        return allowances[msg.sender][spender];
    }
}