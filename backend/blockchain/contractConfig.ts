const { ethers } = require("ethers");
require("dotenv").config();
const abi = require("./abi/ScorePong.json");

const provider = new ethers.JsonRpcProvider(process.env.AVAX_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi.abi, wallet);

module.exports = contract;
