require("dotenv").config();
const { utils } = require("ethers");

require("@shardlabs/starknet-hardhat-plugin");

require("@nomiclabs/hardhat-waffle");
require("@tenderly/hardhat-tenderly");

require("hardhat-deploy");
require("hardhat-gas-reporter");

require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

const { isAddress, getAddress, formatUnits, parseUnits } = utils;

// this is where you configure your deploy configuration
// check out `hardhat/deploy/00_deploy_your_contract.js` to customize your deployment

// https://github.com/Shard-Labs/starknet-hardhat-plugin#starknet-deploy
// https://github.com/Shard-Labs/starknet-devnet

// select the network you want to deploy to here
const defaultNetwork = "integrated-devnet"; // local chain, spawns automatically through starknet-hardhat-plugin via docker
// const defaultNetwork = "devnet"; // local chain - https://github.com/Shard-Labs/starknet-devnet
// const defaultNetwork = "alpha-goerli";
// const defaultNetwork = "alpha-mainnet";

module.exports = {
  starknet: {
    // https://github.com/Shard-Labs/starknet-hardhat-plugin#runtime-network---integrated-devnet
    // venv: "cairo_venv",
    network: defaultNetwork,
    /*
    // https://github.com/Shard-Labs/starknet-hardhat-plugin#wallet
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
    */
  },
  networks: {
    integratedDevnet: {
      url: "http://127.0.0.1:5050",
      // venv: "active" <- for the active virtual environment with installed starknet-devnet
      // venv: "path/to/venv" <- for env with installed starknet-devnet (created with e.g. `python -m venv path/to/venv`)
      // venv: "<VENV_PATH>",
      // or specify Docker image tag
      // dockerizedVersion: "<DEVNET_VERSION>",
      // optional devnet CLI arguments
      args: ["--lite-mode", "--gas-price", "2000000000"],
      accounts: [process.env.INTEGRATED_DEVNET_DEPLOYER_PRIV_KEY],
    },
    devnet: {
      url: "http://127.0.0.1:5050",
      args: ["--gas-price", "2000000000"],
      accounts: [process.env.LOCAL_DEVNET_DEPLOYER_PRIV_KEY],
    },
    alphaGoerli: {
      url: "",
      // accounts: [process.env.GOERLI_DEPLOYER_PRIV_KEY],
    },
    starknet: {
      url: "",
      // accounts: [process.env.STARKNET_DEPLOYER_PRIV_KEY],
    },
  },
  /*
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
    ],
  },
  */
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  etherscan: {
    apiKey: {
      // add other network's API key here
      mainnet: "xxxxxxxx",
    },
  },
};
