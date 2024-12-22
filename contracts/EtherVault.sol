// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EtherVault is Ownable {
    // Events
    //Allocating vaults
    event VaultAllocated(
        uint32 sellerId, 
        uint256 amount
    );
    //Reclaiming Vault money
    event VaultReclaimed(
        uint32 sellerId, 
        uint256 amount
    );
    
    event ETHDistributed(
        address indexed agency,
        uint32 sellerId, 
        uint256 amount
    );

    // Seller-specific vaults
    mapping(uint32 => uint256) public vaults;


    /**
     * @dev Constructor that sets the initial owner of the contract.
     * @param initialOwner The address of the initial owner (government/admin).
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /*
    * @dev Allocate ETH to a seller's vault.
     * Callable only by the owner (government/admin).
     */
    function allocateVault(uint32 sellerId) external payable onlyOwner {
        require(msg.value > 0, "Allocation must be greater than zero");
        require(vaults[sellerId] == 0, "Vault already allocated for this seller");

        vaults[sellerId] = msg.value;

        emit VaultAllocated(sellerId, msg.value);
    }

    /**
     * @dev Trigger a payment from the seller's vault for a buyer interaction.
     * @param agency The address of the buyer.
     * @param amount The amount of ETH to distribute.
     */
    function distributeETH(address agency , uint32 sellerId, uint256 amount) external {
        require(agency != address(0), "Invalid buyer address");
        require(vaults[sellerId] >= amount, "Insufficient vault balance");

        // Deduct the amount from the seller's vault
        vaults[sellerId] -= amount;

        // Calculate distribution
        uint256 governmentShare = (amount * 50) / 100; // Example: 50% to government
        uint256 agencyShare = amount - governmentShare;

        // Distribute funds
        (bool sentToGovernment, ) = owner().call{value: governmentShare}("");
        require(sentToGovernment, "Failed to send ETH to government");

        (bool sentToAgency, ) = agency.call{value: agencyShare}("");
        require(sentToAgency, "Failed to send ETH to Agency");

        emit ETHDistributed(agency, sellerId, amount);
    }

    /**
     * @dev Reclaim unused ETH from a seller's vault.
     * Callable only by the owner (government/admin).
     * @param sellerId The address of the seller.
     */
    function reclaimVault(uint32 sellerId) external onlyOwner {

        uint256 balance = vaults[sellerId];
        require(balance > 0, "No funds to reclaim");

        // Reset the vault balance
        vaults[sellerId] = 0;

        // Transfer the unused funds back to the owner
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Failed to reclaim ETH");

        emit VaultReclaimed(sellerId, balance);
    }
    /**
     * @dev View the balance of a seller's vault.
     * @param sellerId The address of the seller.
     * @return The amount of ETH in the seller's vault.
     */
    function getVaultBalance(uint32 sellerId) external view returns (uint256) {
        return vaults[sellerId];
    }
    /**
     * @dev Fallback function to prevent accidental ETH deposits.
     */
    receive() external payable {
        revert("Direct ETH transfers not allowed");
    }
}