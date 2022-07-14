export * as ipfs from "./ipfs";
export { default as Transactor } from "./Transactor";
export { default as Web3ModalSetup } from "./Web3ModalSetup";
export { switchNetworks } from "./switchNetworks";
export { blockExplorerLink } from "./blockExplorerLink";

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
