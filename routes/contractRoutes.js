const express = require('express');
const router = express.Router();
const { distributeETH } = require('../controllers/lotflow');
const { setBuyerAddress, mintNft } = require('../controllers/mint');

const agencyAddress = process.env.AGENCY_ADDRESS;  // AGENCY PUBLIC KEY // hardcoded for now

// Success route - Handle buyer address, seller ID, and token URI for NFT minting and ETH distribution
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
