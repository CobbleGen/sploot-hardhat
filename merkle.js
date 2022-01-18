const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256')

let whiteListAdresses = [
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
    '0x617F2E2fD72FD9D5503197092aC168c91465E7f2'
]

const leafNodes = whiteListAdresses.map(addr => keccak256(addr, false));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
const rootHash = merkleTree.getRoot();

// console.log(merkleTree.toString())

// const claimingAddress = leafNodes[0];
// console.log(claimingAddress);
// const proof = merkleTree.getHexProof(claimingAddress);
// console.log(proof);


module.exports = {
    leafNodes: leafNodes,
    merkleTree: merkleTree,
    rootHash: rootHash
}