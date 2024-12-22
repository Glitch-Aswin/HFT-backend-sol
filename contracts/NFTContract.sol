// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTContract is ERC721 {
    error BasicNft__TokenUriNotFound();

    // Mapping from tokenId to tokenUri
    mapping(uint256 => string) private s_tokenIdToUri;
    // Mapping from buyer address to list of token URIs
    mapping(address => string[]) private s_buyerToTokenUris;
    uint256 private s_tokenCounter;

    constructor() ERC721("Lottery", "LOT") {
        s_tokenCounter = 0;
    }

    address private currentBuyer;

    function setBuyerAddress(address _buyer) public {
        currentBuyer = _buyer;
    }

    function mintNft(string memory tokenUri) public {
        require(currentBuyer != address(0), "Invalid Buyer");

        // Mint the NFT
        s_tokenIdToUri[s_tokenCounter] = tokenUri;
        _safeMint(currentBuyer, s_tokenCounter);

        // Add the token URI to the buyer's mapping
        s_buyerToTokenUris[currentBuyer].push(tokenUri);

        // Increment token counter
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (ownerOf(tokenId) == address(0)) {
            revert BasicNft__TokenUriNotFound();
        }
        return s_tokenIdToUri[tokenId];
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    // Function to get all token URIs associated with a specific buyer
    function getTokenUrisByBuyer(address buyer) public view returns (string[] memory) {
        return s_buyerToTokenUris[buyer];
    }
}