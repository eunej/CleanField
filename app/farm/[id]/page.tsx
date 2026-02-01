'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Farm, InsurancePayment } from '@/lib/types/farm';
import {
  isWalletInstalled,
  connectWallet,
  disconnectWallet,
  getWalletState,
  switchToBase,
  subscribeToWalletEvents,
  getChainName,
  formatAddress,
  formatUSDC,
  getExplorerTxUrl,
  DEFAULT_CHAIN,
  type WalletState,
} from '@/lib/web3';
import {
  claimReward as claimRewardOnChain,
  isContractDeployed,
  formatProofHash,
  type TransactionResult,
} from '@/lib/web3/contracts';

interface VerificationResult {
  success: boolean;
  farmId: string;
  farmName: string;
  location: { lat: number; lng: number };
  verification?: {
    hotspotsDetected: number;
    noBurningDetected: boolean;
    eligible: boolean;
    checkDate: string;
    proofHash: string;
    hotspots: Array<{
      objectId: number;
      latitude: number;
      longitude: number;
      acqDate: string;
      confidence: string;
      brightness: number;
      luName: string;
    }>;
  };
  error?: string;
}

interface ZkTLSAttestationResult {
  success: boolean;
  farmId: string;
  farmName: string;
  owner: string;
  attestation?: {
    id: string;
    timestamp: number;
    data: {
      farmId: string;
      gistdaId: string;
      noBurningDetected: boolean;
      hotspotsCount: number;
      checkDate: string;
      location: { lat: number; lng: number };
    };
    proof: {
      hash: string;
      signature: string;
      attestorPublicKey: string;
    };
  };
  verification?: {
    verified: boolean;
    error?: string;
  };
  onChainData?: {
    farmId: string;
    proofHash: string;
    noBurningDetected: boolean;
    timestamp: number;
  };
  config?: {
    appId: string;
    templateId: string;
    mode: string;
  };
  error?: string;
}

interface ClaimResult {
  success: boolean;
  farmId: string;
  walletAddress: string;
  amount: number;
  currency: string;
  txHash?: string;
  explorerUrl?: string;
  status: string;
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
  config?: {
    rewardPerHectare: number;
    currency: string;
    claimPeriodDays: number;
    network: string;
  };
}

export default function FarmOwnerPage() {
  const params = useParams();
  const farmId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [payments, setPayments] = useState<InsurancePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [zkTLSAttesting, setZkTLSAttesting] = useState(false);
  const [zkTLSResult, setZkTLSResult] = useState<ZkTLSAttestationResult | null>(null);
  const [showAttestationJson, setShowAttestationJson] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimResult, setClaimResult] = useState<ClaimResult | null>(null);
  
  // Wallet state
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isCorrectChain: false,
    provider: null,
    signer: null,
  });
  const [walletError, setWalletError] = useState<string | null>(null);
  const [contractReady, setContractReady] = useState(false);
  const [claimStep, setClaimStep] = useState<string>('');

  // Delay rendering until mounted to avoid hydration mismatch from browser extensions
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check wallet state on mount
  useEffect(() => {
    const checkWallet = async () => {
      if (isWalletInstalled()) {
        const state = await getWalletState();
        setWallet(state);

        if (state.chainId) {
          console.log('[Wallet] Connected chainId:', state.chainId);
          console.log('[Wallet] Chain details:', getChainName(state.chainId));
        }
        
        // Check if contract is deployed
        if (state.signer) {
          const deployed = await isContractDeployed();
          setContractReady(deployed);
          
        }
      }
    };
    checkWallet();
  }, [farmId]);

  // Subscribe to wallet events
  useEffect(() => {
    const unsubscribe = subscribeToWalletEvents(async (state) => {
      setWallet(state);
      if (state.chainId) {
        console.log('[Wallet] Chain changed:', state.chainId);
        console.log('[Wallet] Chain details:', getChainName(state.chainId));
      }
      if (state.signer) {
        const deployed = await isContractDeployed();
        setContractReady(deployed);
        
      }
    });
    return unsubscribe;
  }, [farmId]);

  useEffect(() => {
    fetchFarmData();
  }, [farmId]);

  const fetchFarmData = async () => {
    try {
      const response = await fetch(`/api/farms/${farmId}`);
      const data = await response.json();
      setFarm(data.farm);
      setPayments(data.payments);
    } catch (error) {
      console.error('Error fetching farm data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    setWalletError(null);
    try {
      const state = await connectWallet();
      setWallet(state);
      
      if (state.signer) {
        const deployed = await isContractDeployed();
        setContractReady(deployed);
      }
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Failed to connect wallet');
    }
  };

  const handleDisconnectWallet = () => {
    setWallet(disconnectWallet());
    setContractReady(false);
  };

  const handleSwitchNetwork = async () => {
    setWalletError(null);
    try {
      await switchToBase(); // Base Sepolia only
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Failed to switch network');
    }
  };

  const verifyWithGISTDA = async () => {
    setVerifying(true);
    setVerificationResult(null);
    
    try {
      const response = await fetch(`/api/farms/${farmId}/verify`, {
        method: 'POST',
      });
      const data: VerificationResult = await response.json();
      setVerificationResult(data);
    } catch (error) {
      console.error('Error verifying with GISTDA:', error);
      setVerificationResult({
        success: false,
        farmId,
        farmName: farm?.name || '',
        location: farm?.location || { lat: 0, lng: 0 },
        error: 'Failed to connect to verification service',
      });
    } finally {
      setVerifying(false);
    }
  };

  const createZkTLSAttestation = async () => {
    setZkTLSAttesting(true);
    setZkTLSResult(null);
    setClaimResult(null);
    
    try {
      const response = await fetch('/api/zktls/attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmId,
          userAddress: wallet.address || farm?.walletAddress || '0x0000000000000000000000000000000000000000',
        }),
      });
      const data: ZkTLSAttestationResult = await response.json();
      setZkTLSResult(data);
    } catch (error) {
      console.error('Error creating zkTLS attestation:', error);
      setZkTLSResult({
        success: false,
        farmId,
        farmName: farm?.name || '',
        owner: farm?.owner || '',
        error: 'Failed to connect to zkTLS service',
      });
    } finally {
      setZkTLSAttesting(false);
    }
  };

  // Proof submission is now included in the single-step claim.

  // Full on-chain claim flow: register -> submit proof -> claim
  const handleClaimOnChain = useCallback(async () => {
    if (!wallet.signer || !wallet.chainId || !farm || !zkTLSResult?.attestation) {
      setWalletError('Missing required data for on-chain claim');
      return;
    }

    setClaiming(true);
    setClaimResult(null);
    setWalletError(null);
    
    // Clear any previous transaction hashes to avoid confusion
    console.log('[Claim] Starting claim flow for farm:', farmId);

    try {
      // Single-step claim
      setClaimStep('Claiming reward...');
      console.log('[Claim] Claiming reward for farm:', farmId);
      
      const claimResult: TransactionResult = await claimRewardOnChain(
        wallet.signer,
        {
          farmId,
          areaHectares: farm.area,
          proofHash: formatProofHash(zkTLSResult.attestation.proof.hash),
          signature: zkTLSResult.attestation.proof.signature,
          noBurningDetected: zkTLSResult.attestation.data.noBurningDetected,
        },
        wallet.chainId
      );

      const rewardAmount = Math.round(farm.area * 140); // ~$140 USDC per hectare

      if (claimResult.success && claimResult.txHash) {
        console.log('[Claim] ✅ Claim successful! Transaction hash:', claimResult.txHash);
        setClaimStep('');
        setClaimResult({
          success: true,
          farmId,
          walletAddress: wallet.address || '',
          amount: rewardAmount,
          currency: 'USDC',
          txHash: claimResult.txHash, // Ensure we use the claim transaction hash
          explorerUrl: claimResult.explorerUrl,
          status: 'completed',
          message: `Successfully claimed ${formatUSDC(BigInt(rewardAmount * 1_000_000))}`,
          claimedAt: new Date().toISOString(),
          eligibility: {
            isEligible: true,
            reason: 'Claim processed successfully',
            noBurningDetected: true,
            proofVerified: true,
            lastClaimDate: new Date().toISOString(),
            nextClaimDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
        });
        fetchFarmData();
      } else {
        throw new Error(claimResult.error || 'Claim transaction failed');
      }
    } catch (error) {
      console.error('[Claim] Error:', error);
      setClaimStep('');
      setClaimResult({
        success: false,
        farmId,
        walletAddress: wallet.address || '',
        amount: 0,
        currency: 'USDC',
        status: 'failed',
        message: error instanceof Error ? error.message : 'Claim failed',
        eligibility: {
          isEligible: false,
          reason: error instanceof Error ? error.message : 'Transaction failed',
          noBurningDetected: false,
          proofVerified: false,
        },
      });
    } finally {
      setClaiming(false);
      setClaimStep('');
    }
  }, [wallet.signer, wallet.chainId, wallet.address, farmId, farm, zkTLSResult]);

  // Return null before mounting to avoid hydration mismatch from browser extensions
  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Farm Not Found</h1>
          <p className="text-gray-600">Unable to load farm information</p>
        </div>
      </div>
    );
  }

  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalEarned = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  // Check if can claim
  const hasValidProof = zkTLSResult?.success && 
                        zkTLSResult?.attestation?.data.noBurningDetected && 
                        zkTLSResult?.verification?.verified;
  
  const canClaimOnChain = hasValidProof && 
                          wallet.isConnected && 
                          wallet.isCorrectChain && 
                          contractReady &&
                          !claiming;
  
  // Estimated reward in USDC
  const estimatedRewardUSDC = farm ? Math.round(farm.area * 140) : 0;
  const estimatedRewardTHB = farm ? Math.round(farm.area * 5000) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4 pb-8">
      <div className="max-w-md mx-auto pt-6">
        
        {/* Wallet Connection Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${wallet.isConnected ? (wallet.isCorrectChain ? 'bg-green-500' : 'bg-yellow-500') : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {wallet.isConnected ? getChainName(wallet.chainId) : 'Not Connected'}
              </span>
            </div>
            
            {!wallet.isConnected ? (
              <button
                onClick={handleConnectWallet}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                {!wallet.isCorrectChain && (
                  <button
                    onClick={handleSwitchNetwork}
                    className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600"
                  >
                    Switch to Base
                  </button>
                )}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-3 py-1.5">
                  <span className="text-xs font-mono text-gray-700">{formatAddress(wallet.address!)}</span>
                  <button onClick={handleDisconnectWallet} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {walletError && (
            <p className="mt-2 text-xs text-red-600">{walletError}</p>
          )}
          
          {!isWalletInstalled() && (
            <p className="mt-2 text-xs text-gray-500">
              <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Install MetaMask
              </a> to claim rewards on-chain
            </p>
          )}
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{farm.name}</h1>
                <p className="text-sm text-gray-500">{farm.owner}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              farm.hasBurning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {farm.hasBurning ? '⚠️ Alert' : '✓ Clean'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Farm Area</p>
              <p className="text-2xl font-bold text-gray-800">{farm.area} ha</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Incidents</p>
              <p className={`text-2xl font-bold ${farm.burningIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {farm.burningIncidents}
              </p>
            </div>
          </div>

          {/* Location Info */}
          <div className="mt-4 bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-600 font-semibold mb-1">Farm Location</p>
            <p className="text-sm text-blue-800 font-mono">
              {farm.location.lat.toFixed(4)}°N, {farm.location.lng.toFixed(4)}°E
            </p>
          </div>
        </div>

        {/* zkTLS Verification & Claim Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-2 mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Clean Air Incentive</h3>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Generate a zkTLS proof and claim your annual reward in a single on-chain transaction.
          </p>
          
          {/* Reward Estimate */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4 border border-green-200">
            <p className="text-xs text-green-700 mb-1">Estimated Annual Reward</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-green-800">${estimatedRewardUSDC} USDC</span>
              <span className="text-sm text-green-600">(≈฿{estimatedRewardTHB.toLocaleString()})</span>
            </div>
          </div>

          {/* Step 1: Generate Proof */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                zkTLSResult?.success ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                {zkTLSResult?.success ? '✓' : '1'}
              </div>
              <span className="text-sm font-semibold text-gray-700">Generate zkTLS Proof</span>
            </div>
            <button
              onClick={createZkTLSAttestation}
              disabled={zkTLSAttesting}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                zkTLSAttesting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : zkTLSResult?.success
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              } shadow-lg`}
            >
              {zkTLSAttesting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Attestation...
                </span>
              ) : zkTLSResult?.success ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Proof Generated - Regenerate
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Generate zkTLS Proof
                </span>
              )}
            </button>
          </div>

          {/* zkTLS Result */}
          {zkTLSResult && (
            <div className={`mb-4 rounded-xl p-3 ${
              zkTLSResult.error 
                ? 'bg-yellow-50 border border-yellow-200'
                : zkTLSResult.attestation?.data.noBurningDetected
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              {zkTLSResult.error ? (
                <p className="text-sm text-yellow-700">{zkTLSResult.error}</p>
              ) : zkTLSResult.attestation?.data.noBurningDetected ? (
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-bold text-green-800 text-sm">No Burning Detected - Eligible!</span>
                  </div>
                  <button
                    onClick={() => setShowAttestationJson(!showAttestationJson)}
                    className="flex items-center text-xs text-green-700 hover:text-green-900 font-medium mt-2"
                  >
                    <svg 
                      className={`w-4 h-4 mr-1 transition-transform ${showAttestationJson ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showAttestationJson ? 'Hide' : 'Show'} Full Attestation JSON
                  </button>
                  {showAttestationJson && (
                    <div className="mt-2 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                      <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-all">
{JSON.stringify({
  attestationId: zkTLSResult.attestation.id,
  timestamp: zkTLSResult.attestation.timestamp,
  data: zkTLSResult.attestation.data,
  proof: zkTLSResult.attestation.proof,
  verification: zkTLSResult.verification,
  onChainData: zkTLSResult.onChainData,
  config: zkTLSResult.config,
}, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-bold text-red-800 text-sm">Burning Detected - Not Eligible</span>
                  </div>
                  <button
                    onClick={() => setShowAttestationJson(!showAttestationJson)}
                    className="flex items-center text-xs text-red-700 hover:text-red-900 font-medium mt-2"
                  >
                    <svg 
                      className={`w-4 h-4 mr-1 transition-transform ${showAttestationJson ? 'rotate-90' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {showAttestationJson ? 'Hide' : 'Show'} Full Attestation JSON
                  </button>
                  {showAttestationJson && zkTLSResult.attestation && (
                    <div className="mt-2 p-3 bg-gray-900 rounded-lg overflow-x-auto">
                      <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap break-all">
{JSON.stringify({
  attestationId: zkTLSResult.attestation.id,
  timestamp: zkTLSResult.attestation.timestamp,
  data: zkTLSResult.attestation.data,
  proof: zkTLSResult.attestation.proof,
  verification: zkTLSResult.verification,
  onChainData: zkTLSResult.onChainData,
  config: zkTLSResult.config,
}, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Claim Reward */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                claimResult?.success ? 'bg-green-500 text-white' : 'bg-purple-100 text-purple-700'
              }`}>
                {claimResult?.success ? '✓' : '2'}
              </div>
              <span className="text-sm font-semibold text-gray-700">Claim USDC Reward</span>
            </div>
            
            <button
              onClick={handleClaimOnChain}
              disabled={!canClaimOnChain}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                !canClaimOnChain
                  ? 'bg-gray-300 cursor-not-allowed'
                  : claiming
                  ? 'bg-yellow-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              } shadow-lg`}
            >
              {claiming ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {claimStep || 'Processing On-Chain...'}
                </span>
              ) : claimResult?.success ? (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Claimed Successfully!
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Claim ${estimatedRewardUSDC} USDC On-Chain
                </span>
              )}
            </button>
            
            {!hasValidProof && !zkTLSResult && (
              <p className="text-xs text-gray-500 mt-2 text-center">Generate zkTLS proof first to claim reward</p>
            )}
            {zkTLSResult && !zkTLSResult.attestation?.data.noBurningDetected && (
              <p className="text-xs text-red-500 mt-2 text-center">Not eligible - burning detected in proof</p>
            )}
            {!wallet.isConnected && hasValidProof && (
              <p className="text-xs text-blue-600 mt-2 text-center">Connect wallet for on-chain claiming</p>
            )}
            {wallet.isConnected && !wallet.isCorrectChain && (
              <p className="text-xs text-yellow-600 mt-2 text-center">Switch to Base network for on-chain claiming</p>
            )}
            {wallet.isConnected && wallet.isCorrectChain && !contractReady && (
              <p className="text-xs text-yellow-600 mt-2 text-center">On-chain contract not detected. Restart the app or check `NEXT_PUBLIC_REWARDS_CONTRACT`.</p>
            )}
          </div>

          {/* Claim Result */}
          {claimResult && (
            <div className={`rounded-xl p-4 ${
              claimResult.success 
                ? 'bg-green-50 border-2 border-green-200'
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              {claimResult.success ? (
                <>
                  <div className="flex items-center mb-3">
                    <div className="bg-green-500 rounded-full p-2 mr-3">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-green-800">Payment Successful!</p>
                      <p className="text-2xl font-bold text-green-900">{claimResult.amount} {claimResult.currency}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    {claimResult.txHash && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-500">Transaction Hash</p>
                        <a 
                          href={claimResult.explorerUrl || getExplorerTxUrl(claimResult.txHash, wallet.chainId || DEFAULT_CHAIN.chainId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono text-xs break-all"
                        >
                          {claimResult.txHash}
                        </a>
                      </div>
                    )}
                    <div className="bg-white rounded-lg p-2">
                      <p className="text-xs text-gray-500">Sent To</p>
                      <p className="font-mono text-xs text-gray-700">{claimResult.walletAddress}</p>
                    </div>
                    {claimResult.eligibility.nextClaimDate && (
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-gray-500">Next Claim Available</p>
                        <p className="text-sm text-gray-700">
                          {new Date(claimResult.eligibility.nextClaimDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center mb-2">
                    <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold text-red-800">Claim Failed</span>
                  </div>
                  <p className="text-sm text-red-700">{claimResult.message}</p>
                  <p className="text-xs text-red-600 mt-2">{claimResult.eligibility.reason}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* GISTDA Direct Check Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">GISTDA Direct Check</h3>
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={verifyWithGISTDA}
            disabled={verifying}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              verifying
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {verifying ? 'Checking...' : 'Check GISTDA Satellite Data'}
          </button>

          {verificationResult && (
            <div className={`mt-3 rounded-xl p-3 ${
              verificationResult.error 
                ? 'bg-yellow-50 border border-yellow-200'
                : verificationResult.verification?.noBurningDetected
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-semibold ${
                verificationResult.error ? 'text-yellow-700' :
                verificationResult.verification?.noBurningDetected ? 'text-green-700' : 'text-red-700'
              }`}>
                {verificationResult.error || 
                 (verificationResult.verification?.noBurningDetected 
                   ? '✓ No hotspots detected' 
                   : `⚠️ ${verificationResult.verification?.hotspotsDetected} hotspot(s) found`)}
              </p>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className={`rounded-3xl shadow-2xl p-6 mb-6 ${
          farm.hasBurning
            ? 'bg-gradient-to-br from-red-500 to-orange-500'
            : 'bg-gradient-to-br from-green-500 to-teal-500'
        }`}>
          <div className="text-center text-white">
            {farm.hasBurning ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-xl font-bold mb-2">Burning Detected</h2>
                <p className="text-sm opacity-90">Your farm has {farm.burningIncidents} incident(s) this period</p>
                <p className="text-xs opacity-75 mt-2">Not eligible for rewards this year</p>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-xl font-bold mb-2">Clean Air Status</h2>
                <p className="text-sm opacity-90">No burning detected this period</p>
                <p className="text-xs opacity-75 mt-2">Eligible for clean air incentive</p>
              </>
            )}
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Rewards</h3>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Earned</p>
            <p className="text-4xl font-bold">฿{totalEarned.toLocaleString()}</p>
            <p className="text-xs opacity-75 mt-2">{completedPayments.length} payment(s) received</p>
          </div>

          {pendingPayments.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 mb-4 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Pending Reward</p>
                  <p className="text-2xl font-bold text-blue-900">฿{pendingPayments[0].amount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-200 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-700 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Payment History */}
        {completedPayments.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
            <div className="space-y-3">
              {completedPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">฿{payment.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {payment.txHash && (
                    <a
                      href={getExplorerTxUrl(payment.txHash, wallet.chainId || DEFAULT_CHAIN.chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4">
          <p className="text-xs text-white opacity-75 mb-1">
            {wallet.isConnected ? 'Connected Wallet' : 'Farm Wallet'}
          </p>
          <p className="text-sm font-mono text-white break-all">
            {wallet.isConnected ? wallet.address : farm.walletAddress}
          </p>
        </div>
      </div>
    </div>
  );
}
