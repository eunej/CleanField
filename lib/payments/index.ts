/**
 * Clean Air Incentive Payment System
 * 
 * This module handles THB payments to farmers who submit valid
 * zkTLS proofs showing no burning detected.
 * Reward: THB 5,000 per hectare per year.
 */

export * from './types';
export * from './paymentService';

// Re-export main functions
export {
  processClaimReward,
  checkClaimEligibility,
  getFarmPaymentHistory,
  getPaymentConfig,
  estimateClaimGas,
  getPendingClaims,
  getTotalDistributed,
  calculateRewardAmount,
} from './paymentService';
