/**
 * Web3 Configuration for CleanField
 * 
 * Chain: Base Sepolia (testnet only)
 * Token: USDC
 */

// ===========================================
// Chain Configuration
// ===========================================

export const BASE_SEPOLIA = {
  chainId: 84532,
  chainIdHex: '0x14a34',
  name: 'Base Sepolia',
  rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  blockExplorer: 'https://sepolia.basescan.org',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
} as const;

// Base Sepolia only
export const DEFAULT_CHAIN = BASE_SEPOLIA;

// ===========================================
// Contract Addresses
// ===========================================

// USDC address (must be provided via env)
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_ADDRESS || '';

// CleanField Rewards Contract (must be provided via env)
export const REWARDS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_REWARDS_CONTRACT || '';

// zkTLS Verifier Contract (optional, set via env)
export const VERIFIER_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_VERIFIER_CONTRACT || '';

// ===========================================
// Contract ABIs
// ===========================================

// CleanFieldRewards contract ABI (relevant functions only)
export const REWARDS_CONTRACT_ABI = [
  // Read functions
  'function canClaimReward(string _farmId) external view returns (bool canClaim, string reason)',
  'function calculateReward(uint256 _areaHectares) external view returns (uint256)',
  'function getEstimatedReward(uint256 _areaHectares) external view returns (uint256 usdc, uint256 thb)',
  'function rewardPerHectare() external view returns (uint256)',
  'function currentSeasonYear() external view returns (uint256)',
  'function requireOnChainVerification() external view returns (bool)',
  'function getClaimState(string _farmId) external view returns (tuple(uint256 lastClaimTime, uint256 lastClaimYear, uint256 totalClaimed))',
  
  // Write functions
  'function claimReward(string _farmId, uint256 _areaHectares, bytes32 _proofHash, bytes _signature, bool _noBurningDetected) external',
  
  // Events
  'event FarmRegistered(string indexed farmId, address indexed owner, string gistdaId, uint256 areaHectares)',
  'event ProofSubmitted(string indexed farmId, bytes32 proofHash, bool noBurningDetected, bool verified)',
  'event RewardClaimed(string indexed farmId, address indexed owner, uint256 amount, uint256 year)',
] as const;

// ERC20 ABI for USDC balance checks
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
] as const;

// ===========================================
// Helper Functions
// ===========================================

export function getChainConfig(chainId: number) {
  if (chainId === BASE_SEPOLIA.chainId) return BASE_SEPOLIA;
  return null;
}

export function getExplorerTxUrl(txHash: string, chainId: number = DEFAULT_CHAIN.chainId): string {
  const chain = getChainConfig(chainId) || DEFAULT_CHAIN;
  return `${chain.blockExplorer}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string, chainId: number = DEFAULT_CHAIN.chainId): string {
  const chain = getChainConfig(chainId) || DEFAULT_CHAIN;
  return `${chain.blockExplorer}/address/${address}`;
}

export function isValidChain(chainId: number): boolean {
  return chainId === BASE_SEPOLIA.chainId;
}

export function formatUSDC(amount: bigint): string {
  // USDC has 6 decimals
  const decimals = 6;
  const value = Number(amount) / Math.pow(10, decimals);
  return value.toLocaleString('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
