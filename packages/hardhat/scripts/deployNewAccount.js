const { starknet, ethers } = require("hardhat");
const fs = require("fs");
const chalk = require("chalk");

const accountName = "NewAccount";

const deployNewAccount = async () => {
  try {
    console.log(`now creating account with name: ${accountName}`);
    const account = await starknet.deployAccount(accountName);
    return account;
  } catch (e) {
    console.log(chalk.red("Failed to deploy new account."));
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
  console.log(`Account ${accountName} deployed:`);
  console.log("");
  console.log("Address:", account.starknetContract.address);
  console.log("Public key:", account.publicKey);
  console.log("Private key:", account.privateKey);
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
