const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')
const { ethers } = require("hardhat");

const allowlist = {
    //Address, how many they are allowed to mint, and if they can mint it for free or not
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266' : [5, true],
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' : [1, true],
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' : [2, false],
    '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB' : [1, false],
    '0x617F2E2fD72FD9D5503197092aC168c91465E7f2' : [1, false]
}

const leafNodes = Object.keys(allowlist).map(k => generateLeaf(k, allowlist[k][0], allowlist[k][1]));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

function generateLeaf(address, amount, free) {
    return ethers.utils.solidityKeccak256(['address', 'uint256', 'bool'], [address, amount, free]);
}

module.exports = {
    leafNodes: leafNodes,
    merkleTree: merkleTree,
    rootHash: rootHash,
    generateLeaf: generateLeaf,
    allowlist: allowlist
}

