import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import { checkFarmHotspots, generateProofHash, HotspotResult } from '@/lib/gistda/hotspotChecker';

export async function POST() {
  try {
    // Verify all farms in parallel
    const verificationPromises = MOCK_FARMS.map(async (farm) => {
      const result = await checkFarmHotspots(
        farm.id,
        farm.location.lat,
        farm.location.lng,
        1 // 1km buffer
      );
      
      const proofHash = generateProofHash(result);
      
      return {
        farmId: farm.id,
        farmName: farm.name,
        location: farm.location,
        verification: {
          hotspotsDetected: result.hotspotsDetected,
          noBurningDetected: result.noBurningDetected,
          eligible: result.eligible,
          checkDate: result.checkDate,
          proofHash,
        },
        error: result.error,
      };
    });

    const results = await Promise.all(verificationPromises);

    // Summary stats
    const summary = {
      totalFarms: results.length,
      cleanFarms: results.filter(r => r.verification.noBurningDetected && !r.error).length,
      burningFarms: results.filter(r => !r.verification.noBurningDetected && !r.error).length,
      errorFarms: results.filter(r => r.error).length,
      verifiedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      summary,
      results,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
