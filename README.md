# Sploot contract hardhat configuration

The sploot contract allowing for minting if an address is on the allowlist.

The allowlist itself is hosted in the merkle.js file


The test is the easiest way to see how the contract works, to try it run:
```
npx hardhat node
```
and in a separate command line:
```
npx hardhat test
```

To start the server hosting the mint site, run:
```
node .
```
This site interacts with the contract hosted on the ropsten network, which can be found here: https://ropsten.etherscan.io/address/0x1EBC5ffF401435521049fC10E7B485EB5146D5D0#code
