/* eslint-disable camelcase */
// deploy/00_deploy_your_contract.js

const { starknet, ethers } = require("hardhat");
const fs = require("fs");

const { shortStringToBigInt } = starknet;

// https://docs.starknet.io/docs/Blocks/transactions/#chain-id
// SN_LOCALHOST, SN_GOERLI, SN_MAIN
const chainName = "SN_LOCALHOST";
// const chainName = "SN_GOERLI"
// const chainName = "SN_MAIN"
const chainId = shortStringToBigInt(chainName).toString();

console.log({ chainName });
console.log({ chainId });

module.exports = async ({ getNamedAccounts, deployments }) => {
  /*
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  */

  // see: https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin#Account
  const accountName = "OpenZeppelin";

  const account = null;

  console.log("");

  const namedAccounts = await getNamedAccounts();
  const { deployer } = namedAccounts;

  console.log({
    LOCAL_DEPLOYER_ADDRESS: process.env.LOCAL_DEPLOYER_ADDRESS,
    LOCAL_DEPLOYER_PRIV_KEY: process.env.LOCAL_DEPLOYER_PRIV_KEY,
    accountName,
  });

  let deployerAccount;
  try {
    console.log(`fetching account at ${process.env.LOCAL_DEPLOYER_ADDRESS}...`);

    deployerAccount = await starknet.getAccountFromAddress(
      process.env.LOCAL_DEPLOYER_ADDRESS,
      process.env.LOCAL_DEPLOYER_PRIV_KEY,
      accountName
    );
  } catch (e) {
    // if no account exists at address, deploy
    console.error(e);
    console.log(`no account found at ${process.env.LOCAL_DEPLOYER_ADDRESS}`);
    console.log("now deploying account...");
    const accountWithPredefinedKey = await starknet.deployAccount(accountName, {
      privateKey: process.env.LOCAL_DEPLOYER_PRIV_KEY,
    });

    deployerAccount = accountWithPredefinedKey;
  }

  console.log({ deployerAccount, namedAccounts });

  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log("account:");
  console.log("");
  console.log("contract address:", account.starknetContract.address);
  console.log("public key:", account.publicKey);
  console.log("private key:", account.privateKey);
  console.log(
    "---------------------------------------------------------------------------------------"
  );

  const contractName = "ERC721";

  console.log(`fetching contract ${contractName} ...`);
  const contractERC721 = await starknet.getContractFactory(contractName);

  const contractERC721_deployed = await contractERC721.deploy({
    name: shortStringToBigInt("StarknetNFT"),
    symbol: shortStringToBigInt("SNFT"),
    // TODO: this is not working, to long?
    // owner: shortStringToBigInt(`${account.starknetContract.address}`),
    owner: shortStringToBigInt("TODO_OwnerAccount"),
  });

  console.log("deployed to:", contractERC721_deployed.address);
  console.log(
    "block explorer:",
    `https://goerli.voyager.online/contract/${contractERC721_deployed.address}`
  );

  ///
  // publish ABI to frontend
  // TODO: move this into own file and call in "postdeploy":
  console.log("publish contract to frontend");

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

  const publishDir = "../react-app/src/contracts";

  fs.writeFileSync(
    `${publishDir}/hardhat_starknet_contracts.json`,
    `${JSON.stringify(content, null, 2)}`,
    (err) => {
      if (err) {
        console.error("Error writing contracts to frontend:");
        console.error(err);
      }
      // file written successfully
      console.log("contract published to frontend");
    }
  );

  console.log("publish contract to frontend: DONE");
  ///
};

module.exports.tags = ["MyContracts"];
