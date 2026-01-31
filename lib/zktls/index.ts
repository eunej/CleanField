/**
 * Primus zkTLS Integration for VeriFarm
 * 
 * This module provides zkTLS-based verification of GISTDA hotspot data
 * for the CleanField project.
 * 
 * @module zktls
 */

export * from './types';
export * from './primusClient';

// Re-export main functions for convenience
export {
  createGISTDAAttestation,
  verifyAttestation,
  queryGISTDAHotspots,
  formatForOnChain,
  getPublicConfig,
} from './primusClient';
