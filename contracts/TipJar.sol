// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TipJar {
    /// ===== STATE VARIABLES ===== ///
    address public immutable owner;
    uint256 public totalTips; // ETH only

    /// ===== EVENTS ===== ///
    event TipReceived(address indexed from, uint256 amount, string message); // ETH tips
    event TokenTipReceived(
        address indexed from,
        address indexed token,
        uint256 amount,
        string message
    ); // Token tips
    event TipWithdrawn(address indexed to, uint256 amount);

    /// ===== MAPPINGS ===== ///
    mapping(address => uint256) public totalTipsByToken;
    mapping(address => mapping(address => uint256)) public userTips;

    /// ===== CONSTRUCTOR ===== ///
    constructor() {
        owner = msg.sender;
    }

    /// ===== BALANCE VIEW FUNCTIONS ===== ///
    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    /// ===== RECEIVE / TIP ETH ===== ///
    receive() external payable {
        require(msg.value > 0, "Tip must be greater than zero");
        totalTips += msg.value;
        emit TipReceived(msg.sender, msg.value, "");
    }

    function tip(string memory message) public payable {
        require(msg.value > 0, "Tip must be greater than zero");
        totalTips += msg.value;
        emit TipReceived(msg.sender, msg.value, message);
    }

    /// ===== TIP TOKEN ===== ///
    function tipToken(
        address tokenAddress,
        uint256 amount,
        string calldata message
    ) external returns (bool) {
        require(amount > 0, "Tip amount must be greater than zero");

        IERC20 token = IERC20(tokenAddress);
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );

        totalTipsByToken[tokenAddress] += amount;
        userTips[msg.sender][tokenAddress] += amount;

        emit TokenTipReceived(msg.sender, tokenAddress, amount, message);
        return true;
    }

    /// ===== WITHDRAW ETH ===== ///
    function withdrawTips() public onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No ETH to withdraw");
        payable(owner).transfer(amount);
        emit TipWithdrawn(msg.sender, amount);
    }

    /// ===== WITHDRAW TOKEN ===== ///
    function withdrawToken(
        address tokenAddress
    ) external onlyOwner returns (bool) {
        IERC20 token = IERC20(tokenAddress);
        uint256 amount = token.balanceOf(address(this));
        require(amount > 0, "No tokens to withdraw");

        require(token.transfer(owner, amount), "Token transfer failed");
        emit TipWithdrawn(msg.sender, amount);
        return true;
    }

    /// ===== MODIFIERS ===== ///
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
}
