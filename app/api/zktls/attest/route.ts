import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import {
  createGISTDAAttestation,
  verifyAttestation,
  formatForOnChain,
  getPublicConfig,
} from '@/lib/zktls';

/**
 * POST /api/zktls/attest
 * 
 * Create a zkTLS attestation for farm burning status verification
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

    // Check if farm has burning detected (ineligible for zkTLS proof)
    if (farm.hasBurning) {
      return NextResponse.json({
        success: false,
        farmId: farm.id,
        farmName: farm.name,
        owner: farm.owner,
        attestation: null,
        verification: {
          verified: false,
          error: 'Farm has burning incidents detected - ineligible for clean air proof',
        },
        onChainData: null,
        config: getPublicConfig(),
        reason: 'BURNING_DETECTED',
        burningIncidents: farm.burningIncidents,
      });
    }

    // Create zkTLS attestation
    const attestation = await createGISTDAAttestation(
      farm.id,
      `GISTDA_${farm.id}`, // Mock GISTDA ID
      farm.location.lat,
      farm.location.lng,
      userAddress
    );

    // Verify the attestation
    const verification = await verifyAttestation(attestation);

    // Format for on-chain submission
    const onChainData = formatForOnChain(attestation);

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
      config: getPublicConfig(),
    });
  } catch (error) {
    console.error('zkTLS attestation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Attestation failed',
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
  return NextResponse.json({
    name: 'Primus zkTLS GISTDA Attestation Service',
    version: '1.0.0',
    config: getPublicConfig(),
    endpoints: {
      attest: 'POST /api/zktls/attest',
      verify: 'POST /api/zktls/verify',
      batchAttest: 'POST /api/zktls/batch-attest',
    },
    documentation: '/docs/zkTLS_INTEGRATION.md',
  });
}
