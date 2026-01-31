// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {Ownable} from "./utils/Ownable.sol";
import {IZkTLSVerifier} from "./interfaces/IZkTLSVerifier.sol";

/**
 * @title CleanFieldRewards
 * @dev Smart contract for managing annual clean air incentive payments to farmers on Base
 * @notice Uses zkTLS proofs verified on-chain to distribute USDC rewards
 * 
 * Reward Model:
 * - ฿5,000 THB per hectare per year (converted to USDC at fixed rate)
 * - Farmers can claim once per calendar year
 * - Must have valid zkTLS proof showing "No Burning Detected" from GISTDA
 */
contract CleanFieldRewards is Ownable {
    // ===========================================
    // State Variables
    // ===========================================
    
    /// @notice USDC token on Base
    IERC20 public immutable usdcToken;
    
    /// @notice zkTLS verifier contract (Primus)
    IZkTLSVerifier public zkTLSVerifier;
    
    /// @notice Claim state per farmId
    struct ClaimState {
        uint256 lastClaimTime;
        uint256 lastClaimYear;
        uint256 totalClaimed;
    }

    /// @notice Mapping from farm ID to claim state
    mapping(string => ClaimState) public claims;
    
    // ===========================================
    // Reward Configuration
    // ===========================================
    
    /// @notice Reward per hectare in USDC (6 decimals)
    /// @dev Default: ~$140 USDC (≈฿5,000 THB at 35 THB/USD)
    uint256 public rewardPerHectare = 140 * 10**6;
    
    /// @notice Claim period (1 year)
    uint256 public constant CLAIM_PERIOD = 365 days;
    
    /// @notice Current reward season/year
    uint256 public currentSeasonYear;
    
    /// @notice THB to USDC conversion rate (with 6 decimals)
    /// @dev Default: 35 THB = 1 USDC, so rate = 35_000000
    uint256 public thbToUsdcRate = 35_000000;
    
    /// @notice Whether on-chain verification is required
    bool public requireOnChainVerification = true;
    
    // ===========================================
    // Events
    // ===========================================
    
    event RewardClaimed(string indexed farmId, address indexed owner, uint256 amount, uint256 year);
    event VerifierUpdated(address indexed oldVerifier, address indexed newVerifier);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event ConversionRateUpdated(uint256 oldRate, uint256 newRate);
    event SeasonUpdated(uint256 oldYear, uint256 newYear);
    
    // ===========================================
    // Errors
    // ===========================================
    
    error AlreadyClaimedThisYear();
    error ClaimTooSoon();
    error BurningDetected();
    error ProofNotVerified();
    error InsufficientContractBalance();
    error TransferFailed();
    error VerificationFailed();
    error ZeroAddress();
    
    // ===========================================
    // Constructor
    // ===========================================
    
    /**
     * @dev Initialize the rewards contract
     * @param _usdcToken USDC token address on Base
     * @param _zkTLSVerifier zkTLS verifier contract address (can be zero if not used)
     */
    constructor(address _usdcToken, address _zkTLSVerifier) {
        if (_usdcToken == address(0)) revert ZeroAddress();
        
        usdcToken = IERC20(_usdcToken);
        
        if (_zkTLSVerifier != address(0)) {
            zkTLSVerifier = IZkTLSVerifier(_zkTLSVerifier);
        }
        currentSeasonYear = _getCurrentYear();
    }
    
    // ===========================================
    // Reward Claiming
    // ===========================================
    
    /**
     * @dev Claim annual reward for clean air incentive
     * @param _farmId Farm identifier
     * @param _areaHectares Farm area in hectares (2 decimal precision, e.g., 150 = 1.50 ha)
     * @param _proofHash Hash of the zkTLS proof
     * @param _signature Attestor signature
     * @param _noBurningDetected Whether burning was detected
     */
    function claimReward(
        string memory _farmId,
        uint256 _areaHectares,
        bytes32 _proofHash,
        bytes calldata _signature,
        bool _noBurningDetected
    ) external {
        ClaimState storage claimState = claims[_farmId];
        uint256 currentYear = _getCurrentYear();
        
        // Check if already claimed this year
        if (claimState.lastClaimYear >= currentYear) {
            revert AlreadyClaimedThisYear();
        }
        
        // Check if enough time has passed since last claim (extra safety)
        if (claimState.lastClaimTime > 0 && block.timestamp < claimState.lastClaimTime + CLAIM_PERIOD) {
            revert ClaimTooSoon();
        }
        
        if (!_noBurningDetected) revert BurningDetected();

        // Verify using zkTLS verifier if available
        if (address(zkTLSVerifier) != address(0)) {
            bool verified = zkTLSVerifier.verifyAttestation(
                _farmId,
                _noBurningDetected,
                block.timestamp,
                _proofHash,
                _signature
            );
            if (requireOnChainVerification && !verified) {
                revert VerificationFailed();
            }
        }

        // Calculate reward based on farm area
        uint256 rewardAmount = calculateReward(_areaHectares);
        
        // Check contract has enough balance
        uint256 balance = usdcToken.balanceOf(address(this));
        if (balance < rewardAmount) revert InsufficientContractBalance();

        // Update claim state
        claimState.lastClaimTime = block.timestamp;
        claimState.lastClaimYear = currentYear;
        claimState.totalClaimed += rewardAmount;

        // Transfer reward
        bool success = usdcToken.transfer(msg.sender, rewardAmount);
        if (!success) revert TransferFailed();

        emit RewardClaimed(_farmId, msg.sender, rewardAmount, currentYear);
    }
    
    /**
     * @dev Calculate reward for a given area
     * @param _areaHectares Area in hectares (2 decimal precision)
     * @return Reward amount in USDC (6 decimals)
     */
    function calculateReward(uint256 _areaHectares) public view returns (uint256) {
        // areaHectares has 2 decimals (e.g., 150 = 1.50 ha)
        // rewardPerHectare has 6 decimals (USDC)
        // Result: (area * reward) / 100 to normalize area decimals
        return (_areaHectares * rewardPerHectare) / 100;
    }
    
    /**
     * @dev Calculate reward in THB equivalent for display
     * @param _areaHectares Area in hectares (2 decimal precision)
     * @return Reward amount in THB (no decimals)
     */
    function calculateRewardTHB(uint256 _areaHectares) public view returns (uint256) {
        uint256 usdcAmount = calculateReward(_areaHectares);
        // Convert USDC to THB: usdcAmount * thbToUsdcRate / 10^6
        return (usdcAmount * thbToUsdcRate) / 10**12;
    }

    // ===========================================
    // Admin Functions
    // ===========================================
    
    /**
     * @dev Update zkTLS verifier contract
     * @param _newVerifier New verifier address
     */
    function updateVerifier(address _newVerifier) external onlyOwner {
        address oldVerifier = address(zkTLSVerifier);
        zkTLSVerifier = IZkTLSVerifier(_newVerifier);
        emit VerifierUpdated(oldVerifier, _newVerifier);
    }
    
    /**
     * @dev Update reward per hectare (for FX rate adjustment)
     * @param _newRate New reward rate in USDC (6 decimals)
     */
    function updateRewardRate(uint256 _newRate) external onlyOwner {
        uint256 oldRate = rewardPerHectare;
        rewardPerHectare = _newRate;
        emit RewardRateUpdated(oldRate, _newRate);
    }
    
    /**
     * @dev Update THB to USDC conversion rate
     * @param _newRate New rate (e.g., 35_000000 for 35 THB = 1 USDC)
     */
    function updateConversionRate(uint256 _newRate) external onlyOwner {
        uint256 oldRate = thbToUsdcRate;
        thbToUsdcRate = _newRate;
        emit ConversionRateUpdated(oldRate, _newRate);
    }
    
    /**
     * @dev Update current season year
     * @param _year New season year
     */
    function updateSeasonYear(uint256 _year) external onlyOwner {
        uint256 oldYear = currentSeasonYear;
        currentSeasonYear = _year;
        emit SeasonUpdated(oldYear, _year);
    }
    
    /**
     * @dev Toggle on-chain verification requirement
     * @param _required Whether verification is required
     */
    function setVerificationRequired(bool _required) external onlyOwner {
        requireOnChainVerification = _required;
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdcToken.balanceOf(address(this));
        bool success = usdcToken.transfer(owner(), balance);
        if (!success) revert TransferFailed();
    }
    
    /**
     * @dev Reset farm claim year for testing (only owner)
     * @param _farmId Farm identifier
     */
    function resetClaimYear(string memory _farmId) external onlyOwner {
        ClaimState storage claimState = claims[_farmId];
        claimState.lastClaimYear = 0;
        claimState.lastClaimTime = 0;
    }

    /**
     * @dev Check if farm can claim reward
     * @param _farmId Farm identifier
     */
    function canClaimReward(string memory _farmId) external view returns (bool canClaim, string memory reason) {
        ClaimState storage claimState = claims[_farmId];
        uint256 currentYear = _getCurrentYear();
        if (claimState.lastClaimYear >= currentYear) return (false, "Already claimed this year");
        
        if (claimState.lastClaimTime > 0 && block.timestamp < claimState.lastClaimTime + CLAIM_PERIOD) {
            return (false, "Claim period not elapsed");
        }

        return (true, "Eligible for claim");
    }

    /**
     * @dev Get claim state for a farm
     * @param _farmId Farm identifier
     */
    function getClaimState(string memory _farmId) external view returns (ClaimState memory) {
        return claims[_farmId];
    }
    
    /**
     * @dev Get estimated reward for an area
     * @param _areaHectares Area in hectares (2 decimal precision)
     */
    function getEstimatedReward(uint256 _areaHectares) external view returns (uint256 usdc, uint256 thb) {
        usdc = calculateReward(_areaHectares);
        thb = calculateRewardTHB(_areaHectares);
    }
    
    // ===========================================
    // Internal Functions
    // ===========================================
    
    /**
     * @dev Get current calendar year
     */
    function _getCurrentYear() internal view returns (uint256) {
        // Approximate year calculation (not perfect but sufficient for our use case)
        // More accurate would use a library, but this works for claim gating
        return 1970 + (block.timestamp / 365 days);
    }
}
