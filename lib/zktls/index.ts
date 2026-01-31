/**
 * Primus zkTLS Integration for CleanField
 * 
 * This module provides zkTLS-based verification of GISTDA hotspot data
 * for the CleanField project.
 * 
 * Integration Type: SERVER-SIDE (Backend Integration)
 * - No browser extension required
 * - Server initiates verification programmatically
 * - Suitable for batch processing and automated verification
 * 
 * @see https://docs.primuslabs.xyz/enterprise/zk-tls-sdk/overview
 * @module zktls
 */

export * from './types';
export * from './primusClient';

// Re-export main functions for convenience
export {
  initializePrimus,
  createGISTDAAttestation,
  verifyAttestation,
  formatForOnChain,
  getPublicConfig,
  isPrimusConfigured,
  isMockMode,
} from './primusClient';

// Export mock server functions for testing
export {
  createServerAttestation,
  verifyServerAttestation,
  createBatchAttestations,
  getMockServerConfig,
  formatForSmartContract,
} from './mockPrimusServer';
