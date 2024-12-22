require('dotenv').config();
const { ethers } = require('ethers');

// Ethereum Provider
const provider = new ethers.providers.JsonRpcProvider(URL); // RPC URL from .env
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider); // Private key from .env

// Contract Configuration
const contractAddress = process.env.CONTRACT_ADDRESS; 
const contractABI = require('./abi.json');

//NFT Configuration
const nftAddress = process.env.NFT_ADDRESS;
const nftABI = require('./nftabi.json');

const etherVault = new ethers.Contract(contractAddress, contractABI, signer);
const nftContract = new ethers.Contract(nftAddress, nftABI, signer);


module.exports = { etherVault  , nftContract};