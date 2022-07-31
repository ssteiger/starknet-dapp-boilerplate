const fs = require("fs");

// create hardhat_contracts.json
if (!fs.existsSync("./src/contracts/hardhat_contracts.json")) {
  try {
    fs.writeFileSync("./src/contracts/hardhat_contracts.json", JSON.stringify({}));
    console.log("src/contracts/hardhat_contracts.json created.");
  } catch (error) {
    console.log(error);
  }
}

// create hardhat_starknet_contracts.json
if (!fs.existsSync("./src/contracts/hardhat_starknet_contracts.json")) {
  try {
    fs.writeFileSync("./src/contracts/hardhat_starknet_contracts.json", JSON.stringify({}));
    console.log("src/contracts/hardhat_starknet_contracts.json created.");
  } catch (error) {
    console.log(error);
  }
}
