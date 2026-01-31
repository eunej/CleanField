// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {CleanFieldRewards} from "../src/CleanFieldRewards.sol";

/**
 * @title ResetClaim
 * @dev Script to reset a farm's claim year for testing
 * 
 * Usage:
 *   forge script script/ResetClaim.s.sol --rpc-url https://sepolia.base.org --broadcast
 */
contract ResetClaim is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        address rewardsAddress = vm.envAddress("REWARDS_CONTRACT");
        string memory farmId = vm.envString("FARM_ID");

        console.log("Setting up farm:", farmId);
        console.log("Deployer:", deployer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        CleanFieldRewards rewards = CleanFieldRewards(rewardsAddress);
        
        CleanFieldRewards.ClaimState memory claimState = rewards.getClaimState(farmId);
        console.log("Current lastClaimYear:", claimState.lastClaimYear);
        console.log("Current lastClaimTime:", claimState.lastClaimTime);

        console.log("Resetting claim year...");
        rewards.resetClaimYear(farmId);

        CleanFieldRewards.ClaimState memory claimAfter = rewards.getClaimState(farmId);
        console.log("New lastClaimYear:", claimAfter.lastClaimYear);
        console.log("New lastClaimTime:", claimAfter.lastClaimTime);
        console.log("Claim year reset successfully!");
        
        vm.stopBroadcast();
    }
}
