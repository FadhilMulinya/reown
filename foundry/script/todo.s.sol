// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Todo} from "../src/todo.sol";

contract CounterScript is Script {
    Todo public todo;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        todo = new Todo();

        vm.stopBroadcast();
    }
}

//If you want to deploy use this example i used with anvil
//forge script script/todo.s.sol --rpc-url http://127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
