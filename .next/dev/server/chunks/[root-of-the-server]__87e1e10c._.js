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
"[project]/lib/payments/types.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Payment Types for Clean Air Incentive System
__turbopack_context__.s([]);
;
}),
"[project]/lib/payments/paymentService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Clean Air Incentive Payment Service
 * 
 * Handles THB payments to farmers after zkTLS proof verification.
 * Reward: THB 5,000 per hectare per year for maintaining clean air practices.
 */ __turbopack_context__.s([
    "calculateRewardAmount",
    ()=>calculateRewardAmount,
    "checkClaimEligibility",
    ()=>checkClaimEligibility,
    "estimateClaimGas",
    ()=>estimateClaimGas,
    "getFarmPaymentHistory",
    ()=>getFarmPaymentHistory,
    "getPaymentConfig",
    ()=>getPaymentConfig,
    "getPendingClaims",
    ()=>getPendingClaims,
    "getTotalDistributed",
    ()=>getTotalDistributed,
    "processClaimReward",
    ()=>processClaimReward
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
;
// Payment Configuration
const PAYMENT_CONFIG = {
    contractAddress: process.env.NEXT_PUBLIC_PAYMENT_CONTRACT || '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
    oracleContractAddress: process.env.NEXT_PUBLIC_ORACLE_CONTRACT || '0x0000000000000000000000000000000000000000',
    rewardPerHectare: 5000,
    currency: 'THB',
    claimPeriodDays: 365,
    network: 'sepolia'
};
function calculateRewardAmount(farmId) {
    const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === farmId);
    if (!farm) return 0;
    // Reward = THB 5,000 × farm area (in hectares)
    return Math.round(PAYMENT_CONFIG.rewardPerHectare * farm.area);
}
// In-memory storage for demo (would be database in production)
const paymentRecords = new Map();
const lastClaimDates = new Map();
/**
 * Generate a mock transaction hash
 */ function generateMockTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for(let i = 0; i < 64; i++){
        hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
}
function checkClaimEligibility(farmId, noBurningDetected, proofVerified) {
    // Check 1: Proof must show no burning
    if (!noBurningDetected) {
        return {
            isEligible: false,
            reason: 'Burning detected in zkTLS proof. Farm is not eligible for clean air incentive.'
        };
    }
    // Check 2: Proof must be verified
    if (!proofVerified) {
        return {
            isEligible: false,
            reason: 'zkTLS proof verification failed. Please generate a new attestation.'
        };
    }
    // Check 3: Must wait for claim period since last claim
    const lastClaim = lastClaimDates.get(farmId);
    if (lastClaim) {
        const lastClaimDate = new Date(lastClaim);
        const nextClaimDate = new Date(lastClaimDate);
        nextClaimDate.setDate(nextClaimDate.getDate() + PAYMENT_CONFIG.claimPeriodDays);
        const now = new Date();
        if (now < nextClaimDate) {
            const daysUntilNextClaim = Math.ceil((nextClaimDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return {
                isEligible: false,
                reason: `Must wait ${daysUntilNextClaim} more days before next claim. Claim period is ${PAYMENT_CONFIG.claimPeriodDays} days.`,
                lastClaimDate: lastClaim,
                nextClaimDate: nextClaimDate.toISOString(),
                daysUntilNextClaim
            };
        }
    }
    return {
        isEligible: true,
        reason: 'Farm is eligible for clean air incentive payment.',
        lastClaimDate: lastClaim,
        nextClaimDate: lastClaim ? new Date(new Date(lastClaim).getTime() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString() : undefined
    };
}
async function processClaimReward(request) {
    const { farmId, walletAddress, attestationId, proofHash, noBurningDetected, timestamp } = request;
    // Check eligibility
    const eligibility = checkClaimEligibility(farmId, noBurningDetected, true);
    if (!eligibility.isEligible) {
        return {
            success: false,
            farmId,
            walletAddress,
            amount: 0,
            currency: 'USDT',
            status: 'ineligible',
            message: eligibility.reason,
            eligibility: {
                isEligible: false,
                reason: eligibility.reason,
                noBurningDetected,
                proofVerified: true,
                lastClaimDate: eligibility.lastClaimDate,
                nextClaimDate: eligibility.nextClaimDate
            }
        };
    }
    try {
        // In production, this would:
        // 1. Submit proof to SmogFreeOracle contract
        // 2. Call claimReward() function
        // 3. Wait for transaction confirmation
        // Simulate processing delay
        await new Promise((resolve)=>setTimeout(resolve, 1500));
        // Generate mock transaction hash
        const txHash = generateMockTxHash();
        const now = new Date().toISOString();
        const rewardAmount = calculateRewardAmount(farmId);
        // Create payment record
        const payment = {
            id: `pay_${farmId}_${Date.now()}`,
            farmId,
            walletAddress,
            amount: rewardAmount,
            currency: PAYMENT_CONFIG.currency,
            txHash,
            status: 'completed',
            attestationId,
            proofHash,
            createdAt: now,
            completedAt: now
        };
        // Store payment record
        const farmPayments = paymentRecords.get(farmId) || [];
        farmPayments.push(payment);
        paymentRecords.set(farmId, farmPayments);
        // Update last claim date
        lastClaimDates.set(farmId, now);
        return {
            success: true,
            farmId,
            walletAddress,
            amount: rewardAmount,
            currency: PAYMENT_CONFIG.currency,
            txHash,
            status: 'completed',
            message: `Successfully transferred ฿${rewardAmount.toLocaleString()} to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            claimedAt: now,
            eligibility: {
                isEligible: true,
                reason: 'Claim processed successfully',
                noBurningDetected: true,
                proofVerified: true,
                lastClaimDate: now,
                nextClaimDate: new Date(Date.now() + PAYMENT_CONFIG.claimPeriodDays * 24 * 60 * 60 * 1000).toISOString()
            }
        };
    } catch (error) {
        return {
            success: false,
            farmId,
            walletAddress,
            amount: 0,
            currency: 'USDT',
            status: 'failed',
            message: error instanceof Error ? error.message : 'Payment processing failed',
            eligibility: {
                isEligible: true,
                reason: 'Eligible but payment failed',
                noBurningDetected,
                proofVerified: true
            }
        };
    }
}
function getFarmPaymentHistory(farmId) {
    const payments = paymentRecords.get(farmId) || [];
    const completedPayments = payments.filter((p)=>p.status === 'completed');
    const totalClaimed = completedPayments.reduce((sum, p)=>sum + p.amount, 0);
    return {
        farmId,
        totalClaimed,
        totalPayments: completedPayments.length,
        lastClaimDate: lastClaimDates.get(farmId),
        payments
    };
}
function getPaymentConfig() {
    return {
        paymentContract: PAYMENT_CONFIG.contractAddress,
        oracleContract: PAYMENT_CONFIG.oracleContractAddress,
        rewardPerHectare: PAYMENT_CONFIG.rewardPerHectare,
        currency: PAYMENT_CONFIG.currency,
        claimPeriodDays: PAYMENT_CONFIG.claimPeriodDays,
        network: PAYMENT_CONFIG.network
    };
}
function estimateClaimGas() {
    // Mock gas estimation
    return {
        gasLimit: '150000',
        estimatedCostEth: '0.003',
        estimatedCostUsd: '$7.50'
    };
}
function getPendingClaims() {
    const allPending = [];
    paymentRecords.forEach((payments)=>{
        payments.filter((p)=>p.status === 'pending').forEach((p)=>allPending.push(p));
    });
    return allPending;
}
function getTotalDistributed() {
    let totalAmount = 0;
    let totalClaims = 0;
    const uniqueFarms = new Set();
    paymentRecords.forEach((payments, farmId)=>{
        const completed = payments.filter((p)=>p.status === 'completed');
        if (completed.length > 0) {
            uniqueFarms.add(farmId);
            totalClaims += completed.length;
            totalAmount += completed.reduce((sum, p)=>sum + p.amount, 0);
        }
    });
    return {
        totalAmount,
        totalClaims,
        uniqueFarms: uniqueFarms.size
    };
}
}),
"[project]/lib/payments/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Clean Air Incentive Payment System
 * 
 * This module handles THB payments to farmers who submit valid
 * zkTLS proofs showing no burning detected.
 * Reward: THB 5,000 per hectare per year.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$types$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments/types.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments/paymentService.ts [app-route] (ecmascript)");
;
;
;
}),
"[project]/app/api/claim/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/data/mockData.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/payments/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/payments/paymentService.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { farmId, attestationId, proofHash, noBurningDetected, timestamp } = body;
        // Validate required fields
        if (!farmId || !attestationId || !proofHash || noBurningDetected === undefined) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing required fields: farmId, attestationId, proofHash, noBurningDetected'
            }, {
                status: 400
            });
        }
        // Find farm
        const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === farmId);
        if (!farm) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Farm not found'
            }, {
                status: 404
            });
        }
        // Create claim request
        const claimRequest = {
            farmId,
            walletAddress: farm.walletAddress,
            attestationId,
            proofHash,
            noBurningDetected,
            timestamp: timestamp || Date.now()
        };
        // Process the claim
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["processClaimReward"])(claimRequest);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...result,
            farm: {
                id: farm.id,
                name: farm.name,
                owner: farm.owner
            },
            config: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPaymentConfig"])()
        });
    } catch (error) {
        console.error('Claim processing error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'Claim processing failed'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get('farmId');
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPaymentConfig"])();
    const gasEstimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["estimateClaimGas"])();
    const totalDistributed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTotalDistributed"])();
    if (farmId) {
        const farm = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$data$2f$mockData$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MOCK_FARMS"].find((f)=>f.id === farmId);
        if (!farm) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Farm not found'
            }, {
                status: 404
            });
        }
        // Check eligibility (assuming no burning for eligibility check)
        const eligibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkClaimEligibility"])(farmId, !farm.hasBurning, true);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            farmId,
            farm: {
                name: farm.name,
                owner: farm.owner,
                walletAddress: farm.walletAddress,
                hasBurning: farm.hasBurning,
                area: farm.area,
                calculatedReward: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$payments$2f$paymentService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateRewardAmount"])(farmId)
            },
            eligibility,
            config,
            gasEstimate
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        name: 'Clean Air Incentive Payment System',
        description: 'Submit zkTLS proof of no burning to claim THB rewards (฿5,000/ha/year)',
        config,
        gasEstimate,
        stats: totalDistributed,
        endpoints: {
            claim: 'POST /api/claim',
            checkEligibility: 'GET /api/claim?farmId=<farmId>',
            history: 'GET /api/claim/history?farmId=<farmId>'
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__87e1e10c._.js.map