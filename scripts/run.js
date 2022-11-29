const { ethers } = require("hardhat");
const hre = require("hardhat");
require("@nomiclabs/hardhat-web3");


async function main() {

    const [owner, randomPerson] = await hre.ethers.getSigners();
    const lockedAmount = hre.ethers.utils.parseEther("0.1");

    const Lock = await hre.ethers.getContractFactory("Pool");
    const lock = await Lock.deploy();    

    await lock.deployed();
  
    //let gsUsed = BigInt(lock.deployed().cumulativeGasUsed) * BigInt(lock.deployed().effectiveGasPrice);

    //const gsUsed = BigInt(receipt.cumulativeGasUsed) * BigInt(receipt.effectiveGasPrice);

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

    let settle = await lock.pastSettlementDate();
    console.log(settle);

    await lock.changeSettlementDate();

    settle = await lock.pastSettlementDate();
    console.log(settle);

    let pos = await lock.getAllowancePOS();
    console.log(pos);

    await lock.approveWithPOS();

    pos = await lock.getAllowancePOS();
    console.log(pos);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
