# Starknet dApp boilerplate

A boilerplate to quickly get up and running with Starknet dApp development.

Using Cairo, Hardhat and ReactJS.

## Getting started

### 1. Install requirements for local starknet chain

```bash
# run
sh ./start-local-chain.sh

# or

# see: https://www.cairo-lang.org/docs/quickstart.html
python3 -m venv ~/cairo_venv
source ~/cairo_venv/bin/activate
pip install -r requirements.txt
```

### 2. Start local starknet chain

```bash
starknet-devnet

# check if chain is running ok
curl http://127.0.0.1:5050/is_alive
```

### 3. Prepare js environment

```bash
# install dependencies
yarn
```

### 4. Fund Accounts

When running `yarn chain` a bunch of pre-funded accounts are logged in the terminal.

Pick one and go to `/packages/hardhat/example.env`.

Duplicate `example.env` and rename to `.env`.
Then insert one of the public+private key pairs from the terminal at `INTEGRATED_DEVNET_DEPLOYER_ADDRESS=0x...` and `INTEGRATED_DEVNET_DEPLOYER_PRIV_KEY=...`.

### 5. Deploy contracts and start frontend

```bash
# compile contracts
yarn compile

# deploy contracts
yarn deploy

# start app (in top level folder)
yarn start
```

## Concepts / project structure

When running `yarn deploy`, all contract information (target chain, address, abi, etc.) is written do the react frontend package at `packages/react-app/src/contracts/hardhat_starknet_contracts.json`.

The contracts can then be accessed from inside any react component:

```javascript
import externalContracts from "./contracts/external_contracts";
import deployedContracts from "./contracts/hardhat_starknet_contracts";
```

## Deploy a new account

Configure account in `packages/hardhat/scripts/deployNewAccount.js`.

Then run:

```bash
yarn deployNewAccount
```

## Get some test eth

1. [Local network devnet faucet](https://github.com/Shard-Labs/starknet-devnet#mint-token---local-faucet)
1. Public goerli testnet
    1. Fetch from [goerli faucet](https://goerlifaucet.com/) ([alternative](https://goerli-faucet.slock.it/)).
    2. Then bridge it over to starknet using the [goerli starknet bridge](https://goerli.starkgate.starknet.io/).

## Verify contract

```bash
cd starknet-mvp/packages/hardhat

sudo npx hardhat starknet-verify --starknet-network alpha-goerli --path ./contracts/ERC721.cairo --address 0x0585feed17184d7990c57febcbb8e185f6607f49a2152c2965da5f01d373a405 --show-stack-traces
```

## Supported networks

```javascript
  localhost: {
    name: "localhost",
    color: "#666666",
    // https://stackoverflow.com/questions/72909464/how-to-get-starknet-chainid-using-javascript
    chainId: encodeShortString("SN_LOCALHOST"),
    rpcUrl: "http://localhost:5050",
    blockExplorer: "",
    faucet: "",
  },
  starknetGoerli: {
    name: "starknetGoerli",
    color: "#f6643c",
    chainId: encodeShortString("SN_GOERLI"),
    rpcUrl: "",
    blockExplorer: "https://goerli.voyager.online/",
    faucet: "https://faucet.goerli.starknet.io/",
  },
  starknet: {
    name: "starknet",
    color: "#17174C",
    chainId: encodeShortString("SN_MAIN"),
    rpcUrl: "",
    blockExplorer: "https://voyager.online/",
    faucet: "",
  }
```

## Resources

* [starknet](https://starkware.co/starknet/)
* [cairo-lang](https://www.cairo-lang.org/)
* [cairo-lang docs](https://www.cairo-lang.org/docs/)
* [starknet.js](https://github.com/0xs34n/starknet.js)
* [starknet-react](https://github.com/apibara/starknet-react)
* [web3-starknet-react](https://github.com/dhruvkelawala/web3-starknet-react/tree/main/docs)
* [starknet-hardhat-plugin](https://github.com/Shard-Labs/starknet-hardhat-plugin)
* [goerli starknet block explorer](https://goerli.voyager.online/)
* [example deployment](https://goerli.voyager.online/contract/0x0585feed17184d7990c57febcbb8e185f6607f49a2152c2965da5f01d373a405)
* [starknet goerli faucet](https://faucet.goerli.starknet.io/)
* [starknet-devnet](https://github.com/Shard-Labs/starknet-devnet)

## Great Tutorials

* [fullstack-starknet](https://github.com/sambarnes/fullstack-starknet)

## License

MIT
