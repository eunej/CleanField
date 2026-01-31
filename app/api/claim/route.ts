import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import {
  processClaimReward,
  checkClaimEligibility,
  getPaymentConfig,
  estimateClaimGas,
  getTotalDistributed,
  calculateRewardAmount,
  ClaimRequest,
} from '@/lib/payments';

/**
 * POST /api/claim
 * 
 * Claim clean air incentive payment after zkTLS proof submission
 * 
 * Request body:
 * - farmId: string - Farm identifier
 * - attestationId: string - zkTLS attestation ID
 * - proofHash: string - Cryptographic proof hash
 * - noBurningDetected: boolean - Whether the proof shows no burning
 * - timestamp: number - Attestation timestamp
 * 
 * Response:
 * - ClaimResult with payment status and transaction hash
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { farmId, attestationId, proofHash, noBurningDetected, timestamp } = body;

    // Validate required fields
    if (!farmId || !attestationId || !proofHash || noBurningDetected === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: farmId, attestationId, proofHash, noBurningDetected',
        },
        { status: 400 }
      );
    }

    // Find farm
    const farm = MOCK_FARMS.find(f => f.id === farmId);
    if (!farm) {
      return NextResponse.json(
        { success: false, error: 'Farm not found' },
        { status: 404 }
      );
    }

    // Create claim request
    const claimRequest: ClaimRequest = {
      farmId,
      walletAddress: farm.walletAddress,
      attestationId,
      proofHash,
      noBurningDetected,
      timestamp: timestamp || Date.now(),
    };

    // Process the claim
    const result = await processClaimReward(claimRequest);

    return NextResponse.json({
      ...result,
      farm: {
        id: farm.id,
        name: farm.name,
        owner: farm.owner,
      },
      config: getPaymentConfig(),
    });
  } catch (error) {
    console.error('Claim processing error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Claim processing failed',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/claim
 * 
 * Get claim eligibility and payment configuration
 * 
 * Query params:
 * - farmId: string - Farm identifier (optional, returns general info if not provided)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId');

  const config = getPaymentConfig();
  const gasEstimate = estimateClaimGas();
  const totalDistributed = getTotalDistributed();

  if (farmId) {
    const farm = MOCK_FARMS.find(f => f.id === farmId);
    if (!farm) {
      return NextResponse.json(
        { success: false, error: 'Farm not found' },
        { status: 404 }
      );
    }

    // Check eligibility (assuming no burning for eligibility check)
    const eligibility = checkClaimEligibility(farmId, !farm.hasBurning, true);

    return NextResponse.json({
      success: true,
      farmId,
      farm: {
        name: farm.name,
        owner: farm.owner,
        walletAddress: farm.walletAddress,
        hasBurning: farm.hasBurning,
        area: farm.area,
        calculatedReward: calculateRewardAmount(farmId),
      },
      eligibility,
      config,
      gasEstimate,
    });
  }

  return NextResponse.json({
    success: true,
    name: 'Clean Air Incentive Payment System',
    description: 'Submit zkTLS proof of no burning to claim THB rewards (฿5,000/ha/year)',
    config,
    gasEstimate,
    stats: totalDistributed,
    endpoints: {
      claim: 'POST /api/claim',
      checkEligibility: 'GET /api/claim?farmId=<farmId>',
      history: 'GET /api/claim/history?farmId=<farmId>',
    },
  });
}
