export const blockExplorerLink = (address, blockExplorer) =>
  `${blockExplorer || "https://goerli.voyager.online/"}contract/${address}`;
