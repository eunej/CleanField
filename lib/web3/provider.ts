/**
 * Wallet Connection Provider
 * 
 * Minimal EIP-1193 wallet connection for MetaMask and compatible wallets.
 */

import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { BASE_SEPOLIA, DEFAULT_CHAIN, isValidChain, getChainConfig } from './config';

// ===========================================
// Types
// ===========================================

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCorrectChain: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
}

export interface WalletError {
  code: number;
  message: string;
}

// ===========================================
// Wallet Detection
// ===========================================

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

export function isWalletInstalled(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export function isMetaMask(): boolean {
  return isWalletInstalled() && !!window.ethereum?.isMetaMask;
}

// ===========================================
// Connection Functions
// ===========================================

/**
 * Connect to MetaMask or compatible wallet
 */
export async function connectWallet(): Promise<WalletState> {
  if (!isWalletInstalled()) {
    throw new Error('No wallet detected. Please install MetaMask.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts',
    }) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock your wallet.');
    }

    // Get chain ID
    const chainIdHex = await window.ethereum!.request({
      method: 'eth_chainId',
    }) as string;
    const chainId = parseInt(chainIdHex, 16);

    // Create ethers provider and signer
    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();

    return {
      isConnected: true,
      address: accounts[0],
      chainId,
    isCorrectChain: isValidChain(chainId),
      provider,
      signer,
    };
  } catch (error: unknown) {
    const walletError = error as WalletError;
    if (walletError.code === 4001) {
      throw new Error('Connection rejected. Please approve the connection request.');
    }
    throw error;
  }
}

/**
 * Disconnect wallet (clear local state only, can't force disconnect)
 */
export function disconnectWallet(): WalletState {
  return {
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectChain: false,
    provider: null,
    signer: null,
  };
}

/**
 * Get current wallet state without prompting connection
 */
export async function getWalletState(): Promise<WalletState> {
  if (!isWalletInstalled()) {
    return disconnectWallet();
  }

  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_accounts',
    }) as string[];

    if (!accounts || accounts.length === 0) {
      return disconnectWallet();
    }

    const chainIdHex = await window.ethereum!.request({
      method: 'eth_chainId',
    }) as string;
    const chainId = parseInt(chainIdHex, 16);

    const provider = new BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();

    return {
      isConnected: true,
      address: accounts[0],
      chainId,
    isCorrectChain: isValidChain(chainId),
      provider,
      signer,
    };
  } catch {
    return disconnectWallet();
  }
}

// ===========================================
// Chain Switching
// ===========================================

/**
 * Switch to Base Sepolia network
 */
export async function switchToBase(): Promise<boolean> {
  if (!isWalletInstalled()) {
    throw new Error('No wallet detected');
  }

  const targetChain = BASE_SEPOLIA;

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChain.chainIdHex }],
    });
    return true;
  } catch (error: unknown) {
    const walletError = error as WalletError;
    // Chain not added to wallet - try to add it
    if (walletError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: targetChain.chainIdHex,
            chainName: targetChain.name,
            nativeCurrency: targetChain.nativeCurrency,
            rpcUrls: [targetChain.rpcUrl],
            blockExplorerUrls: [targetChain.blockExplorer],
          }],
        });
        return true;
      } catch {
        throw new Error(`Failed to add ${targetChain.name} network`);
      }
    }
    throw new Error(`Failed to switch to ${targetChain.name}`);
  }
}

// ===========================================
// Event Listeners
// ===========================================

type WalletEventCallback = (state: WalletState) => void;

/**
 * Subscribe to wallet events (account/chain changes)
 */
export function subscribeToWalletEvents(callback: WalletEventCallback): () => void {
  if (!isWalletInstalled()) {
    return () => {};
  }

  const handleAccountsChanged = async (accounts: unknown) => {
    const accountsArray = accounts as string[];
    if (accountsArray.length === 0) {
      callback(disconnectWallet());
    } else {
      const state = await getWalletState();
      callback(state);
    }
  };

  const handleChainChanged = async () => {
    const state = await getWalletState();
    callback(state);
  };

  window.ethereum!.on('accountsChanged', handleAccountsChanged);
  window.ethereum!.on('chainChanged', handleChainChanged);

  // Return cleanup function
  return () => {
    window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum!.removeListener('chainChanged', handleChainChanged);
  };
}

// ===========================================
// Utility
// ===========================================

export function getChainName(chainId: number | null): string {
  if (!chainId) return 'Not Connected';
  const config = getChainConfig(chainId);
  return config?.name || `Chain ${chainId}`;
}
