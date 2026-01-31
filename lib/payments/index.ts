/**
 * Clean Air Incentive Payment System
 * 
 * This module handles USDC payments to farmers on Base who submit valid
 * zkTLS proofs showing no burning detected.
 * 
 * Reward: ฿5,000 THB (~$140 USDC) per hectare per year.
 */

export * from './types';
export * from './paymentService';

// Re-export main functions
export {
  // Reward calculation
  calculateRewardAmount,
  calculateRewardEstimate,
  getFarmRewardEstimate,
  
  // Eligibility
  checkClaimEligibility,
  
  // Payment processing (demo/fallback)
  processClaimReward,
  
  // History
  getFarmPaymentHistory,
  
  // Configuration
  getPaymentConfig,
  estimateClaimGas,
  getTotalDistributed,
} from './paymentService';
