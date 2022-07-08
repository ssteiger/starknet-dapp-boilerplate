import {
  Contract,
  Account,
  defaultProvider,
  ec,
  encode,
  hash,
  json,
  number,
  stark,
  shortString,
  uint256,
  Abi,
} from "starknet";
// https://github.com/0xs34n/starknet.js/blob/develop/src/utils/shortString.ts
import { encodeShortString, decodeShortString } from "starknet/dist/utils/shortString";
// https://github.com/0xs34n/starknet.js/blob/develop/src/utils/number.ts
import { toFelt, toBN } from "starknet/dist/utils/number";
// https://github.com/0xs34n/starknet.js/blob/develop/src/utils/uint256.ts
import { isUint256, uint256ToBN } from "starknet/dist/utils/uint256";
import { getStarknet } from "get-starknet";
import { utils } from "ethers";
import BN, { isBN } from "bn.js";

export const createContract = (abi, address) => {
  const provider = getStarknet().provider;
  return new Contract(abi, address, provider);
};

export const callContract = async (contract, method, ...args) => {
  try {
    return await contract.call(method, args);
  } catch (ex) {
    return Promise.reject(ex);
  }
};

export const sendTransaction = async (contract, method, args = {}) => {
  try {
    const calldata = stark.compileCalldata(args);
    const transaction = {
      contractAddress: contract.address,
      entrypoint: method,
      calldata,
    };
    return await getStarknet().account.execute(transaction);
  } catch (ex) {
    return Promise.reject(ex);
  }
};

const getUint256CalldataFromBN = bn => {
  return {
    type: "struct",
    ...uint256.bnToUint256(bn),
  };
};

export const parseInputAmountToUint256 = (input, _decimals) => {
  let decimals;
  if (!_decimals) {
    decimals = 18;
  } else {
    decimals = _decimals;
  }

  const uint256Calldata = getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString());

  return uint256Calldata;
};
