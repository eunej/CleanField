import { Farm, BurningRecord, InsurancePayment } from '@/lib/types/farm';

// Mock farm data
export const MOCK_FARMS: Farm[] = [
  {
    id: 'farm1',
    name: 'Green Valley Farm',
    owner: 'สมชาย ใจดี',
    walletAddress: '0x1234567890123456789012345678901234567890',
    location: { lat: 13.7563, lng: 100.5018 },
    area: 25.5,
    registrationDate: '2024-01-15',
    lastCheckDate: '2026-01-28',
    hasBurning: false,
    burningIncidents: 0,
    eligibilityStatus: 'eligible',
    rewardAmount: 127500, // 25.5 ha × ฿5,000/ha/year
  },
  {
    id: 'farm2',
    name: 'Sunrise Orchards',
    owner: 'นิรันดร์ สุขสวัสดิ์',
    walletAddress: '0x2345678901234567890123456789012345678901',
    location: { lat: 14.3532, lng: 100.5698 },
    area: 18.2,
    registrationDate: '2024-02-20',
    lastCheckDate: '2026-01-28',
    hasBurning: true,
    burningIncidents: 2,
    eligibilityStatus: 'ineligible',
    rewardAmount: 0,
  },
  {
    id: 'farm3',
    name: 'Golden Harvest Fields',
    owner: 'อภิญญา วงศ์สกุล',
    walletAddress: '0x3456789012345678901234567890123456789012',
    location: { lat: 15.8700, lng: 100.9925 },
    area: 42.0,
    registrationDate: '2024-03-10',
    lastCheckDate: '2026-01-28',
    hasBurning: false,
    burningIncidents: 0,
    eligibilityStatus: 'paid',
    rewardAmount: 210000, // 42.0 ha × ฿5,000/ha/year
  },
  {
    id: 'farm4',
    name: 'River Bend Agriculture',
    owner: 'กิตติศักดิ์ เจริญผล',
    walletAddress: '0x4567890123456789012345678901234567890123',
    location: { lat: 16.4419, lng: 102.8359 },
    area: 33.7,
    registrationDate: '2024-04-05',
    lastCheckDate: '2026-01-28',
    hasBurning: false,
    burningIncidents: 0,
    eligibilityStatus: 'pending',
    rewardAmount: 168500, // 33.7 ha × ฿5,000/ha/year
  },
  {
    id: 'farm5',
    name: 'Mountain View Plantation',
    owner: 'ปราณี ศรีสุข',
    walletAddress: '0x5678901234567890123456789012345678901234',
    location: { lat: 18.7883, lng: 98.9853 },
    area: 51.3,
    registrationDate: '2024-05-12',
    lastCheckDate: '2026-01-28',
    hasBurning: true,
    burningIncidents: 1,
    eligibilityStatus: 'ineligible',
    rewardAmount: 0,
  },
];

// Mock burning records
export const MOCK_BURNING_RECORDS: BurningRecord[] = [
  {
    farmId: 'farm2',
    date: '2026-01-10',
    severity: 'medium',
    verified: true,
  },
  {
    farmId: 'farm2',
    date: '2026-01-22',
    severity: 'low',
    verified: true,
  },
  {
    farmId: 'farm5',
    date: '2026-01-18',
    severity: 'high',
    verified: true,
  },
];

// Mock insurance payments (THB ฿5,000/ha/year)
export const MOCK_PAYMENTS: InsurancePayment[] = [
  {
    farmId: 'farm1',
    amount: 127500, // 25.5 ha × ฿5,000/ha/year
    timestamp: '2026-01-28T10:00:00Z',
    status: 'pending',
  },
  {
    farmId: 'farm3',
    amount: 210000, // 42.0 ha × ฿5,000/ha/year
    timestamp: '2026-01-27T15:30:00Z',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'completed',
  },
  {
    farmId: 'farm4',
    amount: 168500, // 33.7 ha × ฿5,000/ha/year
    timestamp: '2026-01-28T09:15:00Z',
    status: 'pending',
  },
];
