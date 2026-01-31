// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {CleanFieldOracle} from "../src/SmogFreeOracle.sol";
import {IERC20} from "forge-std/interfaces/IERC20.sol";

contract MockERC20 is IERC20 {
    string public name = "Mock USDT";
    string public symbol = "USDT";
    uint8 public decimals = 6;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }
}

contract CleanFieldOracleTest is Test {
    CleanFieldOracle public oracle;
    MockERC20 public usdt;

    address public owner = address(1);
    address public oracleAddress = address(2);
    address public farmer1 = address(3);
    address public farmer2 = address(4);

    uint256 constant MONTHLY_REWARD = 500 * 10**6; // 500 USDT

    function setUp() public {
        vm.startPrank(owner);

        // Deploy mock USDT
        usdt = new MockERC20();

        // Deploy oracle contract
        oracle = new SmogFreeOracle(address(usdt), oracleAddress);

        // Mint USDT to contract for rewards
        usdt.mint(address(oracle), 10000 * 10**6);

        vm.stopPrank();
    }

    function testRegisterFarm() public {
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        CleanFieldOracle.Farm memory farm = oracle.getFarmDetails("farm1");
        assertEq(farm.owner, farmer1);
        assertEq(farm.farmId, "farm1");
        assertEq(farm.gistdaId, "GISTDA001");
        assertTrue(farm.isRegistered);
        assertTrue(farm.isActive);
    }

    function testSubmitProof() public {
        // Register farm
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        // Submit proof
        vm.prank(oracleAddress);
        oracle.submitProof("farm1", keccak256("proof1"), true);

        assertEq(oracle.getProofCount("farm1"), 1);
    }

    function testClaimReward() public {
        // Register farm
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        // Submit proof
        vm.prank(oracleAddress);
        oracle.submitProof("farm1", keccak256("proof1"), true);

        // Wait for claim period
        vm.warp(block.timestamp + 30 days);

        // Claim reward
        uint256 balanceBefore = usdt.balanceOf(farmer1);
        vm.prank(farmer1);
        oracle.claimReward("farm1");

        uint256 balanceAfter = usdt.balanceOf(farmer1);
        assertEq(balanceAfter - balanceBefore, MONTHLY_REWARD);
    }

    function testCannotClaimWithBurning() public {
        // Register farm
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        // Submit proof with burning detected
        vm.prank(oracleAddress);
        oracle.submitProof("farm1", keccak256("proof1"), false);

        // Wait for claim period
        vm.warp(block.timestamp + 30 days);

        // Try to claim reward - should fail
        vm.prank(farmer1);
        vm.expectRevert(CleanFieldOracle.BurningDetected.selector);
        oracle.claimReward("farm1");
    }

    function testCannotClaimTooSoon() public {
        // Register farm
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        // Submit proof
        vm.prank(oracleAddress);
        oracle.submitProof("farm1", keccak256("proof1"), true);

        // Try to claim immediately - should fail
        vm.prank(farmer1);
        vm.expectRevert(CleanFieldOracle.ClaimTooSoon.selector);
        oracle.claimReward("farm1");
    }

    function testOnlyOracleCanSubmitProof() public {
        // Register farm
        vm.prank(farmer1);
        oracle.registerFarm("farm1", "GISTDA001");

        // Try to submit proof as non-oracle
        vm.prank(farmer1);
        vm.expectRevert(CleanFieldOracle.UnauthorizedOracle.selector);
        oracle.submitProof("farm1", keccak256("proof1"), true);
    }

    function testUpdateOracle() public {
        address newOracle = address(5);

        vm.prank(owner);
        oracle.updateOracle(newOracle);

        assertEq(oracle.oracle(), newOracle);
    }

    function testUpdateRewardAmount() public {
        uint256 newReward = 1000 * 10**6;

        vm.prank(owner);
        oracle.updateRewardAmount(newReward);

        assertEq(oracle.monthlyReward(), newReward);
    }
}
