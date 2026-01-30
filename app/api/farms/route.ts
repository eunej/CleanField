import { NextResponse } from 'next/server';
import { MOCK_FARMS } from '@/lib/data/mockData';

export async function GET() {
  return NextResponse.json(MOCK_FARMS);
}
