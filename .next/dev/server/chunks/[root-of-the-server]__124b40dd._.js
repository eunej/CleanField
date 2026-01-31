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
"[project]/app/api/farms/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
;
;
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
    const payments = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_PAYMENTS"].filter((p)=>p.farmId === id);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        farm,
        payments
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__124b40dd._.js.map