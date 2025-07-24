// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {TipJar} from "../contracts/TipJar.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice Minimal ERC-20 mock for testing
contract TestToken is IERC20 {
    string public name = "MockToken";
    string public symbol = "MTK";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(
            allowance[from][msg.sender] >= amount,
            "Insufficient allowance"
        );
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }
}

contract TestLinkToken is TestToken {
    constructor() {
        name = "Mock LINK";
        symbol = "mLINK";
    }
}

contract TipJarTest is Test {
    TipJar public tipJar;
    TestToken public testToken;
    TestLinkToken public testLink;
    address public owner;
    address public tipper;

    function setUp() public {
        owner = address(this);
        tipper = vm.addr(1);
        tipJar = new TipJar();

        testToken = new TestToken();
        testToken.mint(tipper, 1000 ether);
        testLink = new TestLinkToken();
        testLink.mint(tipper, 1000 ether);
    }

    function testOwnerIsSetCorrectly() public view {
        assertEq(tipJar.owner(), owner);
    }

    function testReceiveFunctionUpdatesTotalTips() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        (bool success, ) = address(tipJar).call{value: 0.1 ether}("");
        require(success, "Transfer failed");

        assertEq(address(tipJar).balance, 0.1 ether);
    }

    function testTipFunctionWithMessage() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        tipJar.tip{value: 0.2 ether}("Great job!");

        assertEq(address(tipJar).balance, 0.2 ether);
    }

    function testOnlyOwnerCanWithdrawl() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        tipJar.tip{value: 0.5 ether}("keep it up!");

        // Try to withdraw as a non-owner
        vm.prank(tipper);
        vm.expectRevert("Only the owner can call this function");
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
        vm.expectRevert("No ETH to withdraw");
        tipJar.withdrawTips();
    }

    function testGetEthBalance() public {
        vm.deal(tipper, 1 ether);
        vm.prank(tipper);
        tipJar.tip{value: 0.3 ether}("test");

        assertEq(tipJar.getEthBalance(), 0.3 ether);
    }

    /// ========== ERC20 TESTS ========== ///

    function testTipTokenSuccess() public {
        vm.prank(tipper);
        testToken.approve(address(tipJar), 500 ether);

        vm.prank(tipper);
        bool success = tipJar.tipToken(
            address(testToken),
            500 ether,
            "Token tip"
        );

        assertTrue(success);
        assertEq(testToken.balanceOf(address(tipJar)), 500 ether);
        assertEq(tipJar.totalTipsByToken(address(testToken)), 500 ether);
        assertEq(tipJar.userTips(tipper, address(testToken)), 500 ether);
    }

    function testCannotTipZeroTokenAmount() public {
        vm.prank(tipper);
        vm.expectRevert("Tip amount must be greater than zero");
        tipJar.tipToken(address(testToken), 0, "Invalid");
    }

    function testTokenTransferFailsWithoutApproval() public {
        vm.prank(tipper);
        vm.expectRevert("Insufficient allowance");
        tipJar.tipToken(address(testToken), 100 ether, "Should fail");
    }

    function testTokenWithdrawal() public {
        vm.prank(tipper);
        testToken.approve(address(tipJar), 200 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testToken), 200 ether, "Fund it");

        uint256 ownerBalBefore = testToken.balanceOf(owner);
        tipJar.withdrawToken(address(testToken));
        uint256 ownerBalAfter = testToken.balanceOf(owner);

        assertEq(ownerBalAfter, ownerBalBefore + 200 ether);
    }

    function testSeparateBalancesForDifferentTokens() public {
        // Mint + Approve for both tokens
        vm.prank(tipper);
        testToken.approve(address(tipJar), 200 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testToken), 200 ether, "MTK tip");

        vm.prank(tipper);
        testLink.approve(address(tipJar), 300 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testLink), 300 ether, "LINK tip");

        // Assert both balances tracked separately
        assertEq(tipJar.totalTipsByToken(address(testToken)), 200 ether);
        assertEq(tipJar.totalTipsByToken(address(testLink)), 300 ether);
        assertEq(tipJar.userTips(tipper, address(testToken)), 200 ether);
        assertEq(tipJar.userTips(tipper, address(testLink)), 300 ether);
    }

    function testSeparateWithdrawalsForDifferentTokens() public {
        // Approve and tip with both tokens
        vm.prank(tipper);
        testToken.approve(address(tipJar), 100 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testToken), 100 ether, "MTK");

        vm.prank(tipper);
        testLink.approve(address(tipJar), 50 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testLink), 50 ether, "LINK");

        // Withdraw each token
        uint256 ownerMTKBefore = testToken.balanceOf(owner);
        uint256 ownerLINKBefore = testLink.balanceOf(owner);

        tipJar.withdrawToken(address(testToken));
        tipJar.withdrawToken(address(testLink));

        assertEq(testToken.balanceOf(owner), ownerMTKBefore + 100 ether);
        assertEq(testLink.balanceOf(owner), ownerLINKBefore + 50 ether);
    }

    function testGetTokenBalance() public {
        vm.prank(tipper);
        testToken.approve(address(tipJar), 250 ether);
        vm.prank(tipper);
        tipJar.tipToken(address(testToken), 250 ether, "token test");

        uint256 contractBal = tipJar.getTokenBalance(address(testToken));
        assertEq(contractBal, 250 ether);
    }

    /// ========== FUZZ TEST ========== ///

    function testFuzzTipToken(uint256 amount) public {
        amount = bound(amount, 1 ether, 1000 ether); // constrain range
        testToken.mint(tipper, amount);

        vm.prank(tipper);
        testToken.approve(address(tipJar), amount);

        vm.prank(tipper);
        tipJar.tipToken(address(testToken), amount, "Fuzz tip");

        assertEq(testToken.balanceOf(address(tipJar)), amount);
    }

    /// ===== RECEIVE / TIP ETH ===== ///
    receive() external payable {}
}
