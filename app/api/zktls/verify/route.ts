import { NextResponse } from 'next/server';
import { verifyAttestation, AttestationResult } from '@/lib/zktls';

/**
 * POST /api/zktls/verify
 * 
 * Verify a zkTLS attestation
 * 
 * Request body:
 * - attestation: AttestationResult - The attestation to verify
 * 
 * Response:
 * - verified: boolean - Whether the attestation is valid
 * - attestation: The verified attestation (if valid)
 * - error: Error message (if invalid)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attestation } = body;

    if (!attestation) {
      return NextResponse.json(
        { success: false, error: 'Attestation data is required' },
        { status: 400 }
      );
    }

    // Reconstruct attestation result
    const attestationResult: AttestationResult = {
      success: attestation.success ?? true,
      attestationId: attestation.id || attestation.attestationId,
      timestamp: attestation.timestamp,
      data: attestation.data,
      proof: attestation.proof,
      rawResponse: attestation.rawResponse,
    };

    // Verify the attestation
    const verification = await verifyAttestation(attestationResult);

    return NextResponse.json({
      success: verification.verified,
      verified: verification.verified,
      attestation: verification.attestation,
      error: verification.error,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('zkTLS verification error:', error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        error: error instanceof Error ? error.message : 'Verification failed',
      },
      { status: 500 }
    );
  }
}
