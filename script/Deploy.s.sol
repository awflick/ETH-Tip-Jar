// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Script} from "forge-std/Script.sol";
import {TipJar} from "../contracts/TipJar.sol";

contract DeployTipJar is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new TipJar();
        vm.stopBroadcast();
    }
}
