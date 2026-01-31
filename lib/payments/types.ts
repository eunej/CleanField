// Payment Types for Clean Air Incentive System
// Updated for Base network and USDC

export interface PaymentConfig {
  contractAddress: string;
  oracleContractAddress: string;
  verifierContractAddress: string;
  usdcAddress: string;
  rewardPerHectareTHB: number; // THB per hectare per year (e.g., 5000)
  rewardPerHectareUSDC: number; // USDC per hectare per year (e.g., 140)
  thbToUsdcRate: number; // THB per USDC (e.g., 35)
  currency: 'USDC' | 'THB';
  claimPeriodDays: number; // 365 days (yearly)
  network: 'base' | 'base-sepolia';
  chainId: number;
}

export interface ClaimRequest {
  farmId: string;
  walletAddress: string;
  attestationId: string;
  proofHash: string;
  signature?: string; // For on-chain verification
  noBurningDetected: boolean;
  timestamp: number;
}

export interface ClaimResult {
  success: boolean;
  farmId: string;
  walletAddress: string;
  amount: number;
  amountUSDC?: number;
  amountTHB?: number;
  currency: string;
  txHash?: string;
  explorerUrl?: string;
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
    lastClaimYear?: number;
    currentYear?: number;
  };
}

export interface PaymentRecord {
  id: string;
  farmId: string;
  walletAddress: string;
  amount: number;
  amountUSDC?: number;
  currency: string;
  txHash: string;
  explorerUrl?: string;
  status: 'pending' | 'completed' | 'failed';
  attestationId: string;
  proofHash: string;
  createdAt: string;
  completedAt?: string;
  year?: number;
}

export interface FarmPaymentHistory {
  farmId: string;
  totalClaimed: number;
  totalClaimedUSDC?: number;
  totalPayments: number;
  lastClaimDate?: string;
  lastClaimYear?: number;
  payments: PaymentRecord[];
}

// Smart Contract Types
export interface SmartContractConfig {
  address: string;
  abi: unknown[];
  network: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export interface OnChainProof {
  farmId: string;
  proofHash: string;
  signature?: string;
  noBurningDetected: boolean;
  verified: boolean;
  timestamp: number;
}

export interface OnChainFarm {
  owner: string;
  farmId: string;
  gistdaId: string;
  areaHectares: number;
  lastClaimTime: number;
  lastClaimYear: number;
  totalClaimed: number;
  isRegistered: boolean;
  isActive: boolean;
}

// Reward calculation helpers
export interface RewardEstimate {
  areaHectares: number;
  rewardUSDC: number;
  rewardTHB: number;
  rate: {
    perHectareUSDC: number;
    perHectareTHB: number;
    thbToUsdcRate: number;
  };
}
