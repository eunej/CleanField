import { NextRequest, NextResponse } from 'next/server';
import { getMockGISTDAResponse, generateMockResponse } from '@/lib/gistda/mockData';
import { MOCK_FARMS } from '@/lib/data/mockData';

/**
 * Mock GISTDA Verification API
 * 
 * This endpoint is designed to be the target for zkTLS proof generation.
 * It returns a simple, structured verification response that can be
 * cryptographically attested via zkTLS.
 * 
 * The response format is optimized for zkTLS attestation:
 * - Clear boolean for verification status
 * - Deterministic structure
 * - Verification hash for proof validation
 * 
 * POST /api/gistda/verify
 *   Body: {
 *     farmId: string,
 *     walletAddress?: string,
 *     periodStart?: string (ISO date),
 *     periodEnd?: string (ISO date)
 *   }
 */

export interface VerificationRequest {
  farmId: string;
  walletAddress?: string;
  periodStart?: string;
  periodEnd?: string;
}

export interface VerificationResponse {
  success: boolean;
  verification: {
    farmId: string;
    walletAddress: string;
    status: 'CLEAN' | 'BURNING_DETECTED' | 'PENDING' | 'ERROR';
    noBurningDetected: boolean;
    eligibleForReward: boolean;
    verificationPeriod: {
      start: string;
      end: string;
      daysVerified: number;
    };
    location: {
      latitude: number;
      longitude: number;
      bufferRadiusKm: number;
    };
    detectionSummary: {
      totalHotspots: number;
      highConfidence: number;
      nominalConfidence: number;
      lowConfidence: number;
    };
    reward: {
      eligible: boolean;
      amount: number;
      currency: string;
    };
  };
  attestation: {
    hash: string;
    timestamp: string;
    issuer: string;
    expiresAt: string;
  };
  metadata: {
    apiVersion: string;
    dataSource: string;
    disclaimer: string;
  };
}

// Generate a verification hash
function generateVerificationHash(data: object): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

export async function POST(request: NextRequest) {
  try {
    const body: VerificationRequest = await request.json();
    const { farmId, walletAddress, periodStart, periodEnd } = body;

    if (!farmId) {
      return NextResponse.json(
        {
          success: false,
          error: 'farmId is required',
          example: {
            farmId: 'farm1',
            walletAddress: '0x1234...',
            periodStart: '2026-01-01',
            periodEnd: '2026-01-30',
          },
        },
        { status: 400 }
      );
    }

    // Get farm data
    const farm = MOCK_FARMS.find(f => f.id === farmId);
    const farmWallet = walletAddress || farm?.walletAddress || '0x0000000000000000000000000000000000000000';
    const farmLat = farm?.location.lat || 19.9085;
    const farmLng = farm?.location.lng || 99.8304;

    // Get mock GISTDA response for this farm
    const gistdaResponse = getMockGISTDAResponse(farmId);
    const noBurning = gistdaResponse.result.noBurningDetected;

    // Calculate period
    const endDate = periodEnd ? new Date(periodEnd) : new Date();
    const startDate = periodStart ? new Date(periodStart) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const daysVerified = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));

    // Calculate reward amount (500 USDT base + 10 USDT per extra day over 30)
    const baseReward = 500;
    const bonusDays = Math.max(0, daysVerified - 30);
    const rewardAmount = noBurning ? baseReward + (bonusDays * 10) : 0;

    // Build response
    const now = new Date();
    const verification = {
      farmId,
      walletAddress: farmWallet,
      status: noBurning ? 'CLEAN' as const : 'BURNING_DETECTED' as const,
      noBurningDetected: noBurning,
      eligibleForReward: noBurning,
      verificationPeriod: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        daysVerified,
      },
      location: {
        latitude: farmLat,
        longitude: farmLng,
        bufferRadiusKm: 1,
      },
      detectionSummary: {
        totalHotspots: gistdaResponse.result.totalHotspots,
        highConfidence: gistdaResponse.result.confidenceBreakdown.high,
        nominalConfidence: gistdaResponse.result.confidenceBreakdown.nominal,
        lowConfidence: gistdaResponse.result.confidenceBreakdown.low,
      },
      reward: {
        eligible: noBurning,
        amount: rewardAmount,
        currency: 'USDT',
      },
    };

    const response: VerificationResponse = {
      success: true,
      verification,
      attestation: {
        hash: generateVerificationHash(verification),
        timestamp: now.toISOString(),
        issuer: 'GISTDA Mock Portal',
        expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      },
      metadata: {
        apiVersion: '2.1.0',
        dataSource: 'GISTDA Hotspot Monitoring System (Mock)',
        disclaimer: 'This is mock data for development and testing purposes only.',
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const farmId = searchParams.get('farmId');

  if (!farmId) {
    return NextResponse.json({
      success: true,
      message: 'GISTDA Verification API',
      description: 'Verify farm burning status for zkTLS attestation',
      usage: {
        method: 'POST',
        endpoint: '/api/gistda/verify',
        body: {
          farmId: 'string (required)',
          walletAddress: 'string (optional)',
          periodStart: 'ISO date (optional)',
          periodEnd: 'ISO date (optional)',
        },
      },
      exampleRequest: {
        farmId: 'farm1',
        walletAddress: '0x1234567890123456789012345678901234567890',
        periodStart: '2026-01-01',
        periodEnd: '2026-01-30',
      },
      availableFarms: MOCK_FARMS.map(f => ({
        id: f.id,
        name: f.name,
        hasBurning: f.hasBurning,
      })),
    });
  }

  // Allow GET with farmId for simple testing
  const farm = MOCK_FARMS.find(f => f.id === farmId);
  if (!farm) {
    return NextResponse.json(
      {
        success: false,
        error: `Farm not found: ${farmId}`,
        availableFarms: MOCK_FARMS.map(f => f.id),
      },
      { status: 404 }
    );
  }

  // Redirect to POST-style response
  const gistdaResponse = getMockGISTDAResponse(farmId);
  const noBurning = gistdaResponse.result.noBurningDetected;

  return NextResponse.json({
    success: true,
    farmId,
    farmName: farm.name,
    owner: farm.owner,
    status: noBurning ? 'CLEAN' : 'BURNING_DETECTED',
    noBurningDetected: noBurning,
    eligibleForReward: noBurning,
    message: noBurning 
      ? '✅ No burning detected - Eligible for reward'
      : '❌ Burning detected - Not eligible for reward',
    detectionCount: gistdaResponse.result.totalHotspots,
    hint: 'Use POST method for full verification response suitable for zkTLS',
  });
}
