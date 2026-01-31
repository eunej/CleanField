import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';
import { getFarmPaymentHistory, getTotalDistributed } from '@/lib/payments';

/**
 * GET /api/claim/history
 * 
 * Get payment history for a farm or all farms
 * 
 * Query params:
 * - farmId: string - Farm identifier (optional, returns all if not provided)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const farmId = searchParams.get('farmId');

  if (farmId) {
    const farm = MOCK_FARMS.find(f => f.id === farmId);
    if (!farm) {
      return NextResponse.json(
        { success: false, error: 'Farm not found' },
        { status: 404 }
      );
    }

    const history = getFarmPaymentHistory(farmId);

    return NextResponse.json({
      success: true,
      farm: {
        id: farm.id,
        name: farm.name,
        owner: farm.owner,
        walletAddress: farm.walletAddress,
      },
      history,
    });
  }

  // Return history for all farms
  const allHistory = MOCK_FARMS.map(farm => ({
    farm: {
      id: farm.id,
      name: farm.name,
      owner: farm.owner,
    },
    ...getFarmPaymentHistory(farm.id),
  }));

  const totalStats = getTotalDistributed();

  return NextResponse.json({
    success: true,
    stats: totalStats,
    farms: allHistory,
  });
}
