# Starknet dApp boilerplate

A boilerplate to quickly get up and running with Starknet dApp development.
Using Cairo, Hardhat and ReactJS.

## Getting started

### Install requirements for local starknet chain

```bash
$ python3 -m venv cairo_venv
$ source cairo_venv/bin/activate
$ pip install -r requirements.txt
```

### Start local starknet chain

```bash
$ starknet-devnet
```

```bash
# install js dependencies
$ yarn

# 1. terminal
# start local chain
$ yarn chain

# 2. terminal
# compile contracts
$ yarn compile

# deploy contracts
# (maybe you first need to create the folder /packages/hardhat/deployments)
$ yarn deploy

# start app (in top level folder)
$ yarn start
```

## Accounts

When running `yarn deploy` the deploy script in `packages/hardhat/deploy/00_deploy_your_contract.js` is executed.

The deploy script has a `CREATE_NEW_ACCOUNT` flag at the top:

```javascript
const CREATE_NEW_ACCOUNT = false;
const FETCH_EXISTING_ACCOUNT = !CREATE_NEW_ACCOUNT;
```

Running the script for the first time, you'll need to create a new account.
Deployments after that can reuse the created account.

Toggle the bool flag and update the variables `const accountAddress` and `const privateKey` accordingly.

## Get some test eth

1. Get some goerli testnet eth from the [goerli faucet](https://goerlifaucet.com/) ([alternative](https://goerli-faucet.slock.it/)).
2. Then bridge it over to starknet using the [goerli starknet bridge](https://goerli.starkgate.starknet.io/).

## Verify contract

```bash
$ cd starknet-mvp/packages/hardhat

$ sudo npx hardhat starknet-verify --starknet-network alpha-goerli --path ./contracts/ERC721.cairo --address 0x0585feed17184d7990c57febcbb8e185f6607f49a2152c2965da5f01d373a405 --show-stack-traces
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
