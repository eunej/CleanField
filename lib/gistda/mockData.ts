// Mock GISTDA Hotspot Data
// Simulates Thai Government's GISTDA portal for fire/burning detection

export interface MockGISTDAHotspot {
  OBJECTID: number;
  latitude: number;
  longitude: number;
  acq_date: string;
  acq_time: string;
  satellite: 'VIIRS-NPP' | 'VIIRS-NOAA20' | 'MODIS-AQUA' | 'MODIS-TERRA';
  confidence: 'low' | 'nominal' | 'high';
  brightness: number; // Kelvin temperature
  frp: number; // Fire Radiative Power (MW)
  lu_name: string; // Land use name in Thai
  lu_code: string;
  province_th: string;
  province_en: string;
  district_th: string;
  district_en: string;
  tambon_th: string;
}

export interface MockGISTDAResponse {
  success: boolean;
  timestamp: string;
  query: {
    farmId: string;
    latitude: number;
    longitude: number;
    bufferKm: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
  result: {
    totalHotspots: number;
    noBurningDetected: boolean;
    eligibleForReward: boolean;
    confidenceBreakdown: {
      high: number;
      nominal: number;
      low: number;
    };
    hotspots: MockGISTDAHotspot[];
    verificationHash: string;
  };
  metadata: {
    dataSource: string;
    lastUpdated: string;
    coverageArea: string;
    apiVersion: string;
  };
}

// Helper to generate realistic verification hash
function generateVerificationHash(farmId: string, timestamp: string): string {
  const data = `${farmId}-${timestamp}-gistda-verified`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}

// ============================================
// SCENARIO 1: Clean Farm - No Burning Detected
// ============================================
export const MOCK_CLEAN_FARM_RESPONSE: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm1',
    latitude: 19.9085,
    longitude: 99.8304,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 0,
    noBurningDetected: true,
    eligibleForReward: true,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: generateVerificationHash('farm1', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 2: Farm with Single Low-Confidence Detection
// (Might be false positive - still potentially eligible)
// ============================================
export const MOCK_LOW_CONFIDENCE_DETECTION: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm6',
    latitude: 15.2294,
    longitude: 104.8563,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 1,
    noBurningDetected: false,
    eligibleForReward: false, // Low confidence still disqualifies
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 1,
    },
    hotspots: [
      {
        OBJECTID: 100234,
        latitude: 15.2301,
        longitude: 104.8571,
        acq_date: '2026-01-15',
        acq_time: '13:42:00',
        satellite: 'VIIRS-NPP',
        confidence: 'low',
        brightness: 312.4,
        frp: 2.1,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'อุบลราชธานี',
        province_en: 'Ubon Ratchathani',
        district_th: 'เมืองอุบลราชธานี',
        district_en: 'Mueang Ubon Ratchathani',
        tambon_th: 'ในเมือง',
      },
    ],
    verificationHash: generateVerificationHash('farm6', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 3: Farm with Multiple High-Confidence Detections
// (Clearly burning - not eligible)
// ============================================
export const MOCK_HIGH_CONFIDENCE_BURNING: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm2',
    latitude: 8.4304,
    longitude: 99.9631,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 3,
    noBurningDetected: false,
    eligibleForReward: false,
    confidenceBreakdown: {
      high: 2,
      nominal: 1,
      low: 0,
    },
    hotspots: [
      {
        OBJECTID: 200145,
        latitude: 8.4312,
        longitude: 99.9638,
        acq_date: '2026-01-10',
        acq_time: '10:15:00',
        satellite: 'VIIRS-NOAA20',
        confidence: 'high',
        brightness: 367.8,
        frp: 15.3,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครศรีธรรมราช',
        province_en: 'Nakhon Si Thammarat',
        district_th: 'เมืองนครศรีธรรมราช',
        district_en: 'Mueang Nakhon Si Thammarat',
        tambon_th: 'ในเมือง',
      },
      {
        OBJECTID: 200146,
        latitude: 8.4298,
        longitude: 99.9625,
        acq_date: '2026-01-10',
        acq_time: '10:15:00',
        satellite: 'VIIRS-NOAA20',
        confidence: 'high',
        brightness: 359.2,
        frp: 12.7,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครศรีธรรมราช',
        province_en: 'Nakhon Si Thammarat',
        district_th: 'เมืองนครศรีธรรมราช',
        district_en: 'Mueang Nakhon Si Thammarat',
        tambon_th: 'ในเมือง',
      },
      {
        OBJECTID: 200198,
        latitude: 8.4318,
        longitude: 99.9645,
        acq_date: '2026-01-22',
        acq_time: '14:30:00',
        satellite: 'MODIS-AQUA',
        confidence: 'nominal',
        brightness: 342.1,
        frp: 8.5,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครศรีธรรมราช',
        province_en: 'Nakhon Si Thammarat',
        district_th: 'เมืองนครศรีธรรมราช',
        district_en: 'Mueang Nakhon Si Thammarat',
        tambon_th: 'ในเมือง',
      },
    ],
    verificationHash: generateVerificationHash('farm2', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 4: Clean Farm - Extended Period (90 days clean)
// ============================================
export const MOCK_EXTENDED_CLEAN_PERIOD: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm3',
    latitude: 15.2294,
    longitude: 104.8563,
    bufferKm: 1,
    dateRange: {
      start: '2025-11-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 0,
    noBurningDetected: true,
    eligibleForReward: true,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: generateVerificationHash('farm3', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 5: Nearby Burning (within 2km, outside 1km buffer)
// Farm itself is clean, but neighbor is burning
// ============================================
export const MOCK_NEARBY_BURNING_CLEAN_FARM: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm7',
    latitude: 14.0227,
    longitude: 99.5328,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 0,
    noBurningDetected: true,
    eligibleForReward: true,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: generateVerificationHash('farm7', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 6: Single Severe Burning Event
// ============================================
export const MOCK_SEVERE_BURNING_EVENT: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm5',
    latitude: 17.4138,
    longitude: 102.7875,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 1,
    noBurningDetected: false,
    eligibleForReward: false,
    confidenceBreakdown: {
      high: 1,
      nominal: 0,
      low: 0,
    },
    hotspots: [
      {
        OBJECTID: 300567,
        latitude: 17.4145,
        longitude: 102.7882,
        acq_date: '2026-01-18',
        acq_time: '11:20:00',
        satellite: 'VIIRS-NOAA20',
        confidence: 'high',
        brightness: 412.5,
        frp: 45.8, // Very high FRP indicates severe burning
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'อุดรธานี',
        province_en: 'Udon Thani',
        district_th: 'เมืองอุดรธานี',
        district_en: 'Mueang Udon Thani',
        tambon_th: 'หมากแข้ง',
      },
    ],
    verificationHash: generateVerificationHash('farm5', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 7: Historical Clean Record (Full Year)
// ============================================
export const MOCK_FULL_YEAR_CLEAN: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm4',
    latitude: 14.0227,
    longitude: 99.5328,
    bufferKm: 1,
    dateRange: {
      start: '2025-01-30',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 0,
    noBurningDetected: true,
    eligibleForReward: true,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: generateVerificationHash('farm4', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 8: Edge Case - Just Outside Burning Season
// (Clean during verification period, historical burning)
// ============================================
export const MOCK_POST_BURNING_SEASON_CLEAN: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm8',
    latitude: 17.1234,
    longitude: 101.5678,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 0,
    noBurningDetected: true,
    eligibleForReward: true,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: generateVerificationHash('farm8', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 9: Mixed Detection Types (Different Satellites)
// ============================================
export const MOCK_MIXED_SATELLITE_DETECTIONS: MockGISTDAResponse = {
  success: true,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm9',
    latitude: 14.9965,
    longitude: 102.1234,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: 4,
    noBurningDetected: false,
    eligibleForReward: false,
    confidenceBreakdown: {
      high: 1,
      nominal: 2,
      low: 1,
    },
    hotspots: [
      {
        OBJECTID: 400123,
        latitude: 14.9970,
        longitude: 102.1240,
        acq_date: '2026-01-05',
        acq_time: '01:30:00',
        satellite: 'VIIRS-NPP',
        confidence: 'nominal',
        brightness: 335.2,
        frp: 6.8,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครราชสีมา',
        province_en: 'Nakhon Ratchasima',
        district_th: 'เมืองนครราชสีมา',
        district_en: 'Mueang Nakhon Ratchasima',
        tambon_th: 'ในเมือง',
      },
      {
        OBJECTID: 400124,
        latitude: 14.9960,
        longitude: 102.1230,
        acq_date: '2026-01-05',
        acq_time: '10:45:00',
        satellite: 'MODIS-TERRA',
        confidence: 'high',
        brightness: 358.9,
        frp: 18.2,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครราชสีมา',
        province_en: 'Nakhon Ratchasima',
        district_th: 'เมืองนครราชสีมา',
        district_en: 'Mueang Nakhon Ratchasima',
        tambon_th: 'ในเมือง',
      },
      {
        OBJECTID: 400189,
        latitude: 14.9972,
        longitude: 102.1238,
        acq_date: '2026-01-12',
        acq_time: '13:20:00',
        satellite: 'MODIS-AQUA',
        confidence: 'nominal',
        brightness: 341.7,
        frp: 9.1,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครราชสีมา',
        province_en: 'Nakhon Ratchasima',
        district_th: 'เมืองนครราชสีมา',
        district_en: 'Mueang Nakhon Ratchasima',
        tambon_th: 'ในเมือง',
      },
      {
        OBJECTID: 400201,
        latitude: 14.9968,
        longitude: 102.1245,
        acq_date: '2026-01-20',
        acq_time: '02:15:00',
        satellite: 'VIIRS-NOAA20',
        confidence: 'low',
        brightness: 308.4,
        frp: 1.9,
        lu_name: 'พื้นที่เกษตร',
        lu_code: 'A101',
        province_th: 'นครราชสีมา',
        province_en: 'Nakhon Ratchasima',
        district_th: 'เมืองนครราชสีมา',
        district_en: 'Mueang Nakhon Ratchasima',
        tambon_th: 'ในเมือง',
      },
    ],
    verificationHash: generateVerificationHash('farm9', new Date().toISOString()),
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// SCENARIO 10: Error Response - Data Unavailable
// ============================================
export const MOCK_ERROR_DATA_UNAVAILABLE: MockGISTDAResponse = {
  success: false,
  timestamp: new Date().toISOString(),
  query: {
    farmId: 'farm10',
    latitude: 19.9123,
    longitude: 99.8765,
    bufferKm: 1,
    dateRange: {
      start: '2026-01-01',
      end: '2026-01-30',
    },
  },
  result: {
    totalHotspots: -1,
    noBurningDetected: false,
    eligibleForReward: false,
    confidenceBreakdown: {
      high: 0,
      nominal: 0,
      low: 0,
    },
    hotspots: [],
    verificationHash: '',
  },
  metadata: {
    dataSource: 'GISTDA Hotspot Monitoring System',
    lastUpdated: new Date().toISOString(),
    coverageArea: 'Thailand National Coverage',
    apiVersion: '2.1.0',
  },
};

// ============================================
// Collection of all mock scenarios
// ============================================
export const MOCK_SCENARIOS = {
  cleanFarm: MOCK_CLEAN_FARM_RESPONSE,
  lowConfidenceDetection: MOCK_LOW_CONFIDENCE_DETECTION,
  highConfidenceBurning: MOCK_HIGH_CONFIDENCE_BURNING,
  extendedCleanPeriod: MOCK_EXTENDED_CLEAN_PERIOD,
  nearbyBurningCleanFarm: MOCK_NEARBY_BURNING_CLEAN_FARM,
  severeBurningEvent: MOCK_SEVERE_BURNING_EVENT,
  fullYearClean: MOCK_FULL_YEAR_CLEAN,
  postBurningSeasonClean: MOCK_POST_BURNING_SEASON_CLEAN,
  mixedSatelliteDetections: MOCK_MIXED_SATELLITE_DETECTIONS,
  errorDataUnavailable: MOCK_ERROR_DATA_UNAVAILABLE,
};

// Map farm IDs to their mock responses
export const FARM_MOCK_RESPONSES: Record<string, MockGISTDAResponse> = {
  farm1: MOCK_CLEAN_FARM_RESPONSE,
  farm2: MOCK_HIGH_CONFIDENCE_BURNING,
  farm3: MOCK_EXTENDED_CLEAN_PERIOD,
  farm4: MOCK_FULL_YEAR_CLEAN,
  farm5: MOCK_SEVERE_BURNING_EVENT,
  farm6: MOCK_LOW_CONFIDENCE_DETECTION,
  farm7: MOCK_NEARBY_BURNING_CLEAN_FARM,
  farm8: MOCK_POST_BURNING_SEASON_CLEAN,
  farm9: MOCK_MIXED_SATELLITE_DETECTIONS,
  farm10: MOCK_ERROR_DATA_UNAVAILABLE,
};

// Function to get mock response for a farm
export function getMockGISTDAResponse(farmId: string): MockGISTDAResponse {
  return FARM_MOCK_RESPONSES[farmId] || MOCK_CLEAN_FARM_RESPONSE;
}

// Function to generate a dynamic mock response
export function generateMockResponse(
  farmId: string,
  latitude: number,
  longitude: number,
  noBurning: boolean = true
): MockGISTDAResponse {
  const timestamp = new Date().toISOString();
  
  return {
    success: true,
    timestamp,
    query: {
      farmId,
      latitude,
      longitude,
      bufferKm: 1,
      dateRange: {
        start: '2026-01-01',
        end: '2026-01-30',
      },
    },
    result: {
      totalHotspots: noBurning ? 0 : 1,
      noBurningDetected: noBurning,
      eligibleForReward: noBurning,
      confidenceBreakdown: {
        high: noBurning ? 0 : 1,
        nominal: 0,
        low: 0,
      },
      hotspots: noBurning ? [] : [
        {
          OBJECTID: Math.floor(Math.random() * 1000000),
          latitude: latitude + 0.001,
          longitude: longitude + 0.001,
          acq_date: '2026-01-15',
          acq_time: '12:00:00',
          satellite: 'VIIRS-NOAA20',
          confidence: 'high',
          brightness: 350 + Math.random() * 50,
          frp: 10 + Math.random() * 20,
          lu_name: 'พื้นที่เกษตร',
          lu_code: 'A101',
          province_th: 'Unknown',
          province_en: 'Unknown',
          district_th: 'Unknown',
          district_en: 'Unknown',
          tambon_th: 'Unknown',
        },
      ],
      verificationHash: generateVerificationHash(farmId, timestamp),
    },
    metadata: {
      dataSource: 'GISTDA Hotspot Monitoring System',
      lastUpdated: timestamp,
      coverageArea: 'Thailand National Coverage',
      apiVersion: '2.1.0',
    },
  };
}
