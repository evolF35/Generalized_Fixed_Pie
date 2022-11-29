const { ethers } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");


async function main() {

    const [owner, randomPerson] = await hre.ethers.getSigners();
    const lockedAmount = hre.ethers.utils.parseEther("0.1");

    const Lock = await hre.ethers.getContractFactory("GenPool");

    const lock = await Lock.deploy("0x48731cF7e84dc94C5f84577882c14Be11a5B7456",6,1669716644);    

    await lock.deployed();
  
    console.log(
      `deployed to ${lock.address}`
      );

    contractBal = await hre.ethers.provider.getBalance(lock.address);
    console.log(contractBal);

    let txn1 = await lock.depositToPOS({value:lockedAmount});
    let txn2 = await lock.depositToNEG({value:lockedAmount});

    contractBal = await hre.ethers.provider.getBalance(lock.address);
    console.log(contractBal);

    let txn3 = await lock.depositToNEG({value:lockedAmount});
    contractBal = await hre.ethers.provider.getBalance(lock.address);
    console.log(contractBal);

    let txn4 = await lock.changeSettlementDate();
    txn4 = await lock.settle();
    
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
