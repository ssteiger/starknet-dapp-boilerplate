require("dotenv").config();
const { utils } = require("ethers");
const fs = require("fs");
const chalk = require("chalk");

require("@shardlabs/starknet-hardhat-plugin");

require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");

require("hardhat-deploy");
require("hardhat-gas-reporter");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

/*
  📡 This is where you configure your deploy configuration

  check out `packages/scripts/deploy.js` to customize your deployment

  out of the box it will auto deploy anything in the `contracts` folder and named *.cairo
  plus it will use *.args for constructor args
*/

// select the network you want to deploy to here:
const defaultNetwork = "devnet";

module.exports = {
  starknet: {
    venv: "cairo_venv",
    // network: "integrated-devnet",
    network: "devnet",
    wallets: {
      MyWallet: {
        accountName: "MyWallet",
        modulePath:
          "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/.starknet_accounts",
      },
      AnotherWallet: {
        accountName: "AnotherWallet",
        modulePath:
          "starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount",
        accountPath: "~/.starknet_accounts",
      },
    },
  },
  networks: {
    devnet: {
      url: "http://127.0.0.1:5050",
      args: ["--gas-price", "2000000000"],
    },
    starknet: {
      url: "",
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.6.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  ovm: {
    solcVersion: "0.7.6",
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: {
    apiKey: {
      mainnet: "xxxxxxxx",
      // add other network's API key here
    },
  },
};
