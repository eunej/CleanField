import { NextResponse } from 'next/server';
import { MOCK_FARMS, MOCK_PAYMENTS } from '@/lib/data/mockData';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const farm = MOCK_FARMS.find(f => f.id === id);

  if (!farm) {
    return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
  }

  const payments = MOCK_PAYMENTS.filter(p => p.farmId === id);

  return NextResponse.json({
    farm,
    payments,
  });
}
