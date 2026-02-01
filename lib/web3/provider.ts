/**
 * Wallet Connection Provider
 * 
 * Multi-wallet EIP-1193 connection supporting MetaMask, Rabby, and other compatible wallets.
 */

import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { BASE_SEPOLIA, isValidChain, getChainConfig } from './config';

// ===========================================
// Types
// ===========================================

export type WalletType = 'metamask' | 'rabby' | 'coinbase' | 'trust' | 'unknown';

export interface WalletInfo {
  type: WalletType;
  name: string;
  icon: string;
  provider: EIP1193Provider;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  isCorrectChain: boolean;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  walletType: WalletType | null;
  walletName: string | null;
}

export interface WalletError {
  code: number;
  message: string;
}

interface EIP1193Provider {
  isMetaMask?: boolean;
  isRabby?: boolean;
  isCoinbaseWallet?: boolean;
  isTrust?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
}

// ===========================================
// Wallet Detection
// ===========================================

declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      providers?: EIP1193Provider[];
    };
  }
}

// Store the currently selected provider
let selectedProvider: EIP1193Provider | null = null;
let selectedWalletType: WalletType | null = null;

export function isWalletInstalled(): boolean {
  const hasWindow = typeof window !== 'undefined';
  const hasEthereum = hasWindow && !!window.ethereum;
  console.log('[Wallet] isWalletInstalled check:', { hasWindow, hasEthereum });
  if (hasEthereum) {
    console.log('[Wallet] window.ethereum:', {
      isMetaMask: window.ethereum?.isMetaMask,
      isRabby: window.ethereum?.isRabby,
      isCoinbaseWallet: window.ethereum?.isCoinbaseWallet,
      isTrust: window.ethereum?.isTrust,
      hasProviders: !!window.ethereum?.providers,
      providersCount: window.ethereum?.providers?.length,
    });
  }
  return hasEthereum;
}

export function isMetaMask(): boolean {
  return isWalletInstalled() && !!window.ethereum?.isMetaMask;
}

export function isRabby(): boolean {
  return isWalletInstalled() && !!window.ethereum?.isRabby;
}

/**
 * Detect wallet type from provider
 * Note: Check order matters - more specific wallets (Rabby) before generic ones (MetaMask)
 * because some wallets set isMetaMask=true for compatibility
 */
function detectWalletType(provider: EIP1193Provider): { type: WalletType; name: string } {
  // Check Rabby first - it may also set isMetaMask for compatibility
  if (provider.isRabby) {
    return { type: 'rabby', name: 'Rabby' };
  }
  if (provider.isCoinbaseWallet) {
    return { type: 'coinbase', name: 'Coinbase Wallet' };
  }
  if (provider.isTrust) {
    return { type: 'trust', name: 'Trust Wallet' };
  }
  // Check MetaMask last since other wallets might also set isMetaMask
  if (provider.isMetaMask) {
    return { type: 'metamask', name: 'MetaMask' };
  }
  return { type: 'unknown', name: 'Browser Wallet' };
}

/**
 * Get all available wallet providers
 */
export function getAvailableWallets(): WalletInfo[] {
  console.log('[Wallet] getAvailableWallets called');
  
  if (!isWalletInstalled()) {
    console.log('[Wallet] No wallet installed, returning empty array');
    return [];
  }

  const wallets: WalletInfo[] = [];
  const seen = new Set<WalletType>();

  try {
    // Check for multiple providers (when multiple wallets are installed)
    // Both MetaMask and Rabby may register in the providers array
    console.log('[Wallet] Checking for providers array:', {
      hasProviders: !!window.ethereum?.providers,
      isArray: Array.isArray(window.ethereum?.providers),
      length: window.ethereum?.providers?.length,
    });
    
    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      console.log('[Wallet] Found providers array, iterating...');
      for (let i = 0; i < window.ethereum.providers.length; i++) {
        const provider = window.ethereum.providers[i];
        console.log(`[Wallet] Provider ${i}:`, {
          isMetaMask: provider.isMetaMask,
          isRabby: provider.isRabby,
          isCoinbaseWallet: provider.isCoinbaseWallet,
          isTrust: provider.isTrust,
        });
        const { type, name } = detectWalletType(provider);
        console.log(`[Wallet] Provider ${i} detected as:`, { type, name });
        if (!seen.has(type)) {
          seen.add(type);
          wallets.push({
            type,
            name,
            icon: getWalletIcon(type),
            provider,
          });
        }
      }
    }
    
    // If no providers array or empty, use the main ethereum object
    if (wallets.length === 0 && window.ethereum) {
      console.log('[Wallet] No providers array, using main window.ethereum');
      const { type, name } = detectWalletType(window.ethereum);
      console.log('[Wallet] Main ethereum detected as:', { type, name });
      wallets.push({
        type,
        name,
        icon: getWalletIcon(type),
        provider: window.ethereum,
      });
    }
  } catch (error) {
    console.error('[Wallet] Error detecting wallets:', error);
    // Fallback: return the main ethereum provider if available
    if (window.ethereum) {
      console.log('[Wallet] Using fallback provider');
      return [{
        type: 'unknown',
        name: 'Browser Wallet',
        icon: '👛',
        provider: window.ethereum,
      }];
    }
  }

  console.log('[Wallet] Final wallets list:', wallets.map(w => ({ type: w.type, name: w.name })));
  return wallets;
}

/**
 * Get wallet icon (emoji for simplicity, could be replaced with actual icons)
 */
function getWalletIcon(type: WalletType): string {
  switch (type) {
    case 'metamask': return '🦊';
    case 'rabby': return '🐰';
    case 'coinbase': return '🔵';
    case 'trust': return '🛡️';
    default: return '👛';
  }
}

/**
 * Get the currently selected provider or default
 */
function getProvider(): EIP1193Provider | null {
  if (selectedProvider) {
    return selectedProvider;
  }
  return window.ethereum || null;
}

// ===========================================
// Connection Functions
// ===========================================

/**
 * Connect to a specific wallet or the default available wallet
 */
export async function connectWallet(walletType?: WalletType): Promise<WalletState> {
  console.log('[Wallet] connectWallet called with walletType:', walletType);
  
  if (!isWalletInstalled()) {
    throw new Error('No wallet detected. Please install a Web3 wallet like MetaMask or Rabby.');
  }

  // Small delay to let other browser extensions (like Solana wallets) settle
  // This prevents race conditions with content scripts
  console.log('[Wallet] Waiting 100ms for extensions to settle...');
  await new Promise(resolve => setTimeout(resolve, 100));
  console.log('[Wallet] Wait complete');

  // Find the requested wallet provider
  let targetProvider: EIP1193Provider | null = null;
  let targetType: WalletType = 'unknown';
  let targetName: string = 'Browser Wallet';

  try {
    if (walletType) {
      console.log('[Wallet] Looking for specific wallet type:', walletType);
      const wallets = getAvailableWallets();
      const wallet = wallets.find(w => w.type === walletType);
      if (wallet) {
        console.log('[Wallet] Found requested wallet:', wallet.name);
        targetProvider = wallet.provider;
        targetType = wallet.type;
        targetName = wallet.name;
      } else {
        console.log('[Wallet] Requested wallet not found');
        throw new Error(`${walletType} wallet not found. Please make sure it's installed and enabled.`);
      }
    } else {
      // Use first available wallet
      console.log('[Wallet] No specific wallet requested, getting available wallets...');
      const wallets = getAvailableWallets();
      if (wallets.length > 0) {
        console.log('[Wallet] Using first available wallet:', wallets[0].name);
        targetProvider = wallets[0].provider;
        targetType = wallets[0].type;
        targetName = wallets[0].name;
      } else {
        console.log('[Wallet] No wallets found, using window.ethereum directly');
        targetProvider = window.ethereum || null;
      }
    }
  } catch (error) {
    console.warn('[Wallet] Error finding provider, using default:', error);
    targetProvider = window.ethereum || null;
  }

  console.log('[Wallet] Target provider selected:', {
    hasProvider: !!targetProvider,
    type: targetType,
    name: targetName,
  });

  if (!targetProvider) {
    throw new Error('No wallet provider available.');
  }
  
  console.log('[Wallet] Provider details:', {
    isMetaMask: targetProvider.isMetaMask,
    isRabby: targetProvider.isRabby,
    hasRequest: typeof targetProvider.request === 'function',
  });

  try {
    console.log('[Wallet] ========== STARTING CONNECTION ==========');
    console.log('[Wallet] Requesting accounts from', targetName);
    console.log('[Wallet] Calling eth_requestAccounts...');
    console.log('[Wallet] This should trigger the wallet popup. If no popup appears, the wallet may be locked or the extension may not be responding.');
    
    // Request account access with timeout
    // The wallet popup should appear - if it doesn't, the request will hang
    const accountsPromise = targetProvider.request({
      method: 'eth_requestAccounts',
    });
    
    console.log('[Wallet] eth_requestAccounts promise created, waiting for response...');
    
    // Add a timeout to detect hung connections
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Connection timeout. Please check your ${targetName} wallet - you may need to open it manually and approve the connection.`));
      }, 30000); // 30 second timeout
    });
    
    const accounts = await Promise.race([accountsPromise, timeoutPromise]) as string[];

    console.log('[Wallet] ========== GOT RESPONSE ==========');
    console.log('[Wallet] Got accounts:', accounts);

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock your wallet.');
    }

    // Get chain ID
    console.log('[Wallet] Getting chain ID...');
    const chainIdHex = await targetProvider.request({
      method: 'eth_chainId',
    }) as string;
    const chainId = parseInt(chainIdHex, 16);
    console.log('[Wallet] Chain ID:', chainId);

    // Store the selected provider
    selectedProvider = targetProvider;
    selectedWalletType = targetType;

    // Create ethers provider and signer
    console.log('[Wallet] Creating ethers provider...');
    const provider = new BrowserProvider(targetProvider);
    const signer = await provider.getSigner();
    console.log('[Wallet] Signer created');

    return {
      isConnected: true,
      address: accounts[0],
      chainId,
      isCorrectChain: isValidChain(chainId),
      provider,
      signer,
      walletType: targetType,
      walletName: targetName,
    };
  } catch (error: unknown) {
    console.error('[Wallet] Connection error:', error);
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
  selectedProvider = null;
  selectedWalletType = null;
  return {
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectChain: false,
    provider: null,
    signer: null,
    walletType: null,
    walletName: null,
  };
}

/**
 * Get current wallet state without prompting connection
 */
export async function getWalletState(): Promise<WalletState> {
  const provider = getProvider();
  if (!provider) {
    return disconnectWallet();
  }

  try {
    const accounts = await provider.request({
      method: 'eth_accounts',
    }) as string[];

    if (!accounts || accounts.length === 0) {
      return disconnectWallet();
    }

    const chainIdHex = await provider.request({
      method: 'eth_chainId',
    }) as string;
    const chainId = parseInt(chainIdHex, 16);

    const { type, name } = detectWalletType(provider);
    const ethersProvider = new BrowserProvider(provider);
    const signer = await ethersProvider.getSigner();

    return {
      isConnected: true,
      address: accounts[0],
      chainId,
      isCorrectChain: isValidChain(chainId),
      provider: ethersProvider,
      signer,
      walletType: selectedWalletType || type,
      walletName: name,
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
  const provider = getProvider();
  if (!provider) {
    throw new Error('No wallet connected');
  }

  const targetChain = BASE_SEPOLIA;

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: targetChain.chainIdHex }],
    });
    return true;
  } catch (error: unknown) {
    const walletError = error as WalletError;
    // Chain not added to wallet - try to add it
    if (walletError.code === 4902) {
      try {
        await provider.request({
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
  const provider = getProvider();
  if (!provider) {
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

  provider.on('accountsChanged', handleAccountsChanged);
  provider.on('chainChanged', handleChainChanged);

  // Return cleanup function
  return () => {
    provider.removeListener('accountsChanged', handleAccountsChanged);
    provider.removeListener('chainChanged', handleChainChanged);
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
