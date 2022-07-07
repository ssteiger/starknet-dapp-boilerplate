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
    chainId: 31337, // TODO:
    rpcUrl: "",
    blockExplorer: "",
    faucet: "",
  },
  starknet: {
    name: "starknet",
    color: "#17174C",
    // https://starknet.io/documentation/chain-ids/
    // chainId: int.from_bytes(b'SN_MAIN', byteorder="big", signed=False)
    chainId: 23448594291968334,
    rpcUrl: "",
    blockExplorer: "https://voyager.online/",
    faucet: "",
  },
  starknetGoerli: {
    name: "starknetGoerli",
    color: "#f6643c",
    // https://starknet.io/documentation/chain-ids/
    // chainId: int.from_bytes(b'SN_GOERLI', byteorder="big", signed=False)
    chainId: 1536727068981429685321,
    rpcUrl: "",
    blockExplorer: "https://goerli.voyager.online/",
    faucet: "https://faucet.goerli.starknet.io/",
  },
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
};

export const NETWORK = chainId => {
  for (const n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};
