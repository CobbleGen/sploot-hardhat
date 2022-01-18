const { expect, should } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require('keccak256')
const merkle = require("../merkle")

let sploot;
let account1, account2, account3, admin;

describe("Sploot NFTs", function () {
  before("", async function () {
    [admin, account1, account2, account3] = await ethers.getSigners();

    const Sploot = await ethers.getContractFactory("Sploot");
    sploot = await Sploot.deploy(merkle.rootHash);
    await sploot.deployed();
  });

  it('Unpause', async () => {
    await sploot.pauseUnpause(false);
  })

  it('Merkle root is right', async () => {
    let root = await sploot.merkleRoot();
    expect(root).to.equal('0x'+merkle.rootHash.toString('hex'));
  })

  it('Whitelisted account can mint', async () => {
    const proof = merkle.merkleTree.getHexProof(keccak256(account1.address));
    const options = {value: ethers.utils.parseEther("0.03")}
    await sploot.connect(account1).mint(proof, options);
  })

  it('Whitelisted account cannot mint twice', async () => {
    const proof = merkle.merkleTree.getHexProof(keccak256(account1.address));
    const options = {value: ethers.utils.parseEther("0.06")}
    try {
      await sploot.connect(account1).mint(proof, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Unwhitelisted account can not mint', async () => {
    const proof = merkle.merkleTree.getHexProof(keccak256(account3.address));
    const options = {value: ethers.utils.parseEther("0.06")}
    try {
      const result = await sploot.connect(account3).mint(proof, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Anyone cannot open the contract', async () => {
    try {
      await sploot.openToPublic(true);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Admin can open the contract', async () => {
    await sploot.connect(admin).openToPublic(true);
  })

  it('Unwhitelisted account can now mint', async () => {
    const proof = merkle.merkleTree.getHexProof(keccak256(account3.address));
    const options = {value: ethers.utils.parseEther("0.06")}
    await sploot.connect(account3).mint(proof, options);
  })
  
});
