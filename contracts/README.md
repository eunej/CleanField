# CleanField Smart Contracts

Smart contracts for the CleanField clean air incentive system on Base.

## Overview

The CleanFieldRewards contract manages annual USDC payments to farmers who maintain clean air practices (no burning) verified via zkTLS proofs from GISTDA.

### Reward Model

- **Reward Rate**: ~$140 USDC per hectare per year (≈฿5,000 THB)
- **Claim Period**: Once per calendar year
- **Verification**: zkTLS proof showing "No Burning Detected" from GISTDA
- **Token**: USDC on Base

## Contracts

### CleanFieldRewards.sol

Main rewards contract that handles:
- Farm registration with area (hectares)
- zkTLS proof submission and verification
- Annual reward claiming
- Admin controls (reward rate, verifier, oracle)

### IZkTLSVerifier.sol

Interface for zkTLS proof verification (Primus compatible):
- `verifyProof()` - Verify proof hash and signature
- `verifyAttestation()` - Verify full attestation data
- `isValidAttestor()` - Check attestor authorization

### SmogFreeOracle.sol (Legacy)

Original monthly reward contract, kept for reference.

## Development

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Build

```shell
forge build
```

### Test

```shell
# Run all tests
forge test

# Run new CleanFieldRewards tests
forge test --match-path test/CleanFieldRewards.t.sol -vv

# Run legacy tests
forge test --match-path test/SmogFreeOracle.t.sol -vv
```

### Deploy

#### Base Sepolia (Testnet)

```shell
# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_SEPOLIA_RPC=https://sepolia.base.org

# Deploy
forge script script/DeployBase.s.sol --rpc-url $BASE_SEPOLIA_RPC --broadcast
```

#### Base Mainnet

```shell
# Set environment variables
export PRIVATE_KEY=your_private_key
export BASE_RPC=https://mainnet.base.org

# Deploy
forge script script/DeployBase.s.sol --rpc-url $BASE_RPC --broadcast
```

### Contract Addresses

| Network | Contract | Address |
|---------|----------|---------|
| Base Sepolia | CleanFieldRewards | TBD |
| Base Sepolia | USDC | 0x036CbD53842c5426634e7929541eC2318f3dCF7e |
| Base Mainnet | CleanFieldRewards | TBD |
| Base Mainnet | USDC | 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 |

## Contract Functions

### Farm Owner Functions

```solidity
// Register a farm (one-time)
function registerFarm(string memory _farmId, string memory _gistdaId, uint256 _areaHectares) external

// Update farm area
function updateFarmArea(string memory _farmId, uint256 _newAreaHectares) external

// Claim annual reward (requires valid zkTLS proof)
function claimReward(string memory _farmId) external
```

### Proof Submission

```solidity
// Submit proof with on-chain verification
function submitProofWithVerification(
    string memory _farmId,
    bytes32 _proofHash,
    bytes calldata _signature,
    bool _noBurningDetected
) external

// Submit proof via oracle (legacy)
function submitProof(string memory _farmId, bytes32 _proofHash, bool _noBurningDetected) external
```

### View Functions

```solidity
function getFarmDetails(string memory _farmId) external view returns (Farm memory)
function canClaimReward(string memory _farmId) external view returns (bool canClaim, string memory reason)
function getEstimatedReward(string memory _farmId) external view returns (uint256 usdc, uint256 thb)
function calculateReward(uint256 _areaHectares) public view returns (uint256)
```

### Admin Functions

```solidity
function updateVerifier(address _newVerifier) external onlyOwner
function updateOracle(address _newOracle) external onlyOwner
function updateRewardRate(uint256 _newRate) external onlyOwner
function setVerificationRequired(bool _required) external onlyOwner
function emergencyWithdraw() external onlyOwner
```

## License

MIT
