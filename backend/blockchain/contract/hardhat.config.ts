import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    fuji: {
      url: process.env.AVAX_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 43113, // ID du testnet Fuji
    },
  },
};

export default config;
