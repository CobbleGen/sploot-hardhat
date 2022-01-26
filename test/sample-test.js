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

  it('First allowlisted account can mint for free', async () => {
    const [allowedAmount, free] = merkle.allowlist[account1.address]
    const leaf = merkle.generateLeaf(account1.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0")}
    await sploot.connect(account1).mint(proof, allowedAmount, free, 1, options);
  })

  it('First allowlisted account cannot mint twice', async () => {
    const [allowedAmount, free] = merkle.allowlist[account1.address]
    const leaf = merkle.generateLeaf(account1.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0")}
    try {
      await sploot.connect(account1).mint(proof, allowedAmount, free, 1, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('First allowlisted account cannot mint twice even when lying', async () => {
    const [allowedAmount, free] = merkle.allowlist[account1.address]
    const leaf = merkle.generateLeaf(account1.address, 2, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0")}
    try {
      await sploot.connect(account2).mint(proof, 2, free, 1, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Second allowlisted account cannot mint for free', async () => {
    const [allowedAmount, free] = merkle.allowlist[account2.address]
    const leaf = merkle.generateLeaf(account2.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0")}
    try {
      await sploot.connect(account2).mint(proof, allowedAmount, free, 1, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Second allowlisted account can mint two when paid for', async () => {
    const [allowedAmount, free] = merkle.allowlist[account2.address]
    const leaf = merkle.generateLeaf(account2.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0.12")}
    await sploot.connect(account2).mint(proof, allowedAmount, free, 2, options);
  })

  it('But it cannot mint another one', async () => {
    const [allowedAmount, free] = merkle.allowlist[account2.address]
    const leaf = merkle.generateLeaf(account2.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0.06")}
    try {
      await sploot.connect(account2).mint(proof, allowedAmount, free, 1, options);
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('Non allowlisted account cannot mint', async () => {
    const [allowedAmount, free] = [2, true]
    const leaf = merkle.generateLeaf(account2.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0.06")}
    try {
      await sploot.connect(account3).mint(proof, allowedAmount, free, 1, options);
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

  it('Non allowlisted account can now mint', async () => {
    const [allowedAmount, free] = [2, true]
    const leaf = merkle.generateLeaf(account3.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0.06")}
    await sploot.connect(account3).mint(proof, allowedAmount, free, 1, options);
  })

  it('First allowlisted account cannot for free', async () => {
    const [allowedAmount, free] = merkle.allowlist[account1.address]
    const leaf = merkle.generateLeaf(account1.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0")}
    try {
      await sploot.connect(account1).mint(proof, allowedAmount, free, 1, options);
      expect.fail()
    } catch (error) {
      expect(error).to.be.instanceOf(Error);
    }
  })

  it('First allowlisted account can now mint if paid for', async () => {
    const [allowedAmount, free] = merkle.allowlist[account1.address]
    const leaf = merkle.generateLeaf(account1.address, allowedAmount, free)
    const proof = merkle.merkleTree.getHexProof(leaf)
    const options = {value: ethers.utils.parseEther("0.06")}
    await sploot.connect(account1).mint(proof, allowedAmount, free, 1, options);
  })
  
});
