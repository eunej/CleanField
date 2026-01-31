/**
 * Clean Air Incentive Payment Service
 * 
 * Handles USDC payments to farmers on Base after zkTLS proof verification.
 * Reward: ฿5,000 THB (~$140 USDC) per hectare per year for maintaining clean air practices.
 * 
 * This service provides:
 * - Reward calculation (THB and USDC)
 * - Eligibility checking
 * - Payment configuration
 * - Demo/fallback payment processing (when contract not deployed)
 */

import {
  PaymentConfig,
  ClaimRequest,
  ClaimResult,
  PaymentRecord,
  FarmPaymentHistory,
  RewardEstimate,
} from './types';
import { MOCK_FARMS } from '@/lib/data/mockData';

// ===========================================
// Payment Configuration
// ===========================================

const PAYMENT_CONFIG: PaymentConfig = {
  contractAddress: process.env.NEXT_PUBLIC_REWARDS_CONTRACT || '',
  oracleContractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT || '',
  verifierContractAddress: process.env.NEXT_PUBLIC_VERIFIER_CONTRACT || '',
  usdcAddress: process.env.NEXT_PUBLIC_USDC_ADDRESS || '',
  rewardPerHectareTHB: 5000, // ฿5,000 per hectare per year
  rewardPerHectareUSDC: 140, // ~$140 USDC per hectare per year
  thbToUsdcRate: 35, // 35 THB = 1 USD (approximate)
  currency: 'USDC',
  claimPeriodDays: 365, // yearly claim
  network: 'base-sepolia',
  chainId: 84532,
};

// ===========================================
// Reward Calculation
// ===========================================

/**
 * Calculate reward amount based on farm area
 * @param farmId - Farm identifier
 * @returns Reward in the configured currency (USDC)
 */
export function calculateRewardAmount(farmId: string): number {
  const farm = MOCK_FARMS.find(f => f.id === farmId);
  if (!farm) return 0;
  
  // Reward = rewardPerHectareUSDC × farm area (in hectares)
  return Math.round(PAYMENT_CONFIG.rewardPerHectareUSDC * farm.area);
}

/**
 * Calculate reward estimate for a given area
 * @param areaHectares - Farm area in hectares
 * @returns Reward estimate in both USDC and THB
 */
export function calculateRewardEstimate(areaHectares: number): RewardEstimate {
  const rewardUSDC = Math.round(PAYMENT_CONFIG.rewardPerHectareUSDC * areaHectares);
  const rewardTHB = Math.round(PAYMENT_CONFIG.rewardPerHectareTHB * areaHectares);
  
  return {
    areaHectares,
    rewardUSDC,
    rewardTHB,
    rate: {
      perHectareUSDC: PAYMENT_CONFIG.rewardPerHectareUSDC,
      perHectareTHB: PAYMENT_CONFIG.rewardPerHectareTHB,
      thbToUsdcRate: PAYMENT_CONFIG.thbToUsdcRate,
    },
  };
}

/**
 * Get reward for a specific farm
 * @param farmId - Farm identifier
 * @returns Reward estimate or null if farm not found
 */
export function getFarmRewardEstimate(farmId: string): RewardEstimate | null {
  const farm = MOCK_FARMS.find(f => f.id === farmId);
  if (!farm) return null;
  
  return calculateRewardEstimate(farm.area);
}

// ===========================================
// In-memory storage for demo
// ===========================================

const paymentRecords: Map<string, PaymentRecord[]> = new Map();
const lastClaimDates: Map<string, string> = new Map();
const lastClaimYears: Map<string, number> = new Map();

/**
 * Get current calendar year
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Generate a mock transaction hash
 */
function generateMockTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

/**
 * Get explorer URL for a transaction
 */
function getExplorerUrl(txHash: string): string {
  const baseUrl = PAYMENT_CONFIG.network === 'base' 
    ? 'https://basescan.org'
    : 'https://sepolia.basescan.org';
  return `${baseUrl}/tx/${txHash}`;
}

// ===========================================
// Eligibility Checking
// ===========================================

/**
 * Check if a farm is eligible to claim reward
 */
export function checkClaimEligibility(
  farmId: string,
  noBurningDetected: boolean,
  proofVerified: boolean
): {
  isEligible: boolean;
  reason: string;
  lastClaimDate?: string;
  lastClaimYear?: number;
  currentYear?: number;
  nextClaimDate?: string;
  daysUntilNextClaim?: number;
} {
  const currentYear = getCurrentYear();
  
  // Check 1: Proof must show no burning
  if (!noBurningDetected) {
    return {
      isEligible: false,
      reason: 'Burning detected in zkTLS proof. Farm is not eligible for clean air incentive.',
      currentYear,
    };
  }

  // Check 2: Proof must be verified
  if (!proofVerified) {
    return {
      isEligible: false,
      reason: 'zkTLS proof verification failed. Please generate a new attestation.',
      currentYear,
    };
  }

  // Check 3: Must not have claimed this year
  const lastClaimYear = lastClaimYears.get(farmId);
  if (lastClaimYear && lastClaimYear >= currentYear) {
    return {
      isEligible: false,
      reason: `You have already claimed your reward for ${currentYear}. Next claim available in ${currentYear + 1}.`,
      lastClaimYear,
      currentYear,
    };
  }

  // Check 4: Must wait for claim period since last claim (extra safety)
  const lastClaim = lastClaimDates.get(farmId);
  if (lastClaim) {
    const lastClaimDate = new Date(lastClaim);
    const nextClaimDate = new Date(lastClaimDate);
    nextClaimDate.setDate(nextClaimDate.getDate() + PAYMENT_CONFIG.claimPeriodDays);
    
    const now = new Date();
    if (now < nextClaimDate) {
      const daysUntilNextClaim = Math.ceil((nextClaimDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isEligible: false,
        reason: `Must wait ${daysUntilNextClaim} more days before next claim. Claim period is ${PAYMENT_CONFIG.claimPeriodDays} days.`,
        lastClaimDate: lastClaim,
        lastClaimYear,
        currentYear,
        nextClaimDate: nextClaimDate.toISOString(),
        daysUntilNextClaim,
      };
    }
  }

  return {
    isEligible: true,
    reason: 'Farm is eligible for clean air incentive payment.',
    lastClaimDate: lastClaim,
    lastClaimYear,
    currentYear,
    nextClaimDate: lastClaim 
      ? new Date(new Date(lastClaim).getTime() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  };
}

// ===========================================
// Payment Processing (Demo/Fallback)
// ===========================================

/**
 * Process a clean air incentive claim (demo mode)
 * 
 * In production, this would be replaced by on-chain claiming via the smart contract.
 * This function provides a demo/fallback when the contract is not deployed.
 */
export async function processClaimReward(
  request: ClaimRequest
): Promise<ClaimResult> {
  const { farmId, walletAddress, attestationId, proofHash, noBurningDetected, timestamp } = request;
  const currentYear = getCurrentYear();

  // Check eligibility
  const eligibility = checkClaimEligibility(farmId, noBurningDetected, true);

  if (!eligibility.isEligible) {
    return {
      success: false,
      farmId,
      walletAddress,
      amount: 0,
      amountUSDC: 0,
      amountTHB: 0,
      currency: 'USDC',
      status: 'ineligible',
      message: eligibility.reason,
      eligibility: {
        isEligible: false,
        reason: eligibility.reason,
        noBurningDetected,
        proofVerified: true,
        lastClaimDate: eligibility.lastClaimDate,
        nextClaimDate: eligibility.nextClaimDate,
        lastClaimYear: eligibility.lastClaimYear,
        currentYear: eligibility.currentYear,
      },
    };
  }

  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock transaction hash
    const txHash = generateMockTxHash();
    const now = new Date().toISOString();
    
    // Calculate reward
    const estimate = getFarmRewardEstimate(farmId);
    const rewardAmountUSDC = estimate?.rewardUSDC || 0;
    const rewardAmountTHB = estimate?.rewardTHB || 0;

    // Create payment record
    const payment: PaymentRecord = {
      id: `pay_${farmId}_${Date.now()}`,
      farmId,
      walletAddress,
      amount: rewardAmountTHB, // Display in THB for legacy compatibility
      amountUSDC: rewardAmountUSDC,
      currency: 'THB', // Display currency
      txHash,
      explorerUrl: getExplorerUrl(txHash),
      status: 'completed',
      attestationId,
      proofHash,
      createdAt: now,
      completedAt: now,
      year: currentYear,
    };

    // Store payment record
    const farmPayments = paymentRecords.get(farmId) || [];
    farmPayments.push(payment);
    paymentRecords.set(farmId, farmPayments);

    // Update last claim tracking
    lastClaimDates.set(farmId, now);
    lastClaimYears.set(farmId, currentYear);

    return {
      success: true,
      farmId,
      walletAddress,
      amount: rewardAmountTHB,
      amountUSDC: rewardAmountUSDC,
      amountTHB: rewardAmountTHB,
      currency: 'THB',
      txHash,
      explorerUrl: getExplorerUrl(txHash),
      status: 'completed',
      message: `Successfully transferred ฿${rewardAmountTHB.toLocaleString()} (~$${rewardAmountUSDC} USDC) to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      claimedAt: now,
      eligibility: {
        isEligible: true,
        reason: 'Claim processed successfully',
        noBurningDetected: true,
        proofVerified: true,
        lastClaimDate: now,
        nextClaimDate: new Date(Date.now() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
        lastClaimYear: currentYear,
        currentYear,
      },
    };
  } catch (error) {
    return {
      success: false,
      farmId,
      walletAddress,
      amount: 0,
      amountUSDC: 0,
      amountTHB: 0,
      currency: 'USDC',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment processing failed',
      eligibility: {
        isEligible: true,
        reason: 'Eligible but payment failed',
        noBurningDetected,
        proofVerified: true,
        currentYear,
      },
    };
  }
}

// ===========================================
// Payment History
// ===========================================

/**
 * Get payment history for a farm
 */
export function getFarmPaymentHistory(farmId: string): FarmPaymentHistory {
  const payments = paymentRecords.get(farmId) || [];
  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalClaimed = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalClaimedUSDC = completedPayments.reduce((sum, p) => sum + (p.amountUSDC || 0), 0);

  return {
    farmId,
    totalClaimed,
    totalClaimedUSDC,
    totalPayments: completedPayments.length,
    lastClaimDate: lastClaimDates.get(farmId),
    lastClaimYear: lastClaimYears.get(farmId),
    payments,
  };
}

// ===========================================
// Configuration Getters
// ===========================================

/**
 * Get current payment configuration
 */
export function getPaymentConfig(): PaymentConfig {
  return { ...PAYMENT_CONFIG };
}

/**
 * Estimate gas for claim transaction (placeholder)
 */
export function estimateClaimGas(): {
  gasLimit: string;
  estimatedCostEth: string;
  estimatedCostUsd: string;
} {
  return {
    gasLimit: '150000',
    estimatedCostEth: '0.0003',
    estimatedCostUsd: '0.50',
  };
}

/**
 * Get total distributed rewards (across all farms)
 */
export function getTotalDistributed(): {
  totalTHB: number;
  totalUSDC: number;
  totalPayments: number;
  totalFarms: number;
} {
  let totalTHB = 0;
  let totalUSDC = 0;
  let totalPayments = 0;
  let totalFarms = 0;

  paymentRecords.forEach((payments) => {
    const completed = payments.filter(p => p.status === 'completed');
    if (completed.length > 0) {
      totalFarms++;
      completed.forEach(p => {
        totalTHB += p.amount;
        totalUSDC += p.amountUSDC || 0;
        totalPayments++;
      });
    }
  });

  return { totalTHB, totalUSDC, totalPayments, totalFarms };
}
