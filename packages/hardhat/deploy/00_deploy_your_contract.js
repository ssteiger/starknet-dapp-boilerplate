/* eslint-disable camelcase */
// deploy/00_deploy_your_contract.js

const { starknet, ethers } = require("hardhat");
const fs = require("fs");

const { shortStringToBigInt } = starknet;

// select a chain to where the contracts shall be deployed

// https://docs.starknet.io/docs/Blocks/transactions/#chain-id
// (SN_LOCALHOST, SN_GOERLI, SN_MAIN)
const chainName = "SN_LOCALHOST";
// const chainName = 'SN_GOERLI';
// const chainName = 'SN_MAIN';
const chainId = shortStringToBigInt(chainName).toString();

// const deployerAddress = process.env.INTEGRATED_DEVNET_DEPLOYER_ADDRESS;
// const deployerPrivKey = process.env.INTEGRATED_DEVNET_DEPLOYER_PRIV_KEY;

// const deployerAddress = process.env.LOCAL_DEVNET_DEPLOYER_ADDRESS;
// const deployerPrivKey = process.env.LOCAL_DEVNET_DEPLOYER_PRIV_KEY;

// const deployerAddress = process.env.GOERLI_DEPLOYER_ADDRESS;
// const deployerPrivKey = process.env.GOERLI_DEPLOYER_PRIV_KEY;

// const deployerAddress = process.env.STARKNET_DEPLOYER_ADDRESS;
// const deployerPrivKey = process.env.STARKNET_DEPLOYER_PRIV_KEY;

console.log("⛓");
console.log({ chainName });
console.log({ chainId });

module.exports = async ({ getNamedAccounts, deployments }) => {
  // see: https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin#Account
  const predeployedAccounts = await starknet.devnet.getPredeployedAccounts();
  const deployerAccount = predeployedAccounts[0];

  console.log({ deployerAccount });

  // OR

  /*
  let deployerAccount;
  try {
    console.log(`fetching account at ${deployerAddress} ...`);

    deployerAccount = await starknet.getAccountFromAddress(
      deployerAddress,
      deployerPrivKey,
      accountName
    );
  } catch (e) {
    console.error(e);
    return;
  }
  */

  console.log({ deployerAccount });
  console.log("");

  const contractName = "ERC20_Mintable";

  console.log(`🚆  fetching contract ${contractName}`);
  const contractERC721 = await starknet.getContractFactory(contractName);

  console.log(`👷‍♀️ deploying contract ${contractName}`);
  const contractERC721_deployed = await contractERC721.deploy({
    name: shortStringToBigInt("MyERC20StarknetToken"),
    symbol: shortStringToBigInt("MERC2ST"),
    decimals: "0",
    initial_supply: shortStringToBigInt("100"),
    recipient: deployerAccount.address,

    // TODO: this is not working, to long?
    owner: deployerAccount.address,
    // owner: shortStringToBigInt("TODO_OwnerAccount"),
  });
  console.log(`👷‍♀️ deploying contract ${contractName}: OK`);
  console.log("🏠  deployed to:", contractERC721_deployed.address);

  /*
  ///
  // publish ABI to frontend
  // TODO: move this into own file and call in 'postdeploy':
  console.log('publish contract to frontend');

  const { address } = contractERC721_deployed;

  // fetch ABI
  const abi = JSON.parse(
    fs.readFileSync(
      `./starknet-artifacts/contracts/ERC721.cairo/ERC721_abi.json`
    )
  );

  const contracts = {};
  contracts[contractName] = {
    address,
    abi,
  };

  const content = {
    [chainId]: {
      [chainName]: {
        name: chainName,
        chainId,
        contracts,
      },
    },
  };

  const publishDir = '../react-app/src/contracts';

  fs.writeFileSync(
    `${publishDir}/hardhat_starknet_contracts.json`,
    `${JSON.stringify(content, null, 2)}`,
    (err) => {
      if (err) {
        console.error('Error writing contracts to frontend:');
        console.error(err);
      }
      // file written successfully
      console.log('contract published to frontend');
    }
  );

  console.log('publish contract to frontend: DONE');
  ///
*/
};

module.exports.tags = ["MyContracts"];
