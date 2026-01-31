/**
 * Smart Contract Interaction Helpers
 * 
 * Provides typed functions for interacting with CleanFieldRewards contract.
 */

import { Contract, JsonRpcSigner, JsonRpcProvider, keccak256, toUtf8Bytes } from 'ethers';
import {
  REWARDS_CONTRACT_ADDRESS,
  REWARDS_CONTRACT_ABI,
  ERC20_ABI,
  DEFAULT_CHAIN,
  USDC_ADDRESS,
  getExplorerTxUrl,
} from './config';

// ===========================================
// Types
// ===========================================

export interface ClaimEligibility {
  canClaim: boolean;
  reason: string;
}

export interface EstimatedReward {
  usdc: bigint;
  thb: bigint;
}

export interface TransactionResult {
  success: boolean;
  txHash: string;
  explorerUrl: string;
  error?: string;
}

export interface ProofSubmissionParams {
  farmId: string;
  proofHash: string;
  signature: string;
  noBurningDetected: boolean;
}

// ===========================================
// Contract Instances
// ===========================================

function getRewardsContract(signerOrProvider: JsonRpcSigner | JsonRpcProvider): Contract {
  return new Contract(REWARDS_CONTRACT_ADDRESS, REWARDS_CONTRACT_ABI, signerOrProvider);
}

function getReadProvider(): JsonRpcProvider {
  return new JsonRpcProvider(DEFAULT_CHAIN.rpcUrl);
}

function getUsdcContract(signerOrProvider: JsonRpcSigner | JsonRpcProvider): Contract {
  if (!USDC_ADDRESS) {
    throw new Error('USDC address is not configured. Set NEXT_PUBLIC_USDC_ADDRESS.');
  }
  return new Contract(USDC_ADDRESS, ERC20_ABI, signerOrProvider);
}

// ===========================================
// Read Functions
// ===========================================

/**
 * Get farm details from the contract
 */
/**
 * Check if farm can claim reward
 */
export async function checkClaimEligibility(
  signer: JsonRpcSigner,
  farmId: string
): Promise<ClaimEligibility> {
  try {
    const contract = getRewardsContract(signer);
    const [canClaim, reason] = await contract.canClaimReward(farmId);
    return { canClaim, reason };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return { canClaim: false, reason: 'Error checking eligibility' };
  }
}

/**
 * Get estimated reward for a farm
 */
export async function getEstimatedReward(
  signer: JsonRpcSigner,
  areaHectares: number
): Promise<EstimatedReward> {
  try {
    const contract = getRewardsContract(signer);
    const scaledArea = Math.round(areaHectares * 100);
    const [usdc, thb] = await contract.getEstimatedReward(scaledArea);
    return { usdc, thb };
  } catch (error) {
    console.error('Error getting estimated reward:', error);
    return { usdc: BigInt(0), thb: BigInt(0) };
  }
}

/**
 * Get USDC balance
 */
export async function getUsdcBalance(
  signer: JsonRpcSigner,
  address: string
): Promise<bigint> {
  try {
    const contract = getUsdcContract(signer);
    return await contract.balanceOf(address);
  } catch (error) {
    console.error('Error getting USDC balance:', error);
    return BigInt(0);
  }
}

/**
 * Get reward per hectare
 */
export async function getRewardPerHectare(signer: JsonRpcSigner): Promise<bigint> {
  try {
    const contract = getRewardsContract(signer);
    return await contract.rewardPerHectare();
  } catch (error) {
    console.error('Error getting reward rate:', error);
    return BigInt(0);
  }
}

// ===========================================
// Write Functions
// ===========================================

/**
 * Register a farm on-chain
 */
/**
 * Submit zkTLS proof on-chain
 */
/**
 * Claim reward for a farm
 */
export async function claimReward(
  signer: JsonRpcSigner,
  params: {
    farmId: string;
    areaHectares: number;
    proofHash: string;
    signature: string;
    noBurningDetected: boolean;
  },
  chainId: number
): Promise<TransactionResult> {
  try {
    const contract = getRewardsContract(signer);
    const areaScaled = Math.round(params.areaHectares * 100);
    const proofHashBytes = params.proofHash.startsWith('0x')
      ? params.proofHash
      : keccak256(toUtf8Bytes(params.proofHash));

    const tx = await contract.claimReward(
      params.farmId,
      areaScaled,
      proofHashBytes,
      params.signature,
      params.noBurningDetected
    );
    // Get transaction hash immediately (tx.hash is available right after sending)
    const txHash = tx.hash;
    console.log('[Contract] Claim transaction sent, hash:', txHash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('[Contract] Claim transaction confirmed, block:', receipt.blockNumber);
    
    // Use tx.hash (same as receipt.hash but more reliable)
    return {
      success: true,
      txHash: txHash,
      explorerUrl: getExplorerTxUrl(txHash, chainId),
    };
  } catch (error: unknown) {
    const err = error as Error;
    
    // Parse common revert reasons
    let errorMessage = err.message || 'Claim failed';
    if (errorMessage.includes('AlreadyClaimedThisYear')) {
      errorMessage = 'You have already claimed your reward for this year.';
    } else if (errorMessage.includes('NoProofAvailable')) {
      errorMessage = 'No zkTLS proof found. Please generate a proof first.';
    } else if (errorMessage.includes('BurningDetected')) {
      errorMessage = 'Burning was detected. You are not eligible for the reward.';
    } else if (errorMessage.includes('ProofNotVerified')) {
      errorMessage = 'zkTLS proof verification failed.';
    } else if (errorMessage.includes('FarmNotRegistered')) {
      errorMessage = 'This farm is not registered on-chain.';
    } else if (errorMessage.includes('InsufficientContractBalance')) {
      errorMessage = 'Contract has insufficient funds. Please contact support.';
    }
    
    return {
      success: false,
      txHash: '',
      explorerUrl: '',
      error: errorMessage,
    };
  }
}

// ===========================================
// Helper Functions
// ===========================================

/**
 * Check if contract is deployed and accessible
 */
export async function isContractDeployed(): Promise<boolean> {
  try {
    const address = REWARDS_CONTRACT_ADDRESS;
    console.log('[Web3] Checking contract at:', address);
    
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      console.log('[Web3] Contract address is missing');
      return false;
    }
    
    const provider = getReadProvider();
    const contract = getRewardsContract(provider);
    const year = await contract.currentSeasonYear();
    console.log('[Web3] Contract is live, season year:', year.toString());
    return true;
  } catch (error) {
    console.error('[Web3] Contract check failed:', error);
    return false;
  }
}

/**
 * Check if farm is registered on-chain
 */
// No farm registration in simplified flow.

/**
 * Format proof hash from attestation data
 */
export function formatProofHash(attestationHash: string): string {
  if (attestationHash.startsWith('0x') && attestationHash.length === 66) {
    return attestationHash;
  }
  return keccak256(toUtf8Bytes(attestationHash));
}
