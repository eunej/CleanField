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
"[project]/lib/gistda/hotspotChecker.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// GISTDA Hotspot Detection Service
// Checks for fire/burning hotspots at farm locations using GISTDA's API
__turbopack_context__.s([
    "checkFarmHotspots",
    ()=>checkFarmHotspots,
    "generateProofHash",
    ()=>generateProofHash
]);
async function checkFarmHotspots(farmId, farmLat, farmLng, bufferKm = 1) {
    // Convert km to approximate degrees (1 degree ≈ 111km at equator)
    const buffer = bufferKm / 111;
    // Build GISTDA API URL
    // Query for agricultural land ('พื้นที่เกษตร') hotspots within bounding box
    const baseUrl = 'https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/hotspot_npp_daily/MapServer/0/query';
    const params = new URLSearchParams({
        where: "lu_name='พื้นที่เกษตร'",
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
                'Accept': 'application/json'
            },
            // Add timeout
            signal: AbortSignal.timeout(30000)
        });
        if (!response.ok) {
            throw new Error(`GISTDA API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Check for API error response
        if (data.error) {
            throw new Error(`GISTDA API error: ${data.error.message}`);
        }
        // Parse hotspot features
        const hotspots = (data.features || []).map((feature)=>({
                objectId: feature.attributes.OBJECTID,
                latitude: feature.attributes.latitude || feature.geometry?.y || 0,
                longitude: feature.attributes.longitude || feature.geometry?.x || 0,
                acqDate: feature.attributes.acq_date,
                confidence: feature.attributes.confidence,
                brightness: feature.attributes.brightness,
                luName: feature.attributes.lu_name
            }));
        const hotspotsDetected = hotspots.length;
        const noBurningDetected = hotspotsDetected === 0;
        return {
            farmId,
            farmLat,
            farmLng,
            hotspotsDetected,
            noBurningDetected,
            eligible: noBurningDetected,
            checkDate: new Date().toISOString(),
            hotspots
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
            error: errorMessage
        };
    }
}
function generateProofHash(result) {
    const data = JSON.stringify({
        farmId: result.farmId,
        lat: result.farmLat,
        lng: result.farmLng,
        noBurning: result.noBurningDetected,
        checkDate: result.checkDate,
        hotspotsCount: result.hotspotsDetected
    });
    // Simple hash for demo - in production, this would be zkTLS proof
    let hash = 0;
    for(let i = 0; i < data.length; i++){
        const char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
}),
"[project]/app/api/farms/[id]/verify/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$hotspotChecker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/gistda/hotspotChecker.ts [app-route] (ecmascript)");
;
;
;
async function POST(request, context) {
    const { id } = await context.params;
    const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === id);
    if (!farm) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Farm not found'
        }, {
            status: 404
        });
    }
    try {
        // Check for hotspots at farm location using GISTDA API
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$hotspotChecker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkFarmHotspots"])(farm.id, farm.location.lat, farm.location.lng, 1 // 1km buffer
        );
        // Generate proof hash (would be zkTLS proof in production)
        const proofHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gistda$2f$hotspotChecker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateProofHash"])(result);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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
                hotspots: result.hotspots
            },
            error: result.error
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: errorMessage,
            farmId: farm.id
        }, {
            status: 500
        });
    }
}
async function GET(request, context) {
    const { id } = await context.params;
    const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === id);
    if (!farm) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Farm not found'
        }, {
            status: 404
        });
    }
    // Return farm's current status and location for verification
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        farmId: farm.id,
        farmName: farm.name,
        location: farm.location,
        currentStatus: {
            hasBurning: farm.hasBurning,
            burningIncidents: farm.burningIncidents,
            insuranceStatus: farm.insuranceStatus
        },
        gistdaApiUrl: buildGistdaUrl(farm.location.lat, farm.location.lng)
    });
}
function buildGistdaUrl(lat, lng, buffer = 0.01) {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__30e965a0._.js.map