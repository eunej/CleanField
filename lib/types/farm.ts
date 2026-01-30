// Farm data types
export interface Farm {
  id: string;
  name: string;
  owner: string;
  walletAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  area: number; // in hectares
  registrationDate: string;
  lastCheckDate: string;
  hasBurning: boolean;
  burningIncidents: number;
  insuranceStatus: 'active' | 'pending' | 'paid' | 'ineligible';
  rewardAmount: number; // in USDT
}

export interface BurningRecord {
  farmId: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  verified: boolean;
}

export interface InsurancePayment {
  farmId: string;
  amount: number;
  timestamp: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
}
