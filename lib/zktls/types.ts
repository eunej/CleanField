// Primus zkTLS Types for GISTDA Integration

export interface ZkTLSConfig {
  appId: string;
  appSecret: string;
  templateId: string;
  mode: 'proxytls' | 'mpctls';
}

export interface AttestationRequest {
  templateId: string;
  userAddress: string;
  mode: 'proxytls' | 'mpctls';
  conditions?: AttestationCondition[][];
}

export interface AttestationCondition {
  field: string;
  op: 'SHA256' | '>' | '<' | '=' | '!=' | '>=' | '<=';
  value?: string;
}

export interface AttestationResult {
  success: boolean;
  attestationId: string;
  timestamp: number;
  data: {
    farmId: string;
    gistdaId: string;
    noBurningDetected: boolean;
    hotspotsCount: number;
    checkDate: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  proof: {
    hash: string;
    signature: string;
    attestorPublicKey: string;
  };
  rawResponse?: unknown;
  usedPrimusSDK?: boolean;
}

export interface VerificationResult {
  verified: boolean;
  attestation: AttestationResult | null;
  error?: string;
}

export interface GISTDAHotspotData {
  totalHotspots: number;
  hotspots: Array<{
    latitude: number;
    longitude: number;
    acquisitionDate: string;
    confidence: string;
    brightness: number;
    landUse: string;
  }>;
  queryArea: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  status: 'NO_BURNING' | 'BURNING_DETECTED' | 'ERROR';
}

// GISTDA API Response structure
export interface GISTDAApiResponse {
  features?: Array<{
    attributes: {
      OBJECTID: number;
      latitude: number;
      longitude: number;
      acq_date: string;
      confidence: string;
      brightness: number;
      lu_name: string;
    };
    geometry?: {
      x: number;
      y: number;
    };
  }>;
  error?: {
    code: number;
    message: string;
  };
}

// Primus SDK Response Types (based on official SDK)
export interface PrimusAttestationResponse {
  attestation: {
    id: string;
    timestamp: string;
    data: Record<string, unknown>;
    signature: string;
    publicKey: string;
  };
  verified: boolean;
}
