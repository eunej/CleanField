// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {Ownable} from "./utils/Ownable.sol";

/**
 * @title CleanFieldOracle
 * @dev Smart contract for managing clean air incentive payments to farmers
 * @notice This contract uses zkTLS proofs to verify "No Burning" status from GISTDA portal
 */
contract CleanFieldOracle is Ownable {
    // USDT token interface
    IERC20 public immutable usdtToken;

    // Struct to store farm information
    struct Farm {
        address owner;
        string farmId;
        string gistdaId;
        uint256 lastClaimTime;
        uint256 totalClaimed;
        bool isRegistered;
        bool isActive;
    }

    // Struct for zkTLS proof verification
    struct Proof {
        bytes32 proofHash;
        uint256 timestamp;
        bool noBurningDetected;
    }

    // Mapping from farm ID to farm data
    mapping(string => Farm) public farms;

    // Mapping from farm ID to proofs
    mapping(string => Proof[]) public proofs;

    // Mapping from address to farm IDs
    mapping(address => string[]) public ownerFarms;

    // Reward configuration
    uint256 public monthlyReward = 500 * 10**6; // 500 USDT (6 decimals)
    uint256 public constant CLAIM_PERIOD = 30 days;

    // Oracle address that can submit proofs
    address public oracle;

    // Events
    event FarmRegistered(string indexed farmId, address indexed owner, string gistdaId);
    event FarmDeactivated(string indexed farmId);
    event ProofSubmitted(string indexed farmId, bytes32 proofHash, bool noBurningDetected);
    event RewardClaimed(string indexed farmId, address indexed owner, uint256 amount);
    event OracleUpdated(address indexed oldOracle, address indexed newOracle);
    event RewardAmountUpdated(uint256 oldAmount, uint256 newAmount);

    // Errors
    error FarmNotRegistered();
    error FarmAlreadyRegistered();
    error FarmNotActive();
    error UnauthorizedOracle();
    error ClaimTooSoon();
    error BurningDetected();
    error NoProofAvailable();
    error InsufficientContractBalance();
    error TransferFailed();

    constructor(address _usdtToken, address _oracle) {
        usdtToken = IERC20(_usdtToken);
        oracle = _oracle;
    }

    /**
     * @dev Register a new farm
     * @param _farmId Unique farm identifier
     * @param _gistdaId GISTDA portal ID for the farm
     */
    function registerFarm(string memory _farmId, string memory _gistdaId) external {
        if (farms[_farmId].isRegistered) revert FarmAlreadyRegistered();

        farms[_farmId] = Farm({
            owner: msg.sender,
            farmId: _farmId,
            gistdaId: _gistdaId,
            lastClaimTime: 0,
            totalClaimed: 0,
            isRegistered: true,
            isActive: true
        });

        ownerFarms[msg.sender].push(_farmId);

        emit FarmRegistered(_farmId, msg.sender, _gistdaId);
    }

    /**
     * @dev Submit zkTLS proof for a farm (only oracle)
     * @param _farmId Farm identifier
     * @param _proofHash Hash of the zkTLS proof
     * @param _noBurningDetected Whether burning was detected
     */
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

    /**
     * @dev Claim monthly reward for clean air incentive
     * @param _farmId Farm identifier
     */
    function claimReward(string memory _farmId) external {
        Farm storage farm = farms[_farmId];

        if (!farm.isRegistered) revert FarmNotRegistered();
        if (!farm.isActive) revert FarmNotActive();
        if (msg.sender != farm.owner) revert UnauthorizedOracle();

        // Check if enough time has passed since last claim
        if (block.timestamp < farm.lastClaimTime + CLAIM_PERIOD) {
            revert ClaimTooSoon();
        }

        // Check if there's a recent proof
        Proof[] storage farmProofs = proofs[_farmId];
        if (farmProofs.length == 0) revert NoProofAvailable();

        // Get the most recent proof within the claim period
        Proof storage recentProof = farmProofs[farmProofs.length - 1];

        // Verify no burning was detected
        if (!recentProof.noBurningDetected) revert BurningDetected();

        // Check contract has enough balance
        uint256 balance = usdtToken.balanceOf(address(this));
        if (balance < monthlyReward) revert InsufficientContractBalance();

        // Update farm data
        farm.lastClaimTime = block.timestamp;
        farm.totalClaimed += monthlyReward;

        // Transfer reward
        bool success = usdtToken.transfer(farm.owner, monthlyReward);
        if (!success) revert TransferFailed();

        emit RewardClaimed(_farmId, farm.owner, monthlyReward);
    }

    /**
     * @dev Deactivate a farm (only owner)
     * @param _farmId Farm identifier
     */
    function deactivateFarm(string memory _farmId) external {
        Farm storage farm = farms[_farmId];
        if (!farm.isRegistered) revert FarmNotRegistered();
        if (msg.sender != farm.owner && msg.sender != owner()) revert UnauthorizedOracle();

        farm.isActive = false;
        emit FarmDeactivated(_farmId);
    }

    /**
     * @dev Update oracle address (only owner)
     * @param _newOracle New oracle address
     */
    function updateOracle(address _newOracle) external onlyOwner {
        address oldOracle = oracle;
        oracle = _newOracle;
        emit OracleUpdated(oldOracle, _newOracle);
    }

    /**
     * @dev Update monthly reward amount (only owner)
     * @param _newAmount New reward amount
     */
    function updateRewardAmount(uint256 _newAmount) external onlyOwner {
        uint256 oldAmount = monthlyReward;
        monthlyReward = _newAmount;
        emit RewardAmountUpdated(oldAmount, _newAmount);
    }

    /**
     * @dev Get farm details
     * @param _farmId Farm identifier
     */
    function getFarmDetails(string memory _farmId) external view returns (Farm memory) {
        return farms[_farmId];
    }

    /**
     * @dev Get all farms owned by an address
     * @param _owner Owner address
     */
    function getOwnerFarms(address _owner) external view returns (string[] memory) {
        return ownerFarms[_owner];
    }

    /**
     * @dev Get proof count for a farm
     * @param _farmId Farm identifier
     */
    function getProofCount(string memory _farmId) external view returns (uint256) {
        return proofs[_farmId].length;
    }

    /**
     * @dev Get specific proof for a farm
     * @param _farmId Farm identifier
     * @param _index Proof index
     */
    function getProof(string memory _farmId, uint256 _index) external view returns (Proof memory) {
        return proofs[_farmId][_index];
    }

    /**
     * @dev Check if farm can claim reward
     * @param _farmId Farm identifier
     */
    function canClaimReward(string memory _farmId) external view returns (bool) {
        Farm storage farm = farms[_farmId];

        if (!farm.isRegistered || !farm.isActive) return false;
        if (block.timestamp < farm.lastClaimTime + CLAIM_PERIOD) return false;

        Proof[] storage farmProofs = proofs[_farmId];
        if (farmProofs.length == 0) return false;

        return farmProofs[farmProofs.length - 1].noBurningDetected;
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        bool success = usdtToken.transfer(owner(), balance);
        if (!success) revert TransferFailed();
    }
}
