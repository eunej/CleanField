module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/gistda/mockData.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock GISTDA Hotspot Data
// Simulates Thai Government's GISTDA portal for fire/burning detection
__turbopack_context__.s([
    "FARM_MOCK_RESPONSES",
    ()=>FARM_MOCK_RESPONSES,
    "MOCK_CLEAN_FARM_RESPONSE",
    ()=>MOCK_CLEAN_FARM_RESPONSE,
    "MOCK_ERROR_DATA_UNAVAILABLE",
    ()=>MOCK_ERROR_DATA_UNAVAILABLE,
    "MOCK_EXTENDED_CLEAN_PERIOD",
    ()=>MOCK_EXTENDED_CLEAN_PERIOD,
    "MOCK_FULL_YEAR_CLEAN",
    ()=>MOCK_FULL_YEAR_CLEAN,
    "MOCK_HIGH_CONFIDENCE_BURNING",
    ()=>MOCK_HIGH_CONFIDENCE_BURNING,
    "MOCK_LOW_CONFIDENCE_DETECTION",
    ()=>MOCK_LOW_CONFIDENCE_DETECTION,
    "MOCK_MIXED_SATELLITE_DETECTIONS",
    ()=>MOCK_MIXED_SATELLITE_DETECTIONS,
    "MOCK_NEARBY_BURNING_CLEAN_FARM",
    ()=>MOCK_NEARBY_BURNING_CLEAN_FARM,
    "MOCK_POST_BURNING_SEASON_CLEAN",
    ()=>MOCK_POST_BURNING_SEASON_CLEAN,
    "MOCK_SCENARIOS",
    ()=>MOCK_SCENARIOS,
    "MOCK_SEVERE_BURNING_EVENT",
    ()=>MOCK_SEVERE_BURNING_EVENT,
    "generateMockResponse",
    ()=>generateMockResponse,
    "getMockGISTDAResponse",
    ()=>getMockGISTDAResponse
]);
// Helper to generate realistic verification hash
function generateVerificationHash(farmId, timestamp) {
    const data = `${farmId}-${timestamp}-gistda-verified`;
    let hash = 0;
    for(let i = 0; i < data.length; i++){
        hash = (hash << 5) - hash + data.charCodeAt(i);
        hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
const MOCK_CLEAN_FARM_RESPONSE = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm1',
        latitude: 13.7563,
        longitude: 100.5018,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 0,
        noBurningDetected: true,
        eligibleForReward: true,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: generateVerificationHash('farm1', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_LOW_CONFIDENCE_DETECTION = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm6',
        latitude: 15.2294,
        longitude: 104.8563,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 1,
        noBurningDetected: false,
        eligibleForReward: false,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 1
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
                tambon_th: 'ในเมือง'
            }
        ],
        verificationHash: generateVerificationHash('farm6', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_HIGH_CONFIDENCE_BURNING = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm2',
        latitude: 14.3532,
        longitude: 100.5698,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 3,
        noBurningDetected: false,
        eligibleForReward: false,
        confidenceBreakdown: {
            high: 2,
            nominal: 1,
            low: 0
        },
        hotspots: [
            {
                OBJECTID: 200145,
                latitude: 14.3540,
                longitude: 100.5705,
                acq_date: '2026-01-10',
                acq_time: '10:15:00',
                satellite: 'VIIRS-NOAA20',
                confidence: 'high',
                brightness: 367.8,
                frp: 15.3,
                lu_name: 'พื้นที่เกษตร',
                lu_code: 'A101',
                province_th: 'พระนครศรีอยุธยา',
                province_en: 'Phra Nakhon Si Ayutthaya',
                district_th: 'พระนครศรีอยุธยา',
                district_en: 'Phra Nakhon Si Ayutthaya',
                tambon_th: 'ปากกราน'
            },
            {
                OBJECTID: 200146,
                latitude: 14.3528,
                longitude: 100.5692,
                acq_date: '2026-01-10',
                acq_time: '10:15:00',
                satellite: 'VIIRS-NOAA20',
                confidence: 'high',
                brightness: 359.2,
                frp: 12.7,
                lu_name: 'พื้นที่เกษตร',
                lu_code: 'A101',
                province_th: 'พระนครศรีอยุธยา',
                province_en: 'Phra Nakhon Si Ayutthaya',
                district_th: 'พระนครศรีอยุธยา',
                district_en: 'Phra Nakhon Si Ayutthaya',
                tambon_th: 'ปากกราน'
            },
            {
                OBJECTID: 200198,
                latitude: 14.3545,
                longitude: 100.5710,
                acq_date: '2026-01-22',
                acq_time: '14:30:00',
                satellite: 'MODIS-AQUA',
                confidence: 'nominal',
                brightness: 342.1,
                frp: 8.5,
                lu_name: 'พื้นที่เกษตร',
                lu_code: 'A101',
                province_th: 'พระนครศรีอยุธยา',
                province_en: 'Phra Nakhon Si Ayutthaya',
                district_th: 'พระนครศรีอยุธยา',
                district_en: 'Phra Nakhon Si Ayutthaya',
                tambon_th: 'ปากกราน'
            }
        ],
        verificationHash: generateVerificationHash('farm2', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_EXTENDED_CLEAN_PERIOD = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm3',
        latitude: 15.8700,
        longitude: 100.9925,
        bufferKm: 1,
        dateRange: {
            start: '2025-11-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 0,
        noBurningDetected: true,
        eligibleForReward: true,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: generateVerificationHash('farm3', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_NEARBY_BURNING_CLEAN_FARM = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm7',
        latitude: 16.4419,
        longitude: 102.8359,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 0,
        noBurningDetected: true,
        eligibleForReward: true,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: generateVerificationHash('farm7', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_SEVERE_BURNING_EVENT = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm5',
        latitude: 18.7883,
        longitude: 98.9853,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 1,
        noBurningDetected: false,
        eligibleForReward: false,
        confidenceBreakdown: {
            high: 1,
            nominal: 0,
            low: 0
        },
        hotspots: [
            {
                OBJECTID: 300567,
                latitude: 18.7890,
                longitude: 98.9860,
                acq_date: '2026-01-18',
                acq_time: '11:20:00',
                satellite: 'VIIRS-NOAA20',
                confidence: 'high',
                brightness: 412.5,
                frp: 45.8,
                lu_name: 'พื้นที่เกษตร',
                lu_code: 'A101',
                province_th: 'เชียงใหม่',
                province_en: 'Chiang Mai',
                district_th: 'แม่ริม',
                district_en: 'Mae Rim',
                tambon_th: 'แม่สา'
            }
        ],
        verificationHash: generateVerificationHash('farm5', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_FULL_YEAR_CLEAN = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm4',
        latitude: 16.4419,
        longitude: 102.8359,
        bufferKm: 1,
        dateRange: {
            start: '2025-01-30',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 0,
        noBurningDetected: true,
        eligibleForReward: true,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: generateVerificationHash('farm4', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_POST_BURNING_SEASON_CLEAN = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm8',
        latitude: 17.1234,
        longitude: 101.5678,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 0,
        noBurningDetected: true,
        eligibleForReward: true,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: generateVerificationHash('farm8', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_MIXED_SATELLITE_DETECTIONS = {
    success: true,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm9',
        latitude: 14.9965,
        longitude: 102.1234,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: 4,
        noBurningDetected: false,
        eligibleForReward: false,
        confidenceBreakdown: {
            high: 1,
            nominal: 2,
            low: 1
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
                tambon_th: 'ในเมือง'
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
                tambon_th: 'ในเมือง'
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
                tambon_th: 'ในเมือง'
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
                tambon_th: 'ในเมือง'
            }
        ],
        verificationHash: generateVerificationHash('farm9', new Date().toISOString())
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_ERROR_DATA_UNAVAILABLE = {
    success: false,
    timestamp: new Date().toISOString(),
    query: {
        farmId: 'farm10',
        latitude: 19.9123,
        longitude: 99.8765,
        bufferKm: 1,
        dateRange: {
            start: '2026-01-01',
            end: '2026-01-30'
        }
    },
    result: {
        totalHotspots: -1,
        noBurningDetected: false,
        eligibleForReward: false,
        confidenceBreakdown: {
            high: 0,
            nominal: 0,
            low: 0
        },
        hotspots: [],
        verificationHash: ''
    },
    metadata: {
        dataSource: 'GISTDA Hotspot Monitoring System',
        lastUpdated: new Date().toISOString(),
        coverageArea: 'Thailand National Coverage',
        apiVersion: '2.1.0'
    }
};
const MOCK_SCENARIOS = {
    cleanFarm: MOCK_CLEAN_FARM_RESPONSE,
    lowConfidenceDetection: MOCK_LOW_CONFIDENCE_DETECTION,
    highConfidenceBurning: MOCK_HIGH_CONFIDENCE_BURNING,
    extendedCleanPeriod: MOCK_EXTENDED_CLEAN_PERIOD,
    nearbyBurningCleanFarm: MOCK_NEARBY_BURNING_CLEAN_FARM,
    severeBurningEvent: MOCK_SEVERE_BURNING_EVENT,
    fullYearClean: MOCK_FULL_YEAR_CLEAN,
    postBurningSeasonClean: MOCK_POST_BURNING_SEASON_CLEAN,
    mixedSatelliteDetections: MOCK_MIXED_SATELLITE_DETECTIONS,
    errorDataUnavailable: MOCK_ERROR_DATA_UNAVAILABLE
};
const FARM_MOCK_RESPONSES = {
    farm1: MOCK_CLEAN_FARM_RESPONSE,
    farm2: MOCK_HIGH_CONFIDENCE_BURNING,
    farm3: MOCK_EXTENDED_CLEAN_PERIOD,
    farm4: MOCK_FULL_YEAR_CLEAN,
    farm5: MOCK_SEVERE_BURNING_EVENT,
    farm6: MOCK_LOW_CONFIDENCE_DETECTION,
    farm7: MOCK_NEARBY_BURNING_CLEAN_FARM,
    farm8: MOCK_POST_BURNING_SEASON_CLEAN,
    farm9: MOCK_MIXED_SATELLITE_DETECTIONS,
    farm10: MOCK_ERROR_DATA_UNAVAILABLE
};
function getMockGISTDAResponse(farmId) {
    return FARM_MOCK_RESPONSES[farmId] || MOCK_CLEAN_FARM_RESPONSE;
}
function generateMockResponse(farmId, latitude, longitude, noBurning = true) {
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
                end: '2026-01-30'
            }
        },
        result: {
            totalHotspots: noBurning ? 0 : 1,
            noBurningDetected: noBurning,
            eligibleForReward: noBurning,
            confidenceBreakdown: {
                high: noBurning ? 0 : 1,
                nominal: 0,
                low: 0
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
                    tambon_th: 'Unknown'
                }
            ],
            verificationHash: generateVerificationHash(farmId, timestamp)
        },
        metadata: {
            dataSource: 'GISTDA Hotspot Monitoring System',
            lastUpdated: timestamp,
            coverageArea: 'Thailand National Coverage',
            apiVersion: '2.1.0'
        }
    };
}
}),
"[project]/lib/data/mockData.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_BURNING_RECORDS",
    ()=>MOCK_BURNING_RECORDS,
    "MOCK_FARMS",
    ()=>MOCK_FARMS,
    "MOCK_PAYMENTS",
    ()=>MOCK_PAYMENTS
]);
const MOCK_FARMS = [
    {
        id: 'farm1',
        name: 'Green Valley Farm',
        owner: 'สมชาย ใจดี',
        walletAddress: '0x1234567890123456789012345678901234567890',
        location: {
            lat: 13.7563,
            lng: 100.5018
        },
        area: 25.5,
        registrationDate: '2024-01-15',
        lastCheckDate: '2026-01-28',
        hasBurning: false,
        burningIncidents: 0,
        insuranceStatus: 'active',
        rewardAmount: 500
    },
    {
        id: 'farm2',
        name: 'Sunrise Orchards',
        owner: 'นิรันดร์ สุขสวัสดิ์',
        walletAddress: '0x2345678901234567890123456789012345678901',
        location: {
            lat: 14.3532,
            lng: 100.5698
        },
        area: 18.2,
        registrationDate: '2024-02-20',
        lastCheckDate: '2026-01-28',
        hasBurning: true,
        burningIncidents: 2,
        insuranceStatus: 'ineligible',
        rewardAmount: 0
    },
    {
        id: 'farm3',
        name: 'Golden Harvest Fields',
        owner: 'อภิญญา วงศ์สกุล',
        walletAddress: '0x3456789012345678901234567890123456789012',
        location: {
            lat: 15.8700,
            lng: 100.9925
        },
        area: 42.0,
        registrationDate: '2024-03-10',
        lastCheckDate: '2026-01-28',
        hasBurning: false,
        burningIncidents: 0,
        insuranceStatus: 'paid',
        rewardAmount: 800
    },
    {
        id: 'farm4',
        name: 'River Bend Agriculture',
        owner: 'กิตติศักดิ์ เจริญผล',
        walletAddress: '0x4567890123456789012345678901234567890123',
        location: {
            lat: 16.4419,
            lng: 102.8359
        },
        area: 33.7,
        registrationDate: '2024-04-05',
        lastCheckDate: '2026-01-28',
        hasBurning: false,
        burningIncidents: 0,
        insuranceStatus: 'pending',
        rewardAmount: 650
    },
    {
        id: 'farm5',
        name: 'Mountain View Plantation',
        owner: 'ปราณี ศรีสุข',
        walletAddress: '0x5678901234567890123456789012345678901234',
        location: {
            lat: 18.7883,
            lng: 98.9853
        },
        area: 51.3,
        registrationDate: '2024-05-12',
        lastCheckDate: '2026-01-28',
        hasBurning: true,
        burningIncidents: 1,
        insuranceStatus: 'ineligible',
        rewardAmount: 0
    }
];
const MOCK_BURNING_RECORDS = [
    {
        farmId: 'farm2',
        date: '2026-01-10',
        severity: 'medium',
        verified: true
    },
    {
        farmId: 'farm2',
        date: '2026-01-22',
        severity: 'low',
        verified: true
    },
    {
        farmId: 'farm5',
        date: '2026-01-18',
        severity: 'high',
        verified: true
    }
];
const MOCK_PAYMENTS = [
    {
        farmId: 'farm1',
        amount: 500,
        timestamp: '2026-01-28T10:00:00Z',
        status: 'pending'
    },
    {
        farmId: 'farm3',
        amount: 800,
        timestamp: '2026-01-27T15:30:00Z',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'completed'
    },
    {
        farmId: 'farm4',
        amount: 650,
        timestamp: '2026-01-28T09:15:00Z',
        status: 'pending'
    }
];
}),
"[project]/app/api/gistda/verify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gistda/mockData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
;
;
;
// Generate a verification hash
function generateVerificationHash(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for(let i = 0; i < str.length; i++){
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
async function POST(request) {
    try {
        const body = await request.json();
        const { farmId, walletAddress, periodStart, periodEnd } = body;
        if (!farmId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'farmId is required',
                example: {
                    farmId: 'farm1',
                    walletAddress: '0x1234...',
                    periodStart: '2026-01-01',
                    periodEnd: '2026-01-30'
                }
            }, {
                status: 400
            });
        }
        // Get farm data
        const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === farmId);
        const farmWallet = walletAddress || farm?.walletAddress || '0x0000000000000000000000000000000000000000';
        const farmLat = farm?.location.lat || 13.7563;
        const farmLng = farm?.location.lng || 100.5018;
        // Get mock GISTDA response for this farm
        const gistdaResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockGISTDAResponse"])(farmId);
        const noBurning = gistdaResponse.result.noBurningDetected;
        // Calculate period
        const endDate = periodEnd ? new Date(periodEnd) : new Date();
        const startDate = periodStart ? new Date(periodStart) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        const daysVerified = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000));
        // Calculate reward amount (500 USDT base + 10 USDT per extra day over 30)
        const baseReward = 500;
        const bonusDays = Math.max(0, daysVerified - 30);
        const rewardAmount = noBurning ? baseReward + bonusDays * 10 : 0;
        // Build response
        const now = new Date();
        const verification = {
            farmId,
            walletAddress: farmWallet,
            status: noBurning ? 'CLEAN' : 'BURNING_DETECTED',
            noBurningDetected: noBurning,
            eligibleForReward: noBurning,
            verificationPeriod: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0],
                daysVerified
            },
            location: {
                latitude: farmLat,
                longitude: farmLng,
                bufferRadiusKm: 1
            },
            detectionSummary: {
                totalHotspots: gistdaResponse.result.totalHotspots,
                highConfidence: gistdaResponse.result.confidenceBreakdown.high,
                nominalConfidence: gistdaResponse.result.confidenceBreakdown.nominal,
                lowConfidence: gistdaResponse.result.confidenceBreakdown.low
            },
            reward: {
                eligible: noBurning,
                amount: rewardAmount,
                currency: 'USDT'
            }
        };
        const response = {
            success: true,
            verification,
            attestation: {
                hash: generateVerificationHash(verification),
                timestamp: now.toISOString(),
                issuer: 'GISTDA Mock Portal',
                expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
            },
            metadata: {
                apiVersion: '2.1.0',
                dataSource: 'GISTDA Hotspot Monitoring System (Mock)',
                disclaimer: 'This is mock data for development and testing purposes only.'
            }
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Verification failed'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const farmId = searchParams.get('farmId');
    if (!farmId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
                    periodEnd: 'ISO date (optional)'
                }
            },
            exampleRequest: {
                farmId: 'farm1',
                walletAddress: '0x1234567890123456789012345678901234567890',
                periodStart: '2026-01-01',
                periodEnd: '2026-01-30'
            },
            availableFarms: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].map((f)=>({
                    id: f.id,
                    name: f.name,
                    hasBurning: f.hasBurning
                }))
        });
    }
    // Allow GET with farmId for simple testing
    const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === farmId);
    if (!farm) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: `Farm not found: ${farmId}`,
            availableFarms: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].map((f)=>f.id)
        }, {
            status: 404
        });
    }
    // Redirect to POST-style response
    const gistdaResponse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getMockGISTDAResponse"])(farmId);
    const noBurning = gistdaResponse.result.noBurningDetected;
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        farmId,
        farmName: farm.name,
        owner: farm.owner,
        status: noBurning ? 'CLEAN' : 'BURNING_DETECTED',
        noBurningDetected: noBurning,
        eligibleForReward: noBurning,
        message: noBurning ? '✅ No burning detected - Eligible for reward' : '❌ Burning detected - Not eligible for reward',
        detectionCount: gistdaResponse.result.totalHotspots,
        hint: 'Use POST method for full verification response suitable for zkTLS'
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7d165fc2._.js.map