// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

contract TipJar {
    // state variables
    address public owner;
    uint256 public totalTips;

    // events
    event TipReceived(address indexed from, uint256 amount, string message);
    event TipWithdrawn(address indexed to, uint256 amount);

    // constructor
    constructor() {
        owner = msg.sender; // set the contract deployer as the owner
        totalTips = 0; // initialize total tips to zero
    }

    // fallback / receive function to accept tips
    receive() external payable {
        require(msg.value > 0, "Tip must be greater than zero");
        totalTips += msg.value; // update total tips
        emit TipReceived(msg.sender, msg.value, ""); // emit event for tip received with empty message
    }

    // Public tip function (with message)
    function tip(string memory message) public payable {
        require(msg.value > 0, "Tip must be greater than zero");
        totalTips += msg.value; // update total tips
        emit TipReceived(msg.sender, msg.value, message); // emit event for tip received
    }

    // view balance function
    function getBalance() public view returns (uint256) {
        return address(this).balance; // return the contract's balance
    }

    // only owner withdraw function
    function withdrawTips() public onlyOwner {
        uint256 amount = address(this).balance; // get the contract's balance
        require(amount > 0, "No tips to withdraw");
        payable(owner).transfer(amount); // transfer the balance to the owner
        emit TipWithdrawn(msg.sender, amount);
    }

    // funtion to get the owner's address
    function getOwner() public view returns (address) {
        return owner; // return the owner's address
    }

    // modifier: onlyOwner
    modifier onlyOwner() {
        require(msg.sender == owner, "only the owner can call this function");
        _; // continue execution of the function
    }
}
