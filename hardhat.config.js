require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require("@nomiclabs/hardhat-ethers");

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");

require("hardhat-gas-reporter");


const GoerliUrl =
process.env.ALCHEMY_API_KEY ?
   `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
   process.env.OPTIMISM_GOERLI_URL

const optimismGoerliUrl =
   process.env.ALCHEMY_API_KEY ?
      `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}` :
      process.env.OPTIMISM_GOERLI_URL


   
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  etherscan:{
    apiKey: `${process.env.ETHERSCAN_API_KEY}`
  },
  networks: {
    "optimism-goerli": {
       url: optimismGoerliUrl,
       accounts: { mnemonic: process.env.MNEMONIC }
    },
    "goerli": {
      url: GoerliUrl,
      accounts: { mnemonic: process.env.MNEMONIC }
   }
  },
};