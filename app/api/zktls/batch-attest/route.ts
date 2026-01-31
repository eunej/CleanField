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
 * POST /api/zktls/batch-attest
 * 
 * Create zkTLS attestations for all farms using Primus zkTLS
 * 
 * Integration Type: SERVER-SIDE (Backend Integration)
 * - No browser extension required
 * - Server initiates verification programmatically
 * - Suitable for batch processing and automated verification
 * 
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview
 * 
 * Request body (optional):
 * - farmIds: string[] - Specific farm IDs to attest (defaults to all)
 * - userAddress: string - User's wallet address
 * 
 * Response:
 * - summary: Batch attestation summary
 * - attestations: Array of attestation results
 * - config: zkTLS configuration (including mock mode indicator)
 */
export async function POST(request: Request) {
  try {
    // Initialize Primus zkTLS
    const primusInitialized = await initializePrimus();
    const mockMode = isMockMode();
    console.log(`[zkTLS] Initialized: ${primusInitialized}, Mode: ${mockMode ? 'MOCK' : 'PRODUCTION'}`);

    const body = await request.json().catch(() => ({}));
    const { 
      farmIds = MOCK_FARMS.map(f => f.id),
      userAddress = '0x0000000000000000000000000000000000000000'
    } = body;

    // Filter farms
    const farmsToAttest = MOCK_FARMS.filter(f => farmIds.includes(f.id));

    if (farmsToAttest.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid farms found' },
        { status: 404 }
      );
    }

    // Create attestations in parallel
    const attestationPromises = farmsToAttest.map(async (farm) => {
      try {
        // Create attestation (mock server will determine burning status from GISTDA mock data)
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

        // Check if farm has burning detected
        const hasBurning = !attestation.data.noBurningDetected;

        return {
          farmId: farm.id,
          farmName: farm.name,
          owner: farm.owner,
          location: farm.location,
          attestation: {
            id: attestation.attestationId,
            timestamp: attestation.timestamp,
            noBurningDetected: attestation.data.noBurningDetected,
            hotspotsCount: attestation.data.hotspotsCount,
            proofHash: attestation.proof.hash,
          },
          verification: {
            verified: verification.verified,
            error: verification.error,
          },
          onChainData,
          success: attestation.success && verification.verified,
          hasBurning,
          eligibleForReward: !hasBurning && attestation.success && verification.verified,
        };
      } catch (error) {
        return {
          farmId: farm.id,
          farmName: farm.name,
          owner: farm.owner,
          location: farm.location,
          attestation: null,
          verification: { verified: false, error: error instanceof Error ? error.message : 'Failed' },
          onChainData: null,
          success: false,
          hasBurning: null,
          eligibleForReward: false,
        };
      }
    });

    const results = await Promise.all(attestationPromises);

    // Calculate summary
    const successfulResults = results.filter(r => r.success);
    const summary = {
      totalFarms: results.length,
      successfulAttestations: successfulResults.length,
      cleanFarms: results.filter(r => r.attestation?.noBurningDetected === true).length,
      burningDetected: results.filter(r => r.hasBurning === true).length,
      failed: results.filter(r => !r.success).length,
      eligibleForReward: results.filter(r => r.eligibleForReward).length,
      attestedAt: new Date().toISOString(),
    };

    // Get config with mock mode indicator
    const config = getPublicConfig();

    return NextResponse.json({
      success: true,
      summary,
      attestations: results,
      config: {
        ...config,
        integrationType: 'server-side',
        note: config.isMock 
          ? 'Running in MOCK mode - attestations are simulated for demo purposes'
          : 'Running in PRODUCTION mode - using real Primus zkTLS SDK',
      },
    });
  } catch (error) {
    console.error('[zkTLS] Batch attestation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Batch attestation failed',
        config: { isMock: isMockMode() },
      },
      { status: 500 }
    );
  }
}
