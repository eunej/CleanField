// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {SmogFreeOracle} from "../src/SmogFreeOracle.sol";

contract DeploySmogFreeOracle is Script {
    // Sepolia USDT address (you'll need to deploy a mock USDT or use existing one)
    address constant SEPOLIA_USDT = 0x7169D38820dfd117C3FA1f22a697dBA58d90BA06;

    function run() external returns (SmogFreeOracle) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        SmogFreeOracle oracle = new SmogFreeOracle(
            SEPOLIA_USDT,
            deployer // Initially, deployer is the oracle
        );

        vm.stopBroadcast();

        return oracle;
    }
}
