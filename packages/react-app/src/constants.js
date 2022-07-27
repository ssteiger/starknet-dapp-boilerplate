import { encodeShortString, decodeShortString } from "starknet/dist/utils/shortString";

// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "";

// MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "";

// BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "";

export const ALCHEMY_KEY = "";

export const NETWORKS = {
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
  },
  /*
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
    faucet: "",
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://goerli.etherscan.io/",
    faucet: "https://goerli-faucet.slock.it/",
  },
  */
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};
