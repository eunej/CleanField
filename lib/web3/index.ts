/**
 * Web3 Module Exports
 */

// Configuration
export {
  BASE_SEPOLIA,
  DEFAULT_CHAIN,
  REWARDS_CONTRACT_ADDRESS,
  VERIFIER_CONTRACT_ADDRESS,
  USDC_ADDRESS,
  getChainConfig,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  isValidChain,
  formatUSDC,
  formatAddress,
} from './config';

// Provider/Wallet
export {
  isWalletInstalled,
  isMetaMask,
  connectWallet,
  disconnectWallet,
  getWalletState,
  switchToBase,
  subscribeToWalletEvents,
  getChainName,
  type WalletState,
} from './provider';

// Contracts
export {
  checkClaimEligibility,
  getEstimatedReward,
  getUsdcBalance,
  getRewardPerHectare,
  claimReward,
  isContractDeployed,
  formatProofHash,
  type ClaimEligibility,
  type EstimatedReward,
  type TransactionResult,
  type ProofSubmissionParams,
} from './contracts';
