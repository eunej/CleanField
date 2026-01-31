import { NextRequest, NextResponse } from 'next/server';
import {
  MockGISTDAResponse,
  getMockGISTDAResponse,
  generateMockResponse,
  MOCK_SCENARIOS,
  FARM_MOCK_RESPONSES,
} from '@/lib/gistda/mockData';

/**
 * Mock GISTDA Hotspot API
 * 
 * This API simulates the Thai Government's GISTDA portal for fire/burning detection.
 * Use this for testing the zkTLS flow for farmers claiming rewards.
 * 
 * GET /api/gistda/hotspots
 *   - Query params:
 *     - farmId: string (required) - Farm identifier
 *     - lat: number (optional) - Latitude for custom query
 *     - lng: number (optional) - Longitude for custom query
 *     - scenario: string (optional) - Specific mock scenario to return
 *   
 * POST /api/gistda/hotspots
 *   - Body: { farmId, latitude?, longitude?, bufferKm?, scenario? }
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const farmId = searchParams.get('farmId');
  const scenario = searchParams.get('scenario');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  // If scenario is specified, return that specific scenario
  if (scenario) {
    const scenarioResponse = MOCK_SCENARIOS[scenario as keyof typeof MOCK_SCENARIOS];
    if (scenarioResponse) {
      return NextResponse.json(scenarioResponse);
    }
    return NextResponse.json(
      {
        success: false,
        error: `Unknown scenario: ${scenario}`,
        availableScenarios: Object.keys(MOCK_SCENARIOS),
      },
      { status: 400 }
    );
  }

  // If farmId is provided, return the corresponding mock response
  if (farmId) {
    const response = getMockGISTDAResponse(farmId);
    
    // If custom lat/lng provided, generate a dynamic response
    if (lat && lng) {
      const customResponse = generateMockResponse(
        farmId,
        parseFloat(lat),
        parseFloat(lng),
        response.result.noBurningDetected
      );
      return NextResponse.json(customResponse);
    }
    
    return NextResponse.json(response);
  }

  // If no params, return list of available endpoints and scenarios
  return NextResponse.json({
    success: true,
    message: 'Mock GISTDA Hotspot API',
    description: 'Simulates Thai Government GISTDA portal for fire/burning detection',
    usage: {
      byFarmId: '/api/gistda/hotspots?farmId=farm1',
      byScenario: '/api/gistda/hotspots?scenario=cleanFarm',
      withCustomLocation: '/api/gistda/hotspots?farmId=farm1&lat=13.7563&lng=100.5018',
    },
    availableFarms: Object.keys(FARM_MOCK_RESPONSES),
    availableScenarios: Object.keys(MOCK_SCENARIOS),
    scenarioDescriptions: {
      cleanFarm: 'No burning detected - eligible for reward',
      lowConfidenceDetection: 'Single low-confidence detection - ineligible',
      highConfidenceBurning: 'Multiple high-confidence detections - ineligible',
      extendedCleanPeriod: '90 days clean record - eligible',
      nearbyBurningCleanFarm: 'Neighbor burning, farm clean - eligible',
      severeBurningEvent: 'Single severe burning event - ineligible',
      fullYearClean: 'Full year clean record - eligible',
      postBurningSeasonClean: 'Clean during current period - eligible',
      mixedSatelliteDetections: 'Multiple detections from different satellites - ineligible',
      errorDataUnavailable: 'Error response - data unavailable',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farmId, latitude, longitude, bufferKm, scenario, forceNoBurning } = body;

    // If scenario is specified, return that specific scenario
    if (scenario) {
      const scenarioResponse = MOCK_SCENARIOS[scenario as keyof typeof MOCK_SCENARIOS];
      if (scenarioResponse) {
        // Override with custom farmId if provided
        if (farmId) {
          return NextResponse.json({
            ...scenarioResponse,
            query: {
              ...scenarioResponse.query,
              farmId,
              latitude: latitude || scenarioResponse.query.latitude,
              longitude: longitude || scenarioResponse.query.longitude,
              bufferKm: bufferKm || scenarioResponse.query.bufferKm,
            },
          });
        }
        return NextResponse.json(scenarioResponse);
      }
      return NextResponse.json(
        {
          success: false,
          error: `Unknown scenario: ${scenario}`,
          availableScenarios: Object.keys(MOCK_SCENARIOS),
        },
        { status: 400 }
      );
    }

    // Require farmId for custom queries
    if (!farmId) {
      return NextResponse.json(
        {
          success: false,
          error: 'farmId is required',
          example: { farmId: 'farm1', latitude: 13.7563, longitude: 100.5018 },
        },
        { status: 400 }
      );
    }

    // Check if we have a pre-defined response for this farm
    const preDefinedResponse = FARM_MOCK_RESPONSES[farmId];
    
    // If custom coordinates provided, generate a dynamic response
    if (latitude && longitude) {
      const noBurning = forceNoBurning !== undefined 
        ? forceNoBurning 
        : (preDefinedResponse?.result.noBurningDetected ?? true);
      
      const response = generateMockResponse(
        farmId,
        latitude,
        longitude,
        noBurning
      );
      
      if (bufferKm) {
        response.query.bufferKm = bufferKm;
      }
      
      return NextResponse.json(response);
    }

    // Return pre-defined response or generate clean response
    if (preDefinedResponse) {
      return NextResponse.json(preDefinedResponse);
    }

    // Generate a default clean response for unknown farms
    return NextResponse.json(
      generateMockResponse(farmId, 13.7563, 100.5018, forceNoBurning ?? true)
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 500 }
    );
  }
}
