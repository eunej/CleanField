'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Farm, InsurancePayment } from '@/lib/types/farm';

export default function FarmOwnerPage() {
  const params = useParams();
  const farmId = params.id as string;

  const [farm, setFarm] = useState<Farm | null>(null);
  const [payments, setPayments] = useState<InsurancePayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmData();
  }, [farmId]);

  const fetchFarmData = async () => {
    try {
      const response = await fetch(`/api/farms/${farmId}`);
      const data = await response.json();
      setFarm(data.farm);
      setPayments(data.payments);
    } catch (error) {
      console.error('Error fetching farm data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Farm Not Found</h1>
          <p className="text-gray-600">Unable to load farm information</p>
        </div>
      </div>
    );
  }

  const completedPayments = payments.filter(p => p.status === 'completed');
  const totalEarned = completedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4 pb-8">
      <div className="max-w-md mx-auto pt-6">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-full p-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{farm.name}</h1>
                <p className="text-sm text-gray-500">{farm.owner}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              farm.hasBurning ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {farm.hasBurning ? '⚠️ Alert' : '✓ Clean'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Farm Area</p>
              <p className="text-2xl font-bold text-gray-800">{farm.area} ha</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Incidents</p>
              <p className={`text-2xl font-bold ${farm.burningIncidents > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {farm.burningIncidents}
              </p>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className={`rounded-3xl shadow-2xl p-6 mb-6 ${
          farm.hasBurning
            ? 'bg-gradient-to-br from-red-500 to-orange-500'
            : 'bg-gradient-to-br from-green-500 to-teal-500'
        }`}>
          <div className="text-center text-white">
            {farm.hasBurning ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-xl font-bold mb-2">Burning Detected</h2>
                <p className="text-sm opacity-90">Your farm has {farm.burningIncidents} incident(s) this period</p>
                <p className="text-xs opacity-75 mt-2">Not eligible for rewards this month</p>
              </>
            ) : (
              <>
                <svg className="w-16 h-16 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <h2 className="text-xl font-bold mb-2">Clean Air Status</h2>
                <p className="text-sm opacity-90">No burning detected this period</p>
                <p className="text-xs opacity-75 mt-2">Eligible for clean air incentive</p>
              </>
            )}
          </div>
        </div>

        {/* Rewards Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Your Rewards</h3>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Earned</p>
            <p className="text-4xl font-bold">${totalEarned} USDT</p>
            <p className="text-xs opacity-75 mt-2">{completedPayments.length} payment(s) received</p>
          </div>

          {pendingPayments.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 mb-4 border-2 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">Pending Reward</p>
                  <p className="text-2xl font-bold text-blue-900">${pendingPayments[0].amount} USDT</p>
                </div>
                <div className="bg-blue-200 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-700 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {farm.insuranceStatus === 'active' && !farm.hasBurning && (
            <div className="bg-green-50 rounded-2xl p-4 border-2 border-green-200">
              <p className="text-sm font-semibold text-green-800 mb-1">Next Reward Available</p>
              <p className="text-2xl font-bold text-green-900">${farm.rewardAmount} USDT</p>
              <p className="text-xs text-green-700 mt-2">Keep your farm clean to claim!</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        {completedPayments.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
            <div className="space-y-3">
              {completedPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">${payment.amount} USDT</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {payment.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${payment.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Info */}
        <div className="mt-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4">
          <p className="text-xs text-white opacity-75 mb-1">Your Wallet</p>
          <p className="text-sm font-mono text-white break-all">{farm.walletAddress}</p>
        </div>
      </div>
    </div>
  );
}
