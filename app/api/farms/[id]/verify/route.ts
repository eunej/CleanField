import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import { checkFarmHotspots, generateProofHash } from '@/lib/gistda/hotspotChecker';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const farm = MOCK_FARMS.find(f => f.id === id);

  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
  }

  try {
    // Check for hotspots at farm location using GISTDA API
    const result = await checkFarmHotspots(
      farm.id,
      farm.location.lat,
      farm.location.lng,
      1 // 1km buffer
    );

    // Generate proof hash (would be zkTLS proof in production)
    const proofHash = generateProofHash(result);

    return NextResponse.json({
      success: true,
      farmId: farm.id,
      farmName: farm.name,
      location: farm.location,
      verification: {
        hotspotsDetected: result.hotspotsDetected,
        noBurningDetected: result.noBurningDetected,
        eligible: result.eligible,
        checkDate: result.checkDate,
        proofHash,
        hotspots: result.hotspots,
      },
      error: result.error,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        farmId: farm.id,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check verification status
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const farm = MOCK_FARMS.find(f => f.id === id);

  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
  }

  // Return farm's current status and location for verification
  return NextResponse.json({
    farmId: farm.id,
    farmName: farm.name,
    location: farm.location,
    currentStatus: {
      hasBurning: farm.hasBurning,
      burningIncidents: farm.burningIncidents,
      eligibilityStatus: farm.eligibilityStatus,
    },
    gistdaApiUrl: buildGistdaUrl(farm.location.lat, farm.location.lng),
  });
}

function buildGistdaUrl(lat: number, lng: number, buffer: number = 0.01): string {
  const baseUrl = 'https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/hotspot_npp_daily/MapServer/0/query';
  const params = new URLSearchParams({
    where: "lu_name='พื้นที่เกษตร'",
    geometry: `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`,
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    f: 'json'
  });
  return `${baseUrl}?${params.toString()}`;
}
