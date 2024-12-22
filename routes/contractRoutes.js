const express = require('express');
const router = express.Router();
const { distributeETH } = require('../controllers/lotflow');
const { setBuyerAddress, mintNft } = require('../controllers/mint');

const agencyAddress = process.env.AGENCY_ADDRESS;  // AGENCY PUBLIC KEY // hardcoded for now

// Success route - Handle buyer address, seller ID, and token URI for NFT minting and ETH distribution
app.get('/failure', (req, res) => {
    const failureReason = true;
  
    if (failureReason) {
        // If failure reason is provided, send a failure response
        res.status(400).json({
          msg:"payment failed"
        });
    }
  });
  



  app.post('success/nft-mint', (req, res) => {
    // Extract buyerId, sellerId, and public addresses from the request body
    const {  sellerId, tokenURI ,buyerPublicAddress } = req.body;

    // Check if all necessary fields are provided
    if (tokenURI && sellerId && buyerPublicAddress ) {
        // Simulate creating an NFT tokenURI (this could be dynamic in real applications)
        

        // Respond with the tokenURI, buyerId, sellerId, and public addresses
        res.status(200).json({
          msg:tokenURI
        });
    } else {
        // If any of the required fields are missing, return an error
        res.status(400).json({
            status: 'failure',
            message: 'BuyerId, SellerId and BuyerPublicAddress are required'
        });
    }
});











router.post('/success', async (req, res) => {
    const { buyerAddress, sellerId, tokenUri } = req.body;  // We expect buyerAddress, sellerId, and tokenUri

    // Validate request parameters
    if (!buyerAddress || !sellerId || !tokenUri) {  
        return res.status(400).json({
            message: 'Buyer Address, Seller ID, and Token URI are required.',
        });
    }

    try {
        // Step 1: Set buyer address in the NFT contract
        await setBuyerAddress(buyerAddress);

        // Step 2: Mint NFT for the buyer
        const tokenId = await mintNft(tokenUri);  // Assuming mintNft returns a tokenId
        console.log(`Minted NFT with tokenId: ${tokenId}`);

        // Step 3: Distribute ETH (fixed amount: 0.01 ETH)
        const amountInWei = ethers.utils.parseEther("0.01"); // 0.01 ETH to wei
        await distributeETH(sellerId, agencyAddress, amountInWei);

        res.status(200).json({
            message: 'Payment processed and blockchain actions completed successfully.',
            tokenId,  // Return tokenId for reference
        });
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).json({ message: 'Failed to process payment.', error: err.message });
    }
});

module.exports = router;
