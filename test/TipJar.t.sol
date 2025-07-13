// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {TipJar} from "../contracts/TipJar.sol";

contract TipJarTest is Test {
    TipJar public tipJar;
    address public owner;
    address public tipper;

    function setUp() public {
        owner = address(this);
        tipper = vm.addr(1);
        tipJar = new TipJar();
    }

    function testOwnerIsSetCorrectly() public view {
        assertEq(tipJar.owner(), owner);
    }

    function testReceiveFunctionUpdatesTotalTips() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        (bool success, ) = address(tipJar).call{value: 0.1 ether}("");
        require(success, "Transfer failed");

        assertEq(tipJar.getBalance(), 0.1 ether);
    }

    function testTipFunctionWithMessage() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        tipJar.tip{value: 0.2 ether}("Great job!");

        assertEq(tipJar.getBalance(), 0.2 ether);
        // assertEq(tipJar.getTipMessage(tipper), "Great job!");
    }

    function testOnlyOwnerCanWithdrawl() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        tipJar.tip{value: 0.5 ether}("keep it up!");

        // Try to withdraw as a non-owner
        vm.prank(tipper);
        vm.expectRevert("only the owner can call this function");
        tipJar.withdrawTips();

        // Withdraw as the owner
        uint256 ownerBalanceBefore = owner.balance;
        vm.prank(owner);
        tipJar.withdrawTips();
        assertGt(owner.balance, ownerBalanceBefore);
    }

    function testCannotTipZeroETH() public {
        vm.expectRevert("Tip must be greater than zero");
        tipJar.tip{value: 0 ether}("No tip");
    }

    function testCannotReceiveZeroETH() public {
        vm.expectRevert("Tip must be greater than zero");
        address(tipJar).call{value: 0 ether}(""); // Triggers 'receive()' with 0 ETH  
    }

    function testCannotWithdrawEmptyContract() public {
        vm.expectRevert("No tips to withdraw");
        tipJar.withdrawTips();
    }

    function testGetOwner() public view {
        assertEq(tipJar.getOwner(), owner);
    }

    receive() external payable {}
}
