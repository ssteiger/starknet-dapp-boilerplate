/* eslint-disable camelcase */
// deploy/00_deploy_your_contract.js

const { starknet, ethers } = require("hardhat");
const fs = require("fs");

const { shortStringToBigInt } = starknet;

// https://starknet.io/documentation/chain-ids/
const starknetGoerliChainId = "1536727068981429685321"; // SN_GOERLI

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  /*
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  */

  // see: https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin#Account
  const accountName = "OpenZeppelin";

  const CREATE_NEW_ACCOUNT = false;
  const FETCH_EXISTING_ACCOUNT = !CREATE_NEW_ACCOUNT;

  let account = null;

  console.log("");

  if (CREATE_NEW_ACCOUNT) {
    console.log(`now creating account with name: ${accountName}`);
    account = await starknet.deployAccount(accountName);
  }

  if (FETCH_EXISTING_ACCOUNT) {
    // fetch account if already generated
    // TODO:
    const accountAddress =
      "0x0358576968ff2ea1e9537e0fb8f063b4d047bb8958fdd57485782a9d37ecb9ee";
    const privateKey =
      "0x262f5da99e4d1a0a98e2a21eb3cd75784468ae7d38877c7d743523374070d4e";

    console.log(`now fetching account at address: ${accountAddress}`);
    account = await starknet.getAccountFromAddress(
      accountAddress,
      privateKey,
      accountName
    );
  }

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
    "1536727068981429685321": {
      starknetGoerli: {
        name: "starknetGoerli",
        // chainId: int.from_bytes(b'SN_GOERLI', byteorder="big", signed=False)
        chainId: "1536727068981429685321",
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
