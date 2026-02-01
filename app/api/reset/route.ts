/**
 * Demo Reset API
 * 
 * Resets all farm claims on-chain for demo purposes.
 * Triggered by typing "reset" on the website.
 */

import { NextResponse } from 'next/server';
import { ethers, Contract, Wallet } from 'ethers';

// Farm IDs to reset
const FARM_IDS = ['farm1', 'farm2', 'farm3', 'farm4', 'farm5'];

// Contract ABI for reset function
const RESET_ABI = [
  'function resetClaimYear(string memory _farmId) external',
  'function owner() external view returns (address)',
];

export async function POST() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const contractAddress = process.env.NEXT_PUBLIC_REWARDS_CONTRACT;
    const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

    if (!privateKey) {
      return NextResponse.json(
        { success: false, error: 'Server not configured for reset (missing PRIVATE_KEY)' },
        { status: 500 }
      );
    }

    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      return NextResponse.json(
        { success: false, error: 'Contract address not configured' },
        { status: 500 }
      );
    }

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new Wallet(privateKey, provider);
    const contract = new Contract(contractAddress, RESET_ABI, wallet);

    // Verify wallet is the owner
    const owner = await contract.owner();
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Configured wallet is not the contract owner' },
        { status: 403 }
      );
    }

    console.log('[Reset] Starting reset for all farms...');
    console.log('[Reset] Contract:', contractAddress);
    console.log('[Reset] Owner wallet:', wallet.address);

    const results: { farmId: string; success: boolean; txHash?: string; error?: string }[] = [];

    // Get current nonce
    let nonce = await provider.getTransactionCount(wallet.address, 'pending');
    console.log('[Reset] Starting nonce:', nonce);

    // Reset each farm sequentially with explicit nonce management
    for (const farmId of FARM_IDS) {
      try {
        console.log(`[Reset] Resetting ${farmId} with nonce ${nonce}...`);
        const tx = await contract.resetClaimYear(farmId, { nonce });
        nonce++; // Increment nonce for next transaction
        const receipt = await tx.wait();
        console.log(`[Reset] ✓ ${farmId} reset, tx: ${receipt.hash}`);
        results.push({ farmId, success: true, txHash: receipt.hash });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Reset] ✗ ${farmId} failed:`, errorMessage);
        results.push({ farmId, success: false, error: errorMessage });
        // Still increment nonce in case the tx was submitted but failed
        nonce++;
      }
    }

    const allSuccess = results.every(r => r.success);
    const successCount = results.filter(r => r.success).length;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? `All ${FARM_IDS.length} farms reset successfully!`
        : `Reset completed: ${successCount}/${FARM_IDS.length} farms`,
      results,
    });

  } catch (error) {
    console.error('[Reset] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Reset failed' 
      },
      { status: 500 }
    );
  }
}

// Also support GET for simple trigger
export async function GET() {
  return POST();
}
