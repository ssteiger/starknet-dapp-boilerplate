const { starknet, ethers } = require("hardhat");
const fs = require("fs");
const chalk = require("chalk");

// see: https://www.npmjs.com/package/@shardlabs/starknet-hardhat-plugin#account
const accountType = "OpenZeppelin";
// const accountType = "Argent";

const options = {
  salt: "", // for fixing the account address
  privateKey: "", // if you don't provide one, it will be randomly generated,
  token: "", // for indicating that the account is whitelisted on alpha-mainnet
};

const deployNewAccount = async () => {
  try {
    console.log(`now deploying account of type ${accountType}`);
    const account = await starknet.deployAccount(accountType, options);
    return account;
  } catch (e) {
    console.log(chalk.red("failed to deploy new account"));
    console.log(e);
    return false;
  }
};

async function main() {
  const account = await deployNewAccount();
  if (!account) return;

  console.log(
    "---------------------------------------------------------------------------------------"
  );
  console.log(`account of trype ${accountType} deployed:`);
  console.log("");
  console.log("address:", account.starknetContract.address);
  console.log("public key:", account.publicKey);
  console.log("private key:", account.privateKey);
  console.log(
    "---------------------------------------------------------------------------------------"
  );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
