// Payment Types for Clean Air Incentive System

export interface PaymentConfig {
  contractAddress: string;
  oracleContractAddress: string;
  rewardPerHectare: number; // THB per hectare per year (e.g., 5000)
  currency: string; // THB
  claimPeriodDays: number; // e.g., 365 days (yearly)
  network: 'sepolia' | 'mainnet';
}

export interface ClaimRequest {
  farmId: string;
  walletAddress: string;
  attestationId: string;
  proofHash: string;
  noBurningDetected: boolean;
  timestamp: number;
}

export interface ClaimResult {
  success: boolean;
  farmId: string;
  walletAddress: string;
  amount: number;
  currency: string;
  txHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'ineligible';
  message: string;
  claimedAt?: string;
  eligibility: {
    isEligible: boolean;
    reason: string;
    noBurningDetected: boolean;
    proofVerified: boolean;
    lastClaimDate?: string;
    nextClaimDate?: string;
  };
}

export interface PaymentRecord {
  id: string;
  farmId: string;
  walletAddress: string;
  amount: number;
  currency: string;
  txHash: string;
  status: 'pending' | 'completed' | 'failed';
  attestationId: string;
  proofHash: string;
  createdAt: string;
  completedAt?: string;
}

export interface FarmPaymentHistory {
  farmId: string;
  totalClaimed: number;
  totalPayments: number;
  lastClaimDate?: string;
  payments: PaymentRecord[];
}

// Smart Contract Types
export interface SmartContractConfig {
  address: string;
  abi: unknown[];
  network: string;
  rpcUrl: string;
}

export interface OnChainProof {
  farmId: string;
  proofHash: string;
  noBurningDetected: boolean;
  timestamp: number;
}
