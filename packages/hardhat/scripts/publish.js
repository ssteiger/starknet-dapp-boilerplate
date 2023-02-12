const fs = require("fs");
const chalk = require("chalk");

const deploymentsDir = "./deployments";
const publishDir = "../react-app/src/contracts";

const publishContract = (contractName, networkName) => {
  try {
    let contract = fs
      .readFileSync(`${deploymentsDir}/${networkName}/${contractName}.json`)
      .toString();
    contract = JSON.parse(contract);

    // Hardhat Deploy writes a file with all ABIs in react-app/src/contracts/contracts.json
    // If you need the bytecodes and/or you want one file per ABIs, un-comment the following block.
    // Write the contracts ABI, address and bytecodes in case the front-end needs them
    fs.writeFileSync(
      `${publishDir}/${contractName}.address.js`,
      `module.exports = "${contract.address}";`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.abi.js`,
      `module.exports = ${JSON.stringify(contract.abi, null, 2)};`
    );
    fs.writeFileSync(
      `${publishDir}/${contractName}.bytecode.js`,
      `module.exports = "${contract.bytecode}";`
    );

    return true;
  } catch (e) {
    console.log(
      "Failed to publish " + chalk.red(contractName) + " to frontend."
    );
    console.log(e);
    return false;
  }
};

const main = async () => {
  const directories = fs.readdirSync(deploymentsDir);

  console.log({ directories });

  directories.forEach(function (directory) {
    const files = fs.readdirSync(`${deploymentsDir}/${directory}`);

    console.log({ files });

    files.forEach(function (file) {
      if (file.indexOf(".json") >= 0) {
        const contractName = file.replace(".json", "");
        publishContract(contractName, directory);
      }
    });
  });

  console.log("✅  published contracts to frontend");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
