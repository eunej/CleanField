/**
 * Clean Air Incentive Payment Service
 * 
 * Handles THB payments to farmers after zkTLS proof verification.
 * Reward: THB 5,000 per hectare per year for maintaining clean air practices.
 */

import {
  PaymentConfig,
  ClaimRequest,
  ClaimResult,
  PaymentRecord,
  FarmPaymentHistory,
} from './types';
import { MOCK_FARMS } from '@/lib/data/mockData';

// Payment Configuration
const PAYMENT_CONFIG: PaymentConfig = {
  contractAddress: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT || '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
  oracleContractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT || '0x0000000000000000000000000000000000000000',
  rewardPerHectare: 5000, // THB 5,000 per hectare per year
  currency: 'THB',
  claimPeriodDays: 365, // yearly claim
  network: 'sepolia',
};

/**
 * Calculate reward amount based on farm area
 */
export function calculateRewardAmount(farmId: string): number {
  const farm = MOCK_FARMS.find(f => f.id === farmId);
  if (!farm) return 0;
  // Reward = THB 5,000 × farm area (in hectares)
  return Math.round(PAYMENT_CONFIG.rewardPerHectare * farm.area);
}

// In-memory storage for demo (would be database in production)
const paymentRecords: Map<string, PaymentRecord[]> = new Map();
const lastClaimDates: Map<string, string> = new Map();

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
  nextClaimDate?: string;
  daysUntilNextClaim?: number;
} {
  // Check 1: Proof must show no burning
  if (!noBurningDetected) {
    return {
      isEligible: false,
      reason: 'Burning detected in zkTLS proof. Farm is not eligible for clean air incentive.',
    };
  }

  // Check 2: Proof must be verified
  if (!proofVerified) {
    return {
      isEligible: false,
      reason: 'zkTLS proof verification failed. Please generate a new attestation.',
    };
  }

  // Check 3: Must wait for claim period since last claim
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
        nextClaimDate: nextClaimDate.toISOString(),
        daysUntilNextClaim,
      };
    }
  }

  return {
    isEligible: true,
    reason: 'Farm is eligible for clean air incentive payment.',
    lastClaimDate: lastClaim,
    nextClaimDate: lastClaim 
      ? new Date(new Date(lastClaim).getTime() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined,
  };
}

/**
 * Process a clean air incentive claim
 * 
 * This function:
 * 1. Verifies the claim eligibility
 * 2. Simulates the USDT transfer (would be real in production)
 * 3. Records the payment
 */
export async function processClaimReward(
  request: ClaimRequest
): Promise<ClaimResult> {
  const { farmId, walletAddress, attestationId, proofHash, noBurningDetected, timestamp } = request;

  // Check eligibility
  const eligibility = checkClaimEligibility(farmId, noBurningDetected, true);

  if (!eligibility.isEligible) {
    return {
      success: false,
      farmId,
      walletAddress,
      amount: 0,
      currency: 'USDT',
      status: 'ineligible',
      message: eligibility.reason,
      eligibility: {
        isEligible: false,
        reason: eligibility.reason,
        noBurningDetected,
        proofVerified: true,
        lastClaimDate: eligibility.lastClaimDate,
        nextClaimDate: eligibility.nextClaimDate,
      },
    };
  }

  try {
    // In production, this would:
    // 1. Submit proof to CleanFieldOracle contract
    // 2. Call claimReward() function
    // 3. Wait for transaction confirmation
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock transaction hash
    const txHash = generateMockTxHash();
    const now = new Date().toISOString();
    const rewardAmount = calculateRewardAmount(farmId);

    // Create payment record
    const payment: PaymentRecord = {
      id: `pay_${farmId}_${Date.now()}`,
      farmId,
      walletAddress,
      amount: rewardAmount,
      currency: PAYMENT_CONFIG.currency,
      txHash,
      status: 'completed',
      attestationId,
      proofHash,
      createdAt: now,
      completedAt: now,
    };

    // Store payment record
    const farmPayments = paymentRecords.get(farmId) || [];
    farmPayments.push(payment);
    paymentRecords.set(farmId, farmPayments);

    // Update last claim date
    lastClaimDates.set(farmId, now);

    return {
      success: true,
      farmId,
      walletAddress,
      amount: rewardAmount,
      currency: PAYMENT_CONFIG.currency,
      txHash,
      status: 'completed',
      message: `Successfully transferred ฿${rewardAmount.toLocaleString()} to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      claimedAt: now,
      eligibility: {
        isEligible: true,
        reason: 'Claim processed successfully',
        noBurningDetected: true,
        proofVerified: true,
        lastClaimDate: now,
        nextClaimDate: new Date(Date.now() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      farmId,
      walletAddress,
      amount: 0,
      currency: 'USDT',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment processing failed',
      eligibility: {
        isEligible: true,
        reason: 'Eligible but payment failed',
        noBurningDetected,
        proofVerified: true,
      },
    };
  }
}

/**
 * Get payment history for a farm
 */
export function getFarmPaymentHistory(farmId: string): FarmPaymentHistory {
  const payments = paymentRecords.get(farmId) || [];
  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalClaimed = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  return {
    farmId,
    totalClaimed,
    totalPayments: completedPayments.length,
    lastClaimDate: lastClaimDates.get(farmId),
    payments,
  };
}

/**
 * Get payment configuration (public info)
 */
export function getPaymentConfig() {
  return {
    paymentContract: PAYMENT_CONFIG.contractAddress,
    oracleContract: PAYMENT_CONFIG.oracleContractAddress,
    rewardPerHectare: PAYMENT_CONFIG.rewardPerHectare,
    currency: PAYMENT_CONFIG.currency,
    claimPeriodDays: PAYMENT_CONFIG.claimPeriodDays,
    network: PAYMENT_CONFIG.network,
  };
}

/**
 * Estimate gas for claim transaction
 */
export function estimateClaimGas(): {
  gasLimit: string;
  estimatedCostEth: string;
  estimatedCostUsd: string;
} {
  // Mock gas estimation
  return {
    gasLimit: '150000',
    estimatedCostEth: '0.003',
    estimatedCostUsd: '$7.50',
  };
}

/**
 * Get all pending claims
 */
export function getPendingClaims(): PaymentRecord[] {
  const allPending: PaymentRecord[] = [];
  paymentRecords.forEach(payments => {
    payments.filter(p => p.status === 'pending').forEach(p => allPending.push(p));
  });
  return allPending;
}

/**
 * Get total distributed rewards
 */
export function getTotalDistributed(): {
  totalAmount: number;
  totalClaims: number;
  uniqueFarms: number;
} {
  let totalAmount = 0;
  let totalClaims = 0;
  const uniqueFarms = new Set<string>();

  paymentRecords.forEach((payments, farmId) => {
    const completed = payments.filter(p => p.status === 'completed');
    if (completed.length > 0) {
      uniqueFarms.add(farmId);
      totalClaims += completed.length;
      totalAmount += completed.reduce((sum, p) => sum + p.amount, 0);
    }
  });

  return {
    totalAmount,
    totalClaims,
    uniqueFarms: uniqueFarms.size,
  };
}
