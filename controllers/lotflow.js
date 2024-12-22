const { etherVault } = require('../config/configsol');
const { ethers } = require('ethers');

// Allocate Vault for Seller
const allocateVault = async (sellerId) => {
    const tx = await etherVault.allocateVault(sellerId); // Example: 1 ETH allocation
    await tx.wait();
    return tx.hash;
};

// Distribute ETH from Seller to Buyer                                              //EDIT!@#$%^&*()(*&^%$#)
const distributeETH = async (sellerId, agencyAddress, amount) => {
    if (!ethers.utils.isAddress(agencyAddress)) {
        throw new Error('Invalid agency address.');
    }

    if (!ethers.utils.isAddress(sellerId)) {
        throw new Error('Invalid seller ID.');
    }

    // Call the `distributeETH` method on the EtherVault contract
    const tx = await etherVault.distributeETH(
        sellerId,
        agencyAddress,
        ethers.utils.parseEther(amount.toString())
    );

    await tx.wait(); // Wait for confirmation
    console.log(`Distributed ${amount} ETH successfully.`);
};
// Get Vault Balance
const getVaultBalance = async (sellerId) => {
    const balance = await etherVault.getVaultBalance(sellerId);
    return ethers.utils.formatEther(balance);
};

// Reclaim Vault
const reclaimVault = async (sellerId) => {
    const tx = await etherVault.reclaimVault(sellerId);
    await tx.wait();
    return tx.hash;
};

module.exports = {
    allocateVault,
    distributeETH,
    getVaultBalance,
    reclaimVault,
};