# CleanField

A blockchain-based clean air incentive system for farmers using zkTLS technology to verify "No Burning" status from government portals.

## Project Overview

CleanField addresses the carbon credit and air quality challenge in agricultural regions. Farmers who avoid crop burning receive stablecoin rewards (USDT) based on cryptographically verified data from the Thai Government's GISTDA portal.

### Key Features

- **zkTLS Integration**: Trustless verification of government portal data
- **Smart Contract Insurance**: Automated USDT rewards for clean farming
- **Admin Dashboard**: Monitor all registered farms and burning incidents
- **Mobile-First Farmer Interface**: Easy access to rewards and payment history
- **Sepolia Testnet Deployment**: Production-ready smart contracts

## Tech Stack

### Frontend
- **Next.js 15**: Full-stack React framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Mobile-Responsive**: Optimized for farm owner mobile access

### Smart Contracts
- **Solidity ^0.8.19**: Smart contract language
- **Foundry**: Development framework
- **Sepolia Testnet**: EVM testnet deployment
- **USDT Integration**: Stablecoin reward payments

### zkTLS
- **Primus Network**: zkTLS proof generation
- **GISTDA Portal**: Thai government land use data
- **Cryptographic Proofs**: Trustless data verification

## Project Structure

```
cleanfield/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Admin dashboard
│   ├── farm/[id]/page.tsx       # Farm owner mobile view
│   └── api/                     # API routes
│       ├── farms/route.ts       # Get all farms
│       └── farms/[id]/route.ts  # Get farm details
├── contracts/                    # Foundry smart contracts
│   ├── src/
│   │   ├── CleanFieldOracle.sol  # Main insurance contract
│   │   └── utils/Ownable.sol    # Access control
│   ├── test/                    # Contract tests
│   ├── script/Deploy.s.sol      # Deployment script
│   └── foundry.toml             # Foundry config
├── lib/
│   ├── types/farm.ts            # TypeScript types
│   └── data/mockData.ts         # Mock farm data
├── docs/
│   └── zkTLS_INTEGRATION.md     # zkTLS integration guide
└── README.md                     # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Foundry (for smart contracts)
- MetaMask or Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cleanfield
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
PRIVATE_KEY=<your-private-key>
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<your-api-key>
```

4. **Install Foundry (if not already installed)**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

5. **Build smart contracts**
```bash
cd contracts
forge build
```

6. **Run contract tests**
```bash
forge test
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the admin dashboard.

### Farm Owner Mobile Views

Access individual farm views at:
- http://localhost:3000/farm/farm1
- http://localhost:3000/farm/farm2
- http://localhost:3000/farm/farm3
- http://localhost:3000/farm/farm4
- http://localhost:3000/farm/farm5

## Smart Contract Deployment

### Deploy to Sepolia

1. **Fund your wallet with Sepolia ETH**
   - Get testnet ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Deploy the contract**
```bash
cd contracts
forge script script/Deploy.s.sol:DeployCleanFieldOracle --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

3. **Update `.env.local` with contract address**

### Contract Functions

#### Register a Farm
```solidity
function registerFarm(string memory _farmId, string memory _gistdaId) external
```

#### Submit zkTLS Proof (Oracle Only)
```solidity
function submitProof(
    string memory _farmId,
    bytes32 _proofHash,
    bool _noBurningDetected
) external
```

#### Claim Monthly Reward
```solidity
function claimReward(string memory _farmId) external
```

## zkTLS Integration

See [docs/zkTLS_INTEGRATION.md](docs/zkTLS_INTEGRATION.md) for detailed zkTLS integration recommendations.

### Quick Summary

zkTLS enables trustless verification of the "No Burning Detected" status from the Thai Government's GISTDA portal without requiring server modifications.

**Integration Points**:
1. **Primary**: GISTDA portal status verification
2. **Secondary**: Historical compliance verification
3. **Advanced**: Farm registration and satellite data

## Business Logic

### Reward Flow

1. **Farm Registration**
   - Farm owner registers with farm ID and GISTDA ID
   - Smart contract stores farm metadata

2. **Monthly Verification**
   - Oracle generates zkTLS proof from GISTDA portal
   - Proof shows "No Burning Detected" status
   - Proof submitted to smart contract

3. **Reward Distribution**
   - If no burning detected for 30 days
   - Farm owner claims reward (500 USDT)
   - Smart contract transfers USDT to owner wallet

4. **Ineligibility**
   - If burning detected (proof shows burning)
   - Farm becomes ineligible for that period
   - Must wait for clean period to claim again

## API Endpoints

### GET `/api/farms`
Returns all registered farms with status information.

### GET `/api/farms/[id]`
Returns specific farm details and payment history.

## Mock Data

The project includes mock data for 5 farms:
- **farm1**: Green Valley Farm (Clean, $500 reward)
- **farm2**: Sunrise Orchards (Burning detected, ineligible)
- **farm3**: Golden Harvest Fields (Clean, $800 paid)
- **farm4**: River Bend Agriculture (Clean, $650 pending)
- **farm5**: Mountain View Plantation (Burning detected)

## Testing

### Run Smart Contract Tests
```bash
cd contracts
forge test -vvv
```

Tests cover:
- Farm registration
- Proof submission
- Reward claiming
- Access control
- Edge cases

### Manual Testing Flow

1. Start development server
2. View admin dashboard at `/`
3. Check farm status table
4. Navigate to farm owner views (`/farm/farm1`, etc.)
5. Verify payment history display
6. Test "Mock Time Change" button

## Deployment Checklist

- [ ] Deploy CleanFieldOracle contract to Sepolia
- [ ] Deploy or use existing USDT contract
- [ ] Fund contract with USDT for rewards
- [ ] Set oracle address in contract
- [ ] Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
- [ ] Deploy Next.js app to Vercel/hosting
- [ ] Test end-to-end flow on testnet
- [ ] Integrate zkTLS SDK (Phase 2)

## Future Enhancements

### Phase 1 (Current)
- ✅ Smart contract infrastructure
- ✅ Admin dashboard
- ✅ Farm owner mobile interface
- ✅ Mock data and API endpoints

### Phase 2
- [ ] Integrate Primus zkTLS SDK
- [ ] GISTDA portal proof generation
- [ ] Oracle service implementation
- [ ] Real-time proof verification

### Phase 3
- [ ] Historical compliance verification
- [ ] Satellite data integration
- [ ] Air quality index verification
- [ ] Multi-region support

## Contributing

This is a hackathon project. Contributions and suggestions are welcome!

## License

MIT License

## Resources

- **Primus Labs**: https://docs.primuslabs.xyz/
- **GISTDA**: https://gistda.or.th/
- **Foundry**: https://book.getfoundry.sh/
- **Next.js**: https://nextjs.org/
- **Sepolia Faucet**: https://sepoliafaucet.com/

## Contact

For questions or demo requests, please reach out during the hackathon.

---

**Built for Hackathon 2026** 🌱
