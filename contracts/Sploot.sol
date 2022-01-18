// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";


contract Sploot is ERC721, Ownable {
    uint private mintTracker;
    uint private burnTracker;

    bytes32 public merkleRoot;
    mapping(address => bool) public whitelistClaimed;

    string private _baseTokenURI;
    uint private constant maxMints = 3000;
    uint private constant mintPrice = 60000000000000000;
    bool private paused = true;
    bool private open = false;

    mapping(uint => uint) private dataMap;

    constructor(bytes32 _merkleRoot) ERC721("Sploot", "SPLOOT") {
        _baseTokenURI = "";
        merkleRoot = _merkleRoot;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function mint(bytes32[] calldata proof) public payable {
        require(!paused || msg.sender == owner());

        require(!whitelistClaimed[msg.sender], "address has already claimed");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, false));
        console.log("Leaf is %s and encodePacked is", msg.sender);
        require(MerkleProof.verify(proof, merkleRoot, leaf) || msg.sender == owner() || open, "Minter is not whitelisted.");
        whitelistClaimed[msg.sender] = true;

        require(msg.value == mintPrice
         || msg.sender == owner(),
          "It costs 0.06 eth to mint a Sploot.");
        require(mintTracker < maxMints, "No more can be minted.");
        mintTracker++;
        _mint(msg.sender, mintTracker);
    }

    function adminMint(uint amount) public onlyOwner {
        for (uint256 i = 0; i < amount; i++) {
            mintTracker++;
            _mint(msg.sender, mintTracker);
        }
    }

    function setRoot(bytes32 root) public onlyOwner {
        merkleRoot = root;
    }

    function pauseUnpause(bool p) public {
        paused = p;
    }

    function openToPublic(bool o) public onlyOwner {
        open = o;
    }

    function totalSupply() public view returns(uint) {
        return mintTracker-burnTracker;
    }

    function burn(uint tokenId) public virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Caller is not owner nor approved");
        burnTracker++;
        _burn(tokenId);
    }

    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

}