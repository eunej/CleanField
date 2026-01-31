import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import {
  createGISTDAAttestation,
  verifyAttestation,
  formatForOnChain,
  getPublicConfig,
} from '@/lib/zktls';

/**
 * POST /api/zktls/batch-attest
 * 
 * Create zkTLS attestations for all farms
 * 
 * Request body (optional):
 * - farmIds: string[] - Specific farm IDs to attest (defaults to all)
 * - userAddress: string - User's wallet address
 * 
 * Response:
 * - summary: Batch attestation summary
 * - attestations: Array of attestation results
 */
export async function POST(request: Request) {
  try {
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
        // Check if farm has burning detected (ineligible for zkTLS proof)
        if (farm.hasBurning) {
          return {
            farmId: farm.id,
            farmName: farm.name,
            owner: farm.owner,
            location: farm.location,
            attestation: null,
            verification: { 
              verified: false, 
              error: 'Farm has burning incidents detected - ineligible for clean air proof' 
            },
            onChainData: null,
            success: false,
            reason: 'BURNING_DETECTED',
            burningIncidents: farm.burningIncidents,
          };
        }

        const attestation = await createGISTDAAttestation(
          farm.id,
          `GISTDA_${farm.id}`,
          farm.location.lat,
          farm.location.lng,
          userAddress
        );

        const verification = await verifyAttestation(attestation);
        const onChainData = formatForOnChain(attestation);

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
        };
      }
    });

    const results = await Promise.all(attestationPromises);

    // Calculate summary
    const summary = {
      totalFarms: results.length,
      successfulAttestations: results.filter(r => r.success).length,
      cleanFarms: results.filter(r => r.attestation?.noBurningDetected).length,
      burningDetected: results.filter(r => r.attestation && !r.attestation.noBurningDetected).length,
      failed: results.filter(r => !r.success).length,
      attestedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      summary,
      attestations: results,
      config: getPublicConfig(),
    });
  } catch (error) {
    console.error('Batch zkTLS attestation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Batch attestation failed',
      },
      { status: 500 }
    );
  }
}
