const { nftContract } = require('../config/configsol');
const { ethers } = require('ethers');


const setBuyerAddress = async (buyerAddress) => {
    if (!ethers.utils.isAddress(buyerAddress)) {
        throw new Error("Invalid buyer address.");
    }

    const tx = await nftContract.setBuyerAddress(buyerAddress);
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`Buyer address ${buyerAddress} set successfully.`);
};
    
/**
 * Mint an NFT for the current buyer.
 * @param {string} tokenUri - The token URI for the NFT metadata.
 */
const mintNft = async (tokenUri) => {
    if (!tokenUri) {
        throw new Error("Token URI is required.");
    }

    const tx = await nftContract.mintNft(tokenUri);
    await tx.wait(); // Wait for the transaction to be mined
    console.log(`NFT minted successfully with URI: ${tokenUri}`);
};

/**
 * Retrieve all token URIs associated with a specific buyer.
 * @param {string} buyerAddress - The buyer's wallet address.
 * @returns {Promise<string[]>} - An array of token URIs.
 */
const getTokenUrisByBuyer = async (buyerAddress) => {
    if (!ethers.utils.isAddress(buyerAddress)) {
        throw new Error("Invalid buyer address.");
    }

    const tokenUris = await nftContract.getTokenUrisByBuyer(buyerAddress);
    console.log(`Token URIs for buyer ${buyerAddress}:`, tokenUris);
    return tokenUris;
};

module.exports = {
    setBuyerAddress,
    mintNft,
    getTokenUrisByBuyer,
};