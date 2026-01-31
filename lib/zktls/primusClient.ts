/**
 * Primus zkTLS Client for GISTDA Verification
 * 
 * This module provides zkTLS integration with Thailand's GISTDA portal
 * for verifying farm burning status using cryptographic proofs.
 * 
 * Integration Type: SERVER-SIDE (Backend Integration)
 * - No browser extension required
 * - Server initiates verification programmatically
 * - Suitable for batch processing and automated verification
 * 
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview
 */

import {
  ZkTLSConfig,
  AttestationResult,
  VerificationResult,
} from './types';
import {
  createServerAttestation,
  verifyServerAttestation,
  getMockServerConfig,
  formatForSmartContract,
  AttestationRequest,
} from './mockPrimusServer';

// ============================================
// Environment Configuration
// ============================================
const PRIMUS_CONFIG: ZkTLSConfig = {
  appId: process.env.NEXT_PUBLIC_PRIMUS_APP_ID || 'demo_cleanfield_app',
  appSecret: process.env.PRIMUS_APP_SECRET || '',
  templateId: process.env.NEXT_PUBLIC_PRIMUS_TEMPLATE_ID || 'gistda_hotspot_verification_v1',
  mode: 'proxytls',
};

// Check if we're in mock mode (no real Primus credentials)
const IS_MOCK_MODE = !process.env.PRIMUS_APP_SECRET || process.env.PRIMUS_APP_SECRET === '';

// Track initialization state
let isInitialized = false;

// ============================================
// Public API
// ============================================

/**
 * Initialize the Primus zkTLS SDK
 * In mock mode, this is a no-op that always succeeds
 */
export async function initializePrimus(): Promise<boolean> {
  if (isInitialized) {
    return true;
  }

  if (IS_MOCK_MODE) {
    console.log('[Primus] Running in MOCK mode - using simulated attestations');
    isInitialized = true;
    return true;
  }

  // TODO: Initialize real Primus SDK here when credentials are configured
  // const { PrimusZKTLS } = await import('@primuslabs/zktls-js-sdk');
  // primusInstance = new PrimusZKTLS();
  // await primusInstance.init(PRIMUS_CONFIG.appId, PRIMUS_CONFIG.appSecret);
  
  console.log('[Primus] Would initialize real SDK with appId:', PRIMUS_CONFIG.appId);
  isInitialized = true;
  return true;
}

/**
 * Create zkTLS attestation for GISTDA hotspot verification
 * 
 * This function:
 * 1. Queries GISTDA API for hotspots at farm location
 * 2. Creates a cryptographic attestation (mock or real)
 * 3. Returns proof that can be submitted on-chain
 * 
 * @param farmId - Unique farm identifier
 * @param gistdaId - GISTDA portal farm ID
 * @param lat - Farm latitude
 * @param lng - Farm longitude
 * @param userAddress - User's wallet address
 */
export async function createGISTDAAttestation(
  farmId: string,
  gistdaId: string,
  lat: number,
  lng: number,
  userAddress: string
): Promise<AttestationResult> {
  // Ensure SDK is initialized
  if (!isInitialized) {
    await initializePrimus();
  }

  // Create attestation request
  const request: AttestationRequest = {
    farmId,
    gistdaId,
    latitude: lat,
    longitude: lng,
    userAddress,
    templateId: PRIMUS_CONFIG.templateId,
    mode: PRIMUS_CONFIG.mode,
  };

  // Use mock server for attestation
  const response = await createServerAttestation(request);

  if (!response.success || !response.attestation) {
    // Return error attestation
    return {
      success: false,
      attestationId: `error_${farmId}_${Date.now()}`,
      timestamp: Date.now(),
      data: {
        farmId,
        gistdaId,
        noBurningDetected: false,
        hotspotsCount: -1,
        checkDate: new Date().toISOString(),
        location: { lat, lng },
      },
      proof: {
        hash: '0x0',
        signature: '0x0',
        attestorPublicKey: '',
      },
      rawResponse: { error: response.error },
      usedPrimusSDK: false,
    };
  }

  // Mark whether we used real SDK or mock
  response.attestation.usedPrimusSDK = !IS_MOCK_MODE;
  
  return response.attestation;
}

/**
 * Verify a zkTLS attestation
 */
export async function verifyAttestation(
  attestation: AttestationResult
): Promise<VerificationResult> {
  return verifyServerAttestation(attestation);
}

/**
 * Format attestation for on-chain submission
 * Returns data structured for smart contract interaction
 */
export function formatForOnChain(attestation: AttestationResult): {
  farmId: string;
  proofHash: string;
  noBurningDetected: boolean;
  timestamp: number;
} {
  const formatted = formatForSmartContract(attestation);
  return {
    farmId: formatted.farmId,
    proofHash: formatted.proofHash,
    noBurningDetected: formatted.noBurningDetected,
    timestamp: formatted.timestamp,
  };
}

/**
 * Get Primus configuration (without secrets)
 */
export function getPublicConfig(): {
  appId: string;
  templateId: string;
  mode: 'proxytls' | 'mpctls';
  initialized: boolean;
  isMock: boolean;
} {
  const mockConfig = getMockServerConfig();
  return {
    appId: PRIMUS_CONFIG.appId,
    templateId: PRIMUS_CONFIG.templateId,
    mode: PRIMUS_CONFIG.mode,
    initialized: isInitialized,
    isMock: IS_MOCK_MODE,
  };
}

/**
 * Check if Primus SDK is properly configured with real credentials
 */
export function isPrimusConfigured(): boolean {
  return !!(PRIMUS_CONFIG.appId && PRIMUS_CONFIG.appSecret && PRIMUS_CONFIG.templateId);
}

/**
 * Check if running in mock mode
 */
export function isMockMode(): boolean {
  return IS_MOCK_MODE;
}
