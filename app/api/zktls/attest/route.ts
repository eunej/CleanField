import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import {
  initializePrimus,
  createGISTDAAttestation,
  verifyAttestation,
  formatForOnChain,
  getPublicConfig,
  isMockMode,
} from '@/lib/zktls';

/**
 * POST /api/zktls/attest
 * 
 * Create a zkTLS attestation for farm burning status verification
 * 
 * Integration Type: SERVER-SIDE (Backend Integration)
 * - No browser extension required
 * - Server initiates verification programmatically
 * 
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview
 * 
 * Request body:
 * - farmId: string - Farm identifier
 * - userAddress: string - User's wallet address (optional)
 * 
 * Response:
 * - attestation: Full attestation result
 * - verification: Verification status
 * - onChainData: Data formatted for smart contract submission
 */
export async function POST(request: Request) {
  try {
    // Initialize Primus zkTLS
    await initializePrimus();
    const mockMode = isMockMode();
    console.log(`[zkTLS] Mode: ${mockMode ? 'MOCK' : 'PRODUCTION'}`);

    const body = await request.json();
    const { farmId, userAddress = '0x0000000000000000000000000000000000000000' } = body;

    // Find farm in mock data
    const farm = MOCK_FARMS.find(f => f.id === farmId);
    if (!farm) {
      return NextResponse.json(
        { success: false, error: 'Farm not found' },
        { status: 404 }
      );
    }

    // Create zkTLS attestation
    // The mock server will query GISTDA mock data and determine burning status
    const attestation = await createGISTDAAttestation(
      farm.id,
      `GISTDA_${farm.id}`,
      farm.location.lat,
      farm.location.lng,
      userAddress
    );

    // Verify the attestation
    const verification = await verifyAttestation(attestation);

    // Format for on-chain submission
    const onChainData = formatForOnChain(attestation);

    // Check eligibility
    const hasBurning = !attestation.data.noBurningDetected;
    const eligibleForReward = !hasBurning && attestation.success && verification.verified;

    // Get config with mock mode indicator
    const config = getPublicConfig();

    return NextResponse.json({
      success: attestation.success,
      farmId: farm.id,
      farmName: farm.name,
      owner: farm.owner,
      attestation: {
        id: attestation.attestationId,
        timestamp: attestation.timestamp,
        data: attestation.data,
        proof: attestation.proof,
      },
      verification: {
        verified: verification.verified,
        error: verification.error,
      },
      onChainData,
      hasBurning,
      eligibleForReward,
      config: {
        ...config,
        integrationType: 'server-side',
        note: config.isMock 
          ? 'Running in MOCK mode - attestation is simulated for demo purposes'
          : 'Running in PRODUCTION mode - using real Primus zkTLS SDK',
      },
    });
  } catch (error) {
    console.error('[zkTLS] Attestation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Attestation failed',
        config: { isMock: isMockMode() },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/zktls/attest
 * 
 * Get zkTLS configuration info
 */
export async function GET() {
  const primusReady = await initializePrimus();
  const config = getPublicConfig();
  
  return NextResponse.json({
    name: 'Primus zkTLS GISTDA Attestation Service',
    version: '1.0.0',
    integrationType: 'server-side',
    description: 'Server-side zkTLS attestation for GISTDA hotspot verification',
    config,
    mode: config.isMock ? 'MOCK' : 'PRODUCTION',
    note: config.isMock 
      ? 'Set PRIMUS_APP_SECRET env var to enable production mode'
      : 'Running with real Primus zkTLS SDK',
    primusReady,
    endpoints: {
      attest: 'POST /api/zktls/attest - Create single attestation',
      verify: 'POST /api/zktls/verify - Verify attestation',
      batchAttest: 'POST /api/zktls/batch-attest - Create batch attestations',
    },
    documentation: 'https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview',
  });
}
