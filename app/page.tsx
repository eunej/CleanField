'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Farm } from '@/lib/types/farm';

interface VerificationResult {
  farmId: string;
  farmName: string;
  location: { lat: number; lng: number };
  verification: {
    hotspotsDetected: number;
    noBurningDetected: boolean;
    eligible: boolean;
    checkDate: string;
    proofHash: string;
  };
  error?: string;
}

interface BulkVerificationResponse {
  success: boolean;
  summary?: {
    totalFarms: number;
    cleanFarms: number;
    burningFarms: number;
    errorFarms: number;
    verifiedAt: string;
  };
  results?: VerificationResult[];
  error?: string;
}

interface ZkTLSAttestationResult {
  farmId: string;
  farmName: string;
  owner: string;
  location: { lat: number; lng: number };
  attestation?: {
    id: string;
    timestamp: number;
    noBurningDetected: boolean;
    hotspotsCount: number;
    proofHash: string;
  };
  verification: {
    verified: boolean;
    error?: string;
  };
  onChainData?: {
    farmId: string;
    proofHash: string;
    noBurningDetected: boolean;
    timestamp: number;
  };
  success: boolean;
}

interface ZkTLSBatchResponse {
  success: boolean;
  summary?: {
    totalFarms: number;
    successfulAttestations: number;
    cleanFarms: number;
    burningDetected: number;
    failed: number;
    attestedAt: string;
  };
  attestations?: ZkTLSAttestationResult[];
  config?: {
    appId: string;
    templateId: string;
    mode: string;
  };
  error?: string;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<BulkVerificationResponse | null>(null);
  const [zkTLSAttesting, setZkTLSAttesting] = useState(false);
  const [zkTLSResults, setZkTLSResults] = useState<ZkTLSBatchResponse | null>(null);

  // Delay rendering until mounted to avoid hydration mismatch from browser extensions
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchFarms();
    }
  }, [mounted]);

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farms');
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAll = async () => {
    setVerifying(true);
    setVerificationResults(null);
    
    try {
      const response = await fetch('/api/farms/verify-all', {
        method: 'POST',
      });
      const data: BulkVerificationResponse = await response.json();
      setVerificationResults(data);
    } catch (error) {
      console.error('Error verifying farms:', error);
      setVerificationResults({
        success: false,
        error: 'Failed to connect to verification service',
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleZkTLSBatchAttest = async () => {
    setZkTLSAttesting(true);
    setZkTLSResults(null);
    
    try {
      const response = await fetch('/api/zktls/batch-attest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data: ZkTLSBatchResponse = await response.json();
      setZkTLSResults(data);
    } catch (error) {
      console.error('Error creating zkTLS attestations:', error);
      setZkTLSResults({
        success: false,
        error: 'Failed to connect to zkTLS service',
      });
    } finally {
      setZkTLSAttesting(false);
    }
  };

  // Return null before mounting to avoid hydration mismatch from browser extensions
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              CleanField
            </h1>
            <p className="text-gray-600">Clean Air Incentive Management System with Primus zkTLS</p>
          </div>
        </div>

        {/* zkTLS Attestation Summary Card */}
        {zkTLSResults && (
          <div className={`mb-6 rounded-xl shadow-lg p-6 border-2 ${
            zkTLSResults.error 
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-purple-50 border-purple-200'
          }`}>
            {zkTLSResults.error ? (
              <div className="flex items-center">
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800">zkTLS Attestation Error</p>
                  <p className="text-sm text-yellow-700">{zkTLSResults.error}</p>
                </div>
              </div>
            ) : zkTLSResults.summary && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-purple-600 rounded-full p-2 mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">Primus zkTLS Attestations</h3>
                      <p className="text-xs text-purple-600">Mode: {zkTLSResults.config?.mode.toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="text-sm text-purple-600">
                    {new Date(zkTLSResults.summary.attestedAt).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-purple-700">{zkTLSResults.summary.totalFarms}</p>
                    <p className="text-sm text-purple-600">Total</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-blue-700">{zkTLSResults.summary.successfulAttestations}</p>
                    <p className="text-sm text-blue-600">Attested</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-green-700">{zkTLSResults.summary.cleanFarms}</p>
                    <p className="text-sm text-green-600">Clean</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-red-700">{zkTLSResults.summary.burningDetected}</p>
                    <p className="text-sm text-red-600">Burning</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-purple-200">
                    <p className="text-2xl font-bold text-yellow-700">{zkTLSResults.summary.failed}</p>
                    <p className="text-sm text-yellow-600">Failed</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* GISTDA Verification Summary Card */}
        {verificationResults && (
          <div className={`mb-6 rounded-xl shadow-lg p-6 ${
            verificationResults.error 
              ? 'bg-yellow-50 border-2 border-yellow-200'
              : 'bg-white'
          }`}>
            {verificationResults.error ? (
              <div className="flex items-center">
                <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-yellow-800">GISTDA Verification Issue</p>
                  <p className="text-sm text-yellow-700">{verificationResults.error}</p>
                </div>
              </div>
            ) : verificationResults.summary && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-800">GISTDA Direct Verification</h3>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(verificationResults.summary.verifiedAt).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-700">{verificationResults.summary.totalFarms}</p>
                    <p className="text-sm text-blue-600">Total Checked</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-700">{verificationResults.summary.cleanFarms}</p>
                    <p className="text-sm text-green-600">Clean Farms</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-700">{verificationResults.summary.burningFarms}</p>
                    <p className="text-sm text-red-600">Burning Detected</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-700">{verificationResults.summary.errorFarms}</p>
                    <p className="text-sm text-yellow-600">Errors</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading farms...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold">Farm ID</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold">Farm Name</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold">Owner</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold">Location</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold">System Status</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold">Eligibility</th>
                      <th className="px-4 py-4 text-right text-sm font-semibold">Reward</th>
                      <th className="px-4 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {farms.map((farm, index) => {
                      return (
                        <tr
                          key={farm.id}
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {farm.id}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{farm.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-700">{farm.owner}</td>
                          <td className="px-4 py-4 text-sm text-gray-700 font-mono">
                            {farm.location.lat.toFixed(2)}°, {farm.location.lng.toFixed(2)}°
                          </td>
                          <td className="px-4 py-4 text-center">
                            {farm.hasBurning ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                                </svg>
                                Burning
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                Clean
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                farm.eligibilityStatus === 'eligible'
                                  ? 'bg-blue-100 text-blue-800'
                                  : farm.eligibilityStatus === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : farm.eligibilityStatus === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {farm.eligibilityStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-semibold">
                            {farm.rewardAmount > 0 ? (
                              <span className="text-green-600">฿{farm.rewardAmount.toLocaleString()}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Link
                              href={`/farm/${farm.id}`}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Farms</p>
                    <p className="text-3xl font-bold text-gray-800">{farms.length}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Clean Farms</p>
                    <p className="text-3xl font-bold text-green-600">
                      {farms.filter(f => !f.hasBurning).length}
                    </p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Rewards</p>
                    <p className="text-3xl font-bold text-green-600">
                      ฿{farms.reduce((sum, f) => sum + f.rewardAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* zkTLS Info Card */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-start">
                <div className="bg-purple-600 rounded-full p-2 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-800 mb-1">Primus zkTLS Integration</h4>
                  <p className="text-sm text-purple-700">
                    This dashboard uses <strong>Primus zkTLS</strong> technology to generate cryptographic proofs of GISTDA hotspot data. 
                    zkTLS attestations can be submitted on-chain to the CleanFieldOracle smart contract for trustless verification, 
                    eliminating the need for centralized oracle trust.
                  </p>
                  <div className="mt-3 flex gap-4">
                    <div className="text-xs text-purple-600">
                      <span className="font-semibold">Mode:</span> Proxy TLS
                    </div>
                    <div className="text-xs text-purple-600">
                      <span className="font-semibold">Network:</span> Sepolia
                    </div>
                    <div className="text-xs text-purple-600">
                      <span className="font-semibold">Data Source:</span> GISTDA Portal
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
