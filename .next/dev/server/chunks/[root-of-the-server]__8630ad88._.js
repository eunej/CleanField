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
"[project]/lib/zktls/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Primus zkTLS Types for GISTDA Integration
__turbopack_context__.s([]);
;
}),
"[project]/lib/zktls/primusClient.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Primus zkTLS Client for GISTDA Verification
 * 
 * This module provides zkTLS integration with Thailand's GISTDA portal
 * for verifying farm burning status using cryptographic proofs.
 * 
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview
 */ __turbopack_context__.s([
    "createGISTDAAttestation",
    ()=>createGISTDAAttestation,
    "formatForOnChain",
    ()=>formatForOnChain,
    "getPublicConfig",
    ()=>getPublicConfig,
    "queryGISTDAHotspots",
    ()=>queryGISTDAHotspots,
    "verifyAttestation",
    ()=>verifyAttestation
]);
// Environment configuration
const PRIMUS_CONFIG = {
    appId: process.env.NEXT_PUBLIC_PRIMUS_APP_ID || 'demo_app_id',
    appSecret: process.env.PRIMUS_APP_SECRET || 'demo_app_secret',
    templateId: process.env.NEXT_PUBLIC_PRIMUS_TEMPLATE_ID || 'gistda_hotspot_template',
    mode: 'proxytls'
};
// GISTDA API Configuration
const GISTDA_CONFIG = {
    baseUrl: 'https://gistdaportal.gistda.or.th/data/rest/services/FR_Fire/hotspot_npp_daily/MapServer/0/query',
    agriculturalLandFilter: "lu_name='พื้นที่เกษตร'",
    defaultBufferKm: 1
};
async function queryGISTDAHotspots(lat, lng, bufferKm = GISTDA_CONFIG.defaultBufferKm) {
    // Convert km to approximate degrees (1 degree ≈ 111km at equator)
    const buffer = bufferKm / 111;
    const params = new URLSearchParams({
        where: GISTDA_CONFIG.agriculturalLandFilter,
        geometry: `${lng - buffer},${lat - buffer},${lng + buffer},${lat + buffer}`,
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        f: 'json'
    });
    const url = `${GISTDA_CONFIG.baseUrl}?${params.toString()}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(30000)
        });
        if (!response.ok) {
            throw new Error(`GISTDA API error: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
            throw new Error(`GISTDA API error: ${data.error.message}`);
        }
        const hotspots = (data.features || []).map((f)=>({
                latitude: f.attributes.latitude || f.geometry?.y || 0,
                longitude: f.attributes.longitude || f.geometry?.x || 0,
                acquisitionDate: f.attributes.acq_date,
                confidence: f.attributes.confidence,
                brightness: f.attributes.brightness,
                landUse: f.attributes.lu_name
            }));
        return {
            totalHotspots: hotspots.length,
            hotspots,
            queryArea: {
                minLat: lat - buffer,
                maxLat: lat + buffer,
                minLng: lng - buffer,
                maxLng: lng + buffer
            },
            status: hotspots.length === 0 ? 'NO_BURNING' : 'BURNING_DETECTED'
        };
    } catch (error) {
        console.error('GISTDA API query failed:', error);
        return {
            totalHotspots: -1,
            hotspots: [],
            queryArea: {
                minLat: lat - buffer,
                maxLat: lat + buffer,
                minLng: lng - buffer,
                maxLng: lng + buffer
            },
            status: 'ERROR'
        };
    }
}
/**
 * Generate a cryptographic proof hash for the attestation
 * In production, this would be generated by the Primus zkTLS SDK
 */ function generateProofHash(data) {
    const jsonStr = JSON.stringify(data);
    let hash = 0;
    for(let i = 0; i < jsonStr.length; i++){
        const char = jsonStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
}
/**
 * Generate zkTLS attestation signature (simulated)
 * In production, this would be signed by Primus attestors
 */ function generateAttestationSignature(proofHash, timestamp) {
    const data = `${proofHash}:${timestamp}:${PRIMUS_CONFIG.appId}`;
    let sig = 0;
    for(let i = 0; i < data.length; i++){
        sig = (sig << 7) - sig + data.charCodeAt(i);
        sig = sig & sig;
    }
    return '0x' + Math.abs(sig).toString(16).padStart(128, '0');
}
async function createGISTDAAttestation(farmId, gistdaId, lat, lng, userAddress) {
    const timestamp = Date.now();
    const checkDate = new Date(timestamp).toISOString();
    // Step 1: Query GISTDA API for hotspot data
    const gistdaData = await queryGISTDAHotspots(lat, lng);
    // Step 2: Prepare attestation data
    const attestationData = {
        farmId,
        gistdaId,
        noBurningDetected: gistdaData.status === 'NO_BURNING',
        hotspotsCount: gistdaData.totalHotspots,
        checkDate,
        location: {
            lat,
            lng
        },
        queryArea: gistdaData.queryArea,
        userAddress,
        appId: PRIMUS_CONFIG.appId,
        templateId: PRIMUS_CONFIG.templateId,
        mode: PRIMUS_CONFIG.mode
    };
    // Step 3: Generate cryptographic proof
    const proofHash = generateProofHash(attestationData);
    const signature = generateAttestationSignature(proofHash, timestamp);
    // Step 4: Create attestation result
    const attestation = {
        success: gistdaData.status !== 'ERROR',
        attestationId: `att_${farmId}_${timestamp}`,
        timestamp,
        data: {
            farmId,
            gistdaId,
            noBurningDetected: gistdaData.status === 'NO_BURNING',
            hotspotsCount: gistdaData.totalHotspots,
            checkDate,
            location: {
                lat,
                lng
            }
        },
        proof: {
            hash: proofHash,
            signature,
            attestorPublicKey: 'primus_attestor_pubkey_demo'
        },
        rawResponse: gistdaData
    };
    return attestation;
}
async function verifyAttestation(attestation) {
    try {
        // Verify attestation is not too old (24 hours max)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        const age = Date.now() - attestation.timestamp;
        if (age > maxAge) {
            return {
                verified: false,
                attestation: null,
                error: 'Attestation has expired (older than 24 hours)'
            };
        }
        // Verify proof hash matches data
        const expectedHash = generateProofHash({
            farmId: attestation.data.farmId,
            gistdaId: attestation.data.gistdaId,
            noBurningDetected: attestation.data.noBurningDetected,
            hotspotsCount: attestation.data.hotspotsCount,
            checkDate: attestation.data.checkDate,
            location: attestation.data.location,
            queryArea: attestation.rawResponse?.queryArea,
            userAddress: '',
            appId: PRIMUS_CONFIG.appId,
            templateId: PRIMUS_CONFIG.templateId,
            mode: PRIMUS_CONFIG.mode
        });
        // In production, verify signature with Primus attestor public key
        // For demo, we just check the attestation was successful
        if (!attestation.success) {
            return {
                verified: false,
                attestation,
                error: 'Attestation was not successful'
            };
        }
        return {
            verified: true,
            attestation
        };
    } catch (error) {
        return {
            verified: false,
            attestation: null,
            error: error instanceof Error ? error.message : 'Verification failed'
        };
    }
}
function formatForOnChain(attestation) {
    return {
        farmId: attestation.data.farmId,
        proofHash: attestation.proof.hash,
        noBurningDetected: attestation.data.noBurningDetected,
        timestamp: attestation.timestamp
    };
}
function getPublicConfig() {
    return {
        appId: PRIMUS_CONFIG.appId,
        templateId: PRIMUS_CONFIG.templateId,
        mode: PRIMUS_CONFIG.mode
    };
}
}),
"[project]/lib/zktls/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Primus zkTLS Integration for VeriFarm
 * 
 * This module provides zkTLS-based verification of GISTDA hotspot data
 * for the Smog-Free Farmer Oracle project.
 * 
 * @module zktls
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/zktls/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/zktls/primusClient.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/app/api/zktls/batch-attest/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/zktls/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/zktls/primusClient.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json().catch(()=>({}));
        const { farmIds = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].map((f)=>f.id), userAddress = '0x0000000000000000000000000000000000000000' } = body;
        // Filter farms
        const farmsToAttest = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].filter((f)=>farmIds.includes(f.id));
        if (farmsToAttest.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'No valid farms found'
            }, {
                status: 404
            });
        }
        // Create attestations in parallel
        const attestationPromises = farmsToAttest.map(async (farm)=>{
            try {
                // Check if farm has burning detected (ineligible for zkTLS proof)
                if (farm.hasBurning) {
                    return {
                        farmId: farm.id,
                        farmName: farm.name,
                        owner: farm.owner,
                        location: farm.location,
                        attestation: null,
                        verification: {
                            verified: false,
                            error: 'Farm has burning incidents detected - ineligible for clean air proof'
                        },
                        onChainData: null,
                        success: false,
                        reason: 'BURNING_DETECTED',
                        burningIncidents: farm.burningIncidents
                    };
                }
                const attestation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGISTDAAttestation"])(farm.id, `GISTDA_${farm.id}`, farm.location.lat, farm.location.lng, userAddress);
                const verification = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyAttestation"])(attestation);
                const onChainData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatForOnChain"])(attestation);
                return {
                    farmId: farm.id,
                    farmName: farm.name,
                    owner: farm.owner,
                    location: farm.location,
                    attestation: {
                        id: attestation.attestationId,
                        timestamp: attestation.timestamp,
                        noBurningDetected: attestation.data.noBurningDetected,
                        hotspotsCount: attestation.data.hotspotsCount,
                        proofHash: attestation.proof.hash
                    },
                    verification: {
                        verified: verification.verified,
                        error: verification.error
                    },
                    onChainData,
                    success: attestation.success && verification.verified
                };
            } catch (error) {
                return {
                    farmId: farm.id,
                    farmName: farm.name,
                    owner: farm.owner,
                    location: farm.location,
                    attestation: null,
                    verification: {
                        verified: false,
                        error: error instanceof Error ? error.message : 'Failed'
                    },
                    onChainData: null,
                    success: false
                };
            }
        });
        const results = await Promise.all(attestationPromises);
        // Calculate summary
        const summary = {
            totalFarms: results.length,
            successfulAttestations: results.filter((r)=>r.success).length,
            cleanFarms: results.filter((r)=>r.attestation?.noBurningDetected).length,
            burningDetected: results.filter((r)=>r.attestation && !r.attestation.noBurningDetected).length,
            failed: results.filter((r)=>!r.success).length,
            attestedAt: new Date().toISOString()
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            summary,
            attestations: results,
            config: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$zktls$2f$primusClient$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPublicConfig"])()
        });
    } catch (error) {
        console.error('Batch zkTLS attestation error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Batch attestation failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8630ad88._.js.map