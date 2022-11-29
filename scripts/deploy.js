const hre = require("hardhat");

async function main() {

  const Lock = await hre.ethers.getContractFactory("GenPool");
  const lock = await Lock.deploy("0x48731cF7e84dc94C5f84577882c14Be11a5B7456",6,1669716644);    

  await lock.deployed();

  console.log(
    `deployed to ${lock.address}`
    );

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
