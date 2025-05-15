const { ethers } = require("hardhat")


async function main(){
	const [deployer] = await ethers.getSigners();

	console.log("Deploying with account : ", deployer.adress);

	const ScorePong = await ethers.getContractFactory("ScorePong");
	const contract = await ScorePong.deploy();
	await contract.waitForDeployment();
	console.log("Contract deployed to : ", await contract.getAddress());
	
	
}

main();
