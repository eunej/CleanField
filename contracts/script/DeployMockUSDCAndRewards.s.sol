// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {CleanFieldRewards} from "../src/CleanFieldRewards.sol";

/**
 * @title DeployMockUSDCAndRewards
 * @dev Deploy mock USDC and rewards contract, then fund rewards
 *
 * Usage:
 *   forge script script/DeployMockUSDCAndRewards.s.sol --rpc-url https://sepolia.base.org --broadcast
 */
contract DeployMockUSDCAndRewards is Script {
    function run() external returns (address usdc, address rewards) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        MockUSDC mockUsdc = new MockUSDC();
        CleanFieldRewards rewardsContract = new CleanFieldRewards(
            address(mockUsdc),
            address(0)
        );

        // Mint 1,000,000 USDC (6 decimals) to rewards contract
        mockUsdc.mint(address(rewardsContract), 1_000_000 * 10**6);

        vm.stopBroadcast();

        console.log("MockUSDC deployed at:", address(mockUsdc));
        console.log("Rewards deployed at:", address(rewardsContract));
        console.log("Rewards funded with 1,000,000 mUSDC");

        return (address(mockUsdc), address(rewardsContract));
    }
}
