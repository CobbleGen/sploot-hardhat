const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')
const { ethers } = require("hardhat");

const allowlist = {
    //Address, how many they are allowed to mint, and if they can mint it for free or not
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' : [1, true],
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC' : [2, false],
    '0x7341A5e001AF4f53Faba168e8d0406dea2587A3D' : [2, true],
    '0xE0666cAC0C2267209Ba3Da4Db00c03315Fe64fA8' : [3, false],
    '0x7c7d093b4Fb96C89fcC29cD4c24c15DB0ed669dF' : [5, false],
    '0x9DDf691De5e1F4f7764262Be936B61f46d9f9d70' : [4, true],
    '0xC1D91798d36e4A14ebF08208287302A597d7E759' : [1, false]
}

const leafNodes = Object.keys(allowlist).map(k => generateLeaf(k, allowlist[k][0], allowlist[k][1]));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

function generateLeaf(address, amount, free) {
    return ethers.utils.solidityKeccak256(['address', 'uint256', 'bool'], [address, amount, free]);
}

console.log(rootHash.toString('hex'))

module.exports = {
    leafNodes: leafNodes,
    merkleTree: merkleTree,
    rootHash: rootHash,
    generateLeaf: generateLeaf,
    allowlist: allowlist
}

