# zkTLS Integration Recommendations for CleanField

## Executive Summary

This document outlines recommended integration points for zkTLS technology in the CleanField project. zkTLS enables verification of real-world data from TLS-secured websites without requiring server modifications, making it ideal for authenticating government portal data.

## What is zkTLS?

zkTLS (zero-knowledge Transport Layer Security) verifies the authenticity of TLS data while preserving privacy, without requiring modifications to data source servers. It enables secure utilization of data from Web2 platforms (like the Thai Government's GISTDA portal) and facilitates trustless cross-platform data flow.

### Two Operating Modes:

1. **MPC Mode (Multi-Party Computation)**: Higher security, joint computation between client and attestor
2. **Proxy Mode**: Higher performance, attestor acts as intermediary

## Recommended Integration Points

### 1. **GISTDA Portal Data Verification (PRIMARY USE CASE)**

**Integration Point**: Farm burning status verification from Thai Government GISTDA portal

**How it works**:
- Farmers access the GISTDA portal showing their land status
- zkTLS creates a cryptographic proof that "No Burning Detected" status exists on the official portal
- This proof is submitted to the smart contract
- Smart contract verifies the proof before releasing rewards

**Implementation**:
```solidity
// In CleanFieldOracle.sol - already implemented
function submitProof(
    string memory _farmId,
    bytes32 _proofHash,  // zkTLS proof hash
    bool _noBurningDetected
) external
```

**Benefits**:
- No need for GISTDA to modify their system
- Cryptographically verifiable proof of government records
- Privacy-preserving (only reveals "no burning" status, not other farm data)
- Eliminates trust requirements for oracle operators

**User Flow**:
1. Farm owner logs into GISTDA portal
2. Browser extension or DApp generates zkTLS proof of "No Burning" status
3. Proof submitted to smart contract via oracle
4. If valid, farm becomes eligible for reward claim

---

### 2. **Historical Compliance Verification**

**Integration Point**: Verify 30-day clean air history

**How it works**:
- Generate zkTLS proofs for multiple historical dates from GISTDA
- Submit batch proofs showing continuous compliance
- Smart contract validates the proof chain before approving rewards

**Benefits**:
- Proves continuous compliance over time
- Prevents fraud from temporary status manipulation
- Creates immutable audit trail

---

### 3. **Farm Registration Verification**

**Integration Point**: Verify farm ownership and registration with government

**How it works**:
- During registration, farmer provides zkTLS proof of farm ownership from GISTDA database
- Proof confirms farm ID, location, and ownership
- Smart contract stores verified farm metadata

**Benefits**:
- Prevents fake farm registrations
- Validates legitimate farm owners
- Links blockchain identity to government records

---

### 4. **Satellite Data Authentication (Advanced)**

**Integration Point**: Verify satellite imagery analysis from GISTDA's FIRMS system

**How it works**:
- GISTDA provides satellite fire detection data via FIRMS (Fire Information for Resource Management System)
- zkTLS creates proof of satellite data showing no hot spots/fires
- More granular than portal status checks

**Benefits**:
- Direct satellite data verification
- Higher precision fire detection
- Independent verification source

---

### 5. **Air Quality Index Verification**

**Integration Point**: Verify local air quality measurements

**How it works**:
- Fetch AQI data from Thai Pollution Control Department website
- Generate zkTLS proof showing air quality levels in farm region
- Use as secondary validation alongside burning status

**Benefits**:
- Additional data point for clean air verification
- Regional pollution impact assessment
- Supports broader environmental goals

---

## Recommended Implementation Priority

### Phase 1: MVP (Recommended for Hackathon)
**Primary Integration: GISTDA Portal Status Verification**

Focus on implementing zkTLS proof generation for the GISTDA "No Burning Detected" status. This is the core use case and demonstrates the project's main value proposition.

**Technical Steps**:
1. Set up Primus zkTLS SDK in frontend
2. Create browser workflow for GISTDA portal access
3. Generate proof of "No Burning" status
4. Submit proof hash to oracle contract
5. Oracle validates and stores proof on-chain

### Phase 2: Enhanced Verification
- Add historical compliance verification (30-day proof chain)
- Implement farm registration verification

### Phase 3: Advanced Features
- Satellite data authentication
- Air quality index verification
- Multi-source proof aggregation

---

## Technical Architecture

```
┌─────────────────┐
│  Farm Owner     │
│  (Browser)      │
└────────┬────────┘
         │
         │ 1. Access GISTDA Portal
         │
         ▼
┌─────────────────┐
│  GISTDA Portal  │
│  (TLS Secured)  │
└────────┬────────┘
         │
         │ 2. Generate zkTLS Proof
         │
         ▼
┌─────────────────┐
│  Primus zkTLS   │
│  (MPC/Proxy)    │
└────────┬────────┘
         │
         │ 3. Proof Hash
         │
         ▼
┌─────────────────┐
│  Oracle Service │
│  (Backend)      │
└────────┬────────┘
         │
         │ 4. submitProof()
         │
         ▼
┌─────────────────┐
│ Smart Contract  │
│ (Sepolia)       │
└─────────────────┘
```

---

## Integration Code Examples

### Frontend: Generate zkTLS Proof

```typescript
// lib/zktls/primus.ts
import { PrimusClient } from '@primuslabs/zktls-sdk';

export async function generateGISTDAProof(farmId: string) {
  const client = new PrimusClient({
    mode: 'mpc', // Use MPC mode for security
    network: 'sepolia'
  });

  // User navigates to GISTDA portal
  const gistdaUrl = `https://gistda.or.th/farm-status/${farmId}`;

  // Generate proof of "No Burning Detected" status
  const proof = await client.prove({
    url: gistdaUrl,
    selector: '.burning-status', // CSS selector for status element
    expectedValue: 'No Burning Detected',
    timestamp: Date.now()
  });

  return {
    proofHash: proof.hash,
    proofData: proof.data,
    noBurning: true
  };
}
```

### Backend: Submit Proof to Contract

```typescript
// app/api/submit-proof/route.ts
import { ethers } from 'ethers';
import { SMOG_FREE_ORACLE_ABI } from '@/lib/contracts/abi';

export async function POST(request: Request) {
  const { farmId, proofHash, noBurning } = await request.json();

  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS!,
    SMOG_FREE_ORACLE_ABI,
    wallet
  );

  // Submit proof to contract
  const tx = await contract.submitProof(farmId, proofHash, noBurning);
  await tx.wait();

  return Response.json({ success: true, txHash: tx.hash });
}
```

### Smart Contract: Verify and Store Proof

```solidity
// Already implemented in CleanFieldOracle.sol
function submitProof(
    string memory _farmId,
    bytes32 _proofHash,
    bool _noBurningDetected
) external {
    if (msg.sender != oracle) revert UnauthorizedOracle();
    if (!farms[_farmId].isRegistered) revert FarmNotRegistered();

    proofs[_farmId].push(Proof({
        proofHash: _proofHash,
        timestamp: block.timestamp,
        noBurningDetected: _noBurningDetected
    }));

    emit ProofSubmitted(_farmId, _proofHash, _noBurningDetected);
}
```

---

## Benefits Summary

### For Farmers:
- Transparent reward eligibility
- Automated verification process
- Privacy-preserving data sharing
- Direct USDT rewards for clean farming

### For Project:
- Trustless verification without centralized oracle
- Integration with existing government systems
- Cryptographic proof of compliance
- Scalable to other regions/countries

### For Hackathon:
- Innovative use of zkTLS technology
- Solves real-world problem (air pollution from crop burning)
- Demonstrates practical Web3 + Web2 integration
- Addresses Thai government's actual GISTDA system

---

## Implementation Checklist

- [ ] Set up Primus zkTLS SDK
- [ ] Create GISTDA portal integration workflow
- [ ] Implement proof generation in frontend
- [ ] Build oracle service for proof submission
- [ ] Test proof verification on Sepolia testnet
- [ ] Add proof validation UI for farmers
- [ ] Document verification flow for judges
- [ ] Create demo video showing end-to-end proof generation

---

## Resources

- **Primus Labs Documentation**: https://docs.primuslabs.xyz/
- **GISTDA Portal**: https://gistda.or.th/ (Thai Government GIS)
- **FIRMS Fire Data**: https://firms.modaps.eosdis.nasa.gov/
- **Smart Contract**: `contracts/src/SmogFreeOracle.sol` (contract name: CleanFieldOracle)

---

## Conclusion

zkTLS provides the perfect solution for the CleanField project by enabling trustless verification of government portal data. The recommended implementation focuses on verifying GISTDA "No Burning" status as the primary use case, with opportunities to expand to historical compliance, farm registration, and satellite data verification in future phases.

This approach eliminates the need for:
- Centralized oracle infrastructure
- Trust in third-party data providers
- Modifications to government systems
- Complex IoT sensor deployments

Instead, it leverages existing government infrastructure with cryptographic proofs, making it practical, scalable, and hackathon-ready.
