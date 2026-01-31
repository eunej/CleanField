/**
 * Mock Primus zkTLS Server
 * 
 * Simulates the Primus Network's server-side zkTLS attestation flow.
 * This is used for development and hackathon demos when the real
 * Primus SDK is not configured.
 * 
 * Based on Primus zkTLS Enterprise Backend Integration:
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview/
 * 
 * Integration Type: SERVER-SIDE (Backend Integration)
 * - No browser extension required
 * - Server initiates verification
 * - Suitable for batch processing and automated verification
 */

import { FARM_MOCK_RESPONSES, generateMockResponse, MockGISTDAResponse } from '@/lib/gistda/mockData';
import { AttestationResult, VerificationResult } from './types';
import crypto from 'crypto';

// ============================================
// Mock Primus Configuration
// ============================================
export interface MockPrimusConfig {
  appId: string;
  appSecret: string;
  templateId: string;
  mode: 'proxytls' | 'mpctls';
  attestorNodeUrl: string;
  network: 'testnet' | 'mainnet';
}

const MOCK_CONFIG: MockPrimusConfig = {
  appId: process.env.NEXT_PUBLIC_PRIMUS_APP_ID || 'demo_cleanfield_app',
  appSecret: process.env.PRIMUS_APP_SECRET || 'demo_secret_key_for_testing',
  templateId: process.env.NEXT_PUBLIC_PRIMUS_TEMPLATE_ID || 'gistda_hotspot_verification_v1',
  mode: 'proxytls',
  attestorNodeUrl: 'https://mock-attestor.primuslabs.xyz',
  network: 'testnet',
};

// ============================================
// Mock Attestor Keys (Simulated Primus Node)
// ============================================
const MOCK_ATTESTOR = {
  nodeId: 'attestor_node_cleanfield_001',
  publicKey: '0x04a8b7c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
  network: 'Primus AlphaNet',
  version: '2.1.0',
};

// ============================================
// Cryptographic Helper Functions
// ============================================

/**
 * Generate a deterministic hash for attestation data
 */
function generateAttestationHash(data: Record<string, unknown>): string {
  const jsonStr = JSON.stringify(data, Object.keys(data).sort());
  const hash = crypto.createHash('sha256').update(jsonStr).digest('hex');
  return '0x' + hash;
}

/**
 * Generate a mock ECDSA signature
 * In production, this would be signed by the Primus attestor node
 */
function generateMockSignature(proofHash: string, timestamp: number): string {
  const message = `${proofHash}:${timestamp}:${MOCK_CONFIG.appId}`;
  const sig = crypto.createHash('sha512').update(message).digest('hex');
  return '0x' + sig;
}

/**
 * Generate attestation ID
 */
function generateAttestationId(farmId: string, timestamp: number): string {
  const prefix = 'att';
  const hash = crypto.createHash('md5').update(`${farmId}:${timestamp}`).digest('hex').substring(0, 12);
  return `${prefix}_${hash}_${timestamp}`;
}

// ============================================
// Mock Server-Side Attestation Flow
// ============================================

export interface AttestationRequest {
  farmId: string;
  gistdaId: string;
  latitude: number;
  longitude: number;
  userAddress: string;
  templateId?: string;
  mode?: 'proxytls' | 'mpctls';
}

export interface ServerAttestationResponse {
  success: boolean;
  attestation: AttestationResult | null;
  primusMetadata: {
    attestorNodeId: string;
    attestorPublicKey: string;
    network: string;
    sdkVersion: string;
    mode: 'proxytls' | 'mpctls';
    templateId: string;
    isMock: boolean;
  };
  error?: string;
}

/**
 * Query mock GISTDA data for a farm
 */
async function queryMockGISTDA(
  farmId: string,
  latitude: number,
  longitude: number
): Promise<MockGISTDAResponse> {
  // Simulate network delay (50-200ms)
  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));
  
  // Check if we have predefined data for this farm
  if (FARM_MOCK_RESPONSES[farmId]) {
    return FARM_MOCK_RESPONSES[farmId];
  }
  
  // Generate dynamic response based on coordinates
  // Use a simple heuristic: northern Thailand (lat > 17) has more burning
  const noBurning = latitude < 17 || Math.random() > 0.3;
  return generateMockResponse(farmId, latitude, longitude, noBurning);
}

/**
 * Create a server-side zkTLS attestation
 * 
 * This simulates the Primus backend integration flow:
 * 1. Server requests attestation from Primus attestor node
 * 2. Attestor fetches data from GISTDA via TLS
 * 3. Attestor generates zkTLS proof
 * 4. Server receives signed attestation
 */
export async function createServerAttestation(
  request: AttestationRequest
): Promise<ServerAttestationResponse> {
  const timestamp = Date.now();
  const templateId = request.templateId || MOCK_CONFIG.templateId;
  const mode = request.mode || MOCK_CONFIG.mode;
  
  try {
    // Step 1: Query GISTDA data (simulated via TLS)
    console.log(`[Mock Primus] Querying GISTDA for farm ${request.farmId}...`);
    const gistdaData = await queryMockGISTDA(
      request.farmId,
      request.latitude,
      request.longitude
    );
    
    // Step 2: Verify the TLS response (mock verification)
    console.log(`[Mock Primus] Verifying TLS response...`);
    if (!gistdaData.success && gistdaData.result.totalHotspots === -1) {
      return {
        success: false,
        attestation: null,
        primusMetadata: {
          attestorNodeId: MOCK_ATTESTOR.nodeId,
          attestorPublicKey: MOCK_ATTESTOR.publicKey,
          network: MOCK_ATTESTOR.network,
          sdkVersion: MOCK_ATTESTOR.version,
          mode,
          templateId,
          isMock: true,
        },
        error: 'GISTDA data unavailable for verification',
      };
    }
    
    // Step 3: Generate attestation data
    const attestationData = {
      farmId: request.farmId,
      gistdaId: request.gistdaId,
      noBurningDetected: gistdaData.result.noBurningDetected,
      hotspotsCount: gistdaData.result.totalHotspots,
      checkDate: new Date(timestamp).toISOString(),
      location: {
        lat: request.latitude,
        lng: request.longitude,
      },
      verificationHash: gistdaData.result.verificationHash,
      templateId,
      mode,
    };
    
    // Step 4: Generate zkTLS proof
    console.log(`[Mock Primus] Generating zkTLS proof...`);
    const proofHash = generateAttestationHash({
      ...attestationData,
      userAddress: request.userAddress,
      appId: MOCK_CONFIG.appId,
      timestamp,
    });
    
    // Step 5: Sign the attestation
    const signature = generateMockSignature(proofHash, timestamp);
    const attestationId = generateAttestationId(request.farmId, timestamp);
    
    // Step 6: Create attestation result
    const attestation: AttestationResult = {
      success: true,
      attestationId,
      timestamp,
      data: {
        farmId: request.farmId,
        gistdaId: request.gistdaId,
        noBurningDetected: gistdaData.result.noBurningDetected,
        hotspotsCount: gistdaData.result.totalHotspots,
        checkDate: attestationData.checkDate,
        location: attestationData.location,
      },
      proof: {
        hash: proofHash,
        signature,
        attestorPublicKey: MOCK_ATTESTOR.publicKey,
      },
      rawResponse: {
        gistda: gistdaData,
        confidenceBreakdown: gistdaData.result.confidenceBreakdown,
      },
      usedPrimusSDK: false, // This is mock
    };
    
    console.log(`[Mock Primus] Attestation created: ${attestationId}`);
    
    return {
      success: true,
      attestation,
      primusMetadata: {
        attestorNodeId: MOCK_ATTESTOR.nodeId,
        attestorPublicKey: MOCK_ATTESTOR.publicKey,
        network: MOCK_ATTESTOR.network,
        sdkVersion: MOCK_ATTESTOR.version,
        mode,
        templateId,
        isMock: true,
      },
    };
  } catch (error) {
    console.error('[Mock Primus] Attestation error:', error);
    return {
      success: false,
      attestation: null,
      primusMetadata: {
        attestorNodeId: MOCK_ATTESTOR.nodeId,
        attestorPublicKey: MOCK_ATTESTOR.publicKey,
        network: MOCK_ATTESTOR.network,
        sdkVersion: MOCK_ATTESTOR.version,
        mode,
        templateId,
        isMock: true,
      },
      error: error instanceof Error ? error.message : 'Attestation failed',
    };
  }
}

/**
 * Verify a mock attestation
 * 
 * In production, this would verify:
 * 1. Signature matches attestor public key
 * 2. Proof hash is valid
 * 3. Attestation is not expired
 * 4. Template ID matches
 */
export async function verifyServerAttestation(
  attestation: AttestationResult
): Promise<VerificationResult> {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 20 + Math.random() * 50));
  
  try {
    // Check attestation exists and was successful
    if (!attestation || !attestation.success) {
      return {
        verified: false,
        attestation: null,
        error: 'Invalid attestation',
      };
    }
    
    // Check attestation is not expired (24 hours)
    const maxAge = 24 * 60 * 60 * 1000;
    const age = Date.now() - attestation.timestamp;
    if (age > maxAge) {
      return {
        verified: false,
        attestation,
        error: 'Attestation expired (older than 24 hours)',
      };
    }
    
    // Verify proof hash (mock verification)
    if (!attestation.proof.hash || !attestation.proof.hash.startsWith('0x')) {
      return {
        verified: false,
        attestation,
        error: 'Invalid proof hash format',
      };
    }
    
    // Verify signature exists
    if (!attestation.proof.signature || attestation.proof.signature.length < 64) {
      return {
        verified: false,
        attestation,
        error: 'Invalid signature',
      };
    }
    
    // Mock: Verify attestor public key matches
    if (attestation.proof.attestorPublicKey !== MOCK_ATTESTOR.publicKey) {
      // Allow demo attestor keys
      if (!attestation.proof.attestorPublicKey.startsWith('primus_attestor')) {
        console.warn('[Mock Primus] Attestor key mismatch, allowing for demo');
      }
    }
    
    return {
      verified: true,
      attestation,
    };
  } catch (error) {
    return {
      verified: false,
      attestation: null,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Batch attestation for multiple farms
 */
export async function createBatchAttestations(
  requests: AttestationRequest[]
): Promise<ServerAttestationResponse[]> {
  console.log(`[Mock Primus] Creating batch attestations for ${requests.length} farms...`);
  
  // Process in parallel with concurrency limit
  const concurrencyLimit = 5;
  const results: ServerAttestationResponse[] = [];
  
  for (let i = 0; i < requests.length; i += concurrencyLimit) {
    const batch = requests.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(
      batch.map(request => createServerAttestation(request))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Get mock server configuration (without secrets)
 */
export function getMockServerConfig() {
  return {
    appId: MOCK_CONFIG.appId,
    templateId: MOCK_CONFIG.templateId,
    mode: MOCK_CONFIG.mode,
    network: MOCK_CONFIG.network,
    attestorNodeUrl: MOCK_CONFIG.attestorNodeUrl,
    attestor: {
      nodeId: MOCK_ATTESTOR.nodeId,
      network: MOCK_ATTESTOR.network,
      version: MOCK_ATTESTOR.version,
    },
    isMock: true,
  };
}

/**
 * Format attestation for on-chain submission
 */
export function formatForSmartContract(attestation: AttestationResult): {
  farmId: string;
  proofHash: `0x${string}`;
  noBurningDetected: boolean;
  timestamp: number;
  signature: `0x${string}`;
} {
  return {
    farmId: attestation.data.farmId,
    proofHash: attestation.proof.hash as `0x${string}`,
    noBurningDetected: attestation.data.noBurningDetected,
    timestamp: attestation.timestamp,
    signature: attestation.proof.signature as `0x${string}`,
  };
}
