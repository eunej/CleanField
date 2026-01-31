// GISTDA Hotspot Detection Service
// Checks for fire/burning hotspots at farm locations using GISTDA's API

export interface HotspotResult {
  farmId: string;
  farmLat: number;
  farmLng: number;
  hotspotsDetected: number;
  noBurningDetected: boolean;
  eligible: boolean;
  checkDate: string;
  hotspots: HotspotFeature[];
  error?: string;
}

export interface HotspotFeature {
  objectId: number;
  latitude: number;
  longitude: number;
  acqDate: string;
  confidence: string;
  brightness: number;
  luName: string;
}

export interface GISTDAResponse {
  features?: Array<{
    attributes: {
      OBJECTID: number;
      latitude: number;
      longitude: number;
      acq_date: string;
      confidence: string;
      brightness: number;
      lu_name: string;
      [key: string]: unknown;
    };
    geometry?: {
      x: number;
      y: number;
    };
  }>;
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Check for hotspots at a farm location using GISTDA API
 * @param farmId - Farm identifier
 * @param farmLat - Farm latitude
 * @param farmLng - Farm longitude
 * @param bufferKm - Buffer radius in kilometers (default 1km = 0.01 degrees approx)
 * @returns HotspotResult with detection status
 */
export async function checkFarmHotspots(
  farmId: string,
  farmLat: number,
  farmLng: number,
  bufferKm: number = 1
): Promise<HotspotResult> {
  // Convert km to approximate degrees (1 degree ≈ 111km at equator)
  const buffer = bufferKm / 111;
  
  // Build GISTDA API URL
  // Query for agricultural land ('พื้นที่เกษตร') hotspots within bounding box
  const baseUrl = 'https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/hotspot_npp_daily/MapServer/0/query';
  
  const params = new URLSearchParams({
    where: "lu_name='พื้นที่เกษตร'", // Agricultural land only
    geometry: `${farmLng - buffer},${farmLat - buffer},${farmLng + buffer},${farmLat + buffer}`,
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: '*',
    f: 'json'
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`GISTDA API error: ${response.status} ${response.statusText}`);
    }

    const data: GISTDAResponse = await response.json();

    // Check for API error response
    if (data.error) {
      throw new Error(`GISTDA API error: ${data.error.message}`);
    }

    // Parse hotspot features
    const hotspots: HotspotFeature[] = (data.features || []).map(feature => ({
      objectId: feature.attributes.OBJECTID,
      latitude: feature.attributes.latitude || feature.geometry?.y || 0,
      longitude: feature.attributes.longitude || feature.geometry?.x || 0,
      acqDate: feature.attributes.acq_date,
      confidence: feature.attributes.confidence,
      brightness: feature.attributes.brightness,
      luName: feature.attributes.lu_name,
    }));

    const hotspotsDetected = hotspots.length;
    const noBurningDetected = hotspotsDetected === 0;

    return {
      farmId,
      farmLat,
      farmLng,
      hotspotsDetected,
      noBurningDetected,
      eligible: noBurningDetected, // Eligible for reward if no burning detected
      checkDate: new Date().toISOString(),
      hotspots,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      farmId,
      farmLat,
      farmLng,
      hotspotsDetected: -1,
      noBurningDetected: false,
      eligible: false,
      checkDate: new Date().toISOString(),
      hotspots: [],
      error: errorMessage,
    };
  }
}

/**
 * Generate a proof hash from hotspot check result
 * This would be replaced with actual zkTLS proof generation
 */
export function generateProofHash(result: HotspotResult): string {
  const data = JSON.stringify({
    farmId: result.farmId,
    lat: result.farmLat,
    lng: result.farmLng,
    noBurning: result.noBurningDetected,
    checkDate: result.checkDate,
    hotspotsCount: result.hotspotsDetected,
  });
  
  // Simple hash for demo - in production, this would be zkTLS proof
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
