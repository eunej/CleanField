// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {CleanFieldRewards} from "../src/CleanFieldRewards.sol";

/**
 * @title DeployCleanFieldRewards
 * @dev Deployment script for Base mainnet/testnet
 * 
 * Usage:
 *   Base Sepolia: forge script script/DeployBase.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast
 *   Base Mainnet: forge script script/DeployBase.s.sol --rpc-url $BASE_RPC --broadcast
 */
contract DeployCleanFieldRewards is Script {
    // Base Mainnet USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    // Base Sepolia USDC: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    
    address constant BASE_MAINNET_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address constant BASE_SEPOLIA_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() external returns (CleanFieldRewards) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Check if we're on Base Sepolia (chain ID 84532) or Base Mainnet (chain ID 8453)
        uint256 chainId = block.chainid;
        address usdcAddress;
        string memory networkName;
        
        if (chainId == 8453) {
            usdcAddress = BASE_MAINNET_USDC;
            networkName = "Base Mainnet";
        } else if (chainId == 84532) {
            usdcAddress = BASE_SEPOLIA_USDC;
            networkName = "Base Sepolia";
        } else {
            // Default to testnet for local testing
            usdcAddress = BASE_SEPOLIA_USDC;
            networkName = "Local/Unknown";
        }
        
        console.log("Deploying CleanFieldRewards to", networkName);
        console.log("Deployer:", deployer);
        console.log("USDC Address:", usdcAddress);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy the rewards contract
        // zkTLS verifier address can be zero initially (use oracle mode)
        // Can be updated later via updateVerifier()
        CleanFieldRewards rewards = new CleanFieldRewards(
            usdcAddress,
            address(0)      // No zkTLS verifier initially
        );
        
        // Disable on-chain verification until verifier is set
        rewards.setVerificationRequired(false);

        vm.stopBroadcast();

        console.log("CleanFieldRewards deployed at:", address(rewards));
        console.log("Verification required:", rewards.requireOnChainVerification());

        return rewards;
    }
}
