const { ethers } = require("hardhat")


async function main(){
	const [deployer] = await ethers.getSigners();

	console.log("Deploying with account : ", deployer.adress);

	const ScorePong = await ethers.getContractFactory("contract/smartContract");
	const contract = await ScorePong.deploy();
	await contract.waitDeployement();
	console.log("Contract deployed to : ", await contract.getAddress());
	
	
}

main();
