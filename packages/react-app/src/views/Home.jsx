import React, { useEffect, useState } from "react";
import { stark, Abi, Contract, uint256 } from "starknet";
import { toFelt, toBN } from "starknet/dist/utils/number";
import { isUint256, uint256ToBN } from "starknet/dist/utils/uint256";
import { getStarknet } from "get-starknet";
import { Contract as ContractUI } from "../components";
import { createContract, callContract, sendTransaction, parseInputAmountToUint256 } from "../helpers/starknet";

function Home({ contractConfig }) {
  const { provider } = getStarknet();
  // account
  // contract address: 0x0358576968ff2ea1e9537e0fb8f063b4d047bb8958fdd57485782a9d37ecb9ee
  // public key: 0x02a1a39159689137a15eb583dd72c626f9602987a6d6b2f8281decbbdad4bff1
  // private key: 0x262f5da99e4d1a0a98e2a21eb3cd75784468ae7d38877c7d743523374070d4e
  const accountAddress = "0x0358576968ff2ea1e9537e0fb8f063b4d047bb8958fdd57485782a9d37ecb9ee";
  // const account = new starknet.Account(provider, accountAddress, starkKeyPair);

  const { address, abi } =
    contractConfig.deployedContracts["1536727068981429685321"].starknetGoerli.contracts["ERC721"];
  // https://apibara.github.io/starknet-react/hooks/contract

  const erc721Contract = createContract(abi, address);

  const [balanceOf, setBalanceOf] = useState();
  useEffect(() => {
    const exec = async () => {
      let _balanceOf = await callContract(erc721Contract, "balanceOf", address);
      // NOTE: Cairo native type (felt, field element) is a 251 bit number in [0, prime),
      //       uin256 cannot fit into that and so are split in two 128 bit halfs
      _balanceOf = uint256ToBN(_balanceOf);
      setBalanceOf(_balanceOf.toString());
    };
    exec();
  }, [erc721Contract, address]);

  const [totalSupply, setTotalSupply] = useState();
  useEffect(() => {
    const exec = async () => {
      let _totalSupply = await callContract(erc721Contract, "totalSupply", address);
      // NOTE: Cairo native type (felt, field element) is a 251 bit number in [0, prime),
      //       uin256 cannot fit into that and so are split in two 128 bit halfs
      _totalSupply = uint256ToBN(_totalSupply);
      setTotalSupply(_totalSupply.toString());
    };
    exec();
  }, [erc721Contract, address]);

  const mintToken = async () => {
    console.log(`mint token: ${totalSupply}`);
    const transaction_response = await sendTransaction(erc721Contract, "mint", {
      to: address,
      token_id: parseInputAmountToUint256(totalSupply),
    });
    console.log(`waiting for tx ${transaction_response.transaction_hash} to be accepted`);
    await provider.waitForTransaction(transaction_response.transaction_hash);
  };

  const approveToken_0 = async data => {
    const transaction_response = await sendTransaction(erc721Contract, "approve", {
      to: address,
      token_id: parseInputAmountToUint256("0"),
    });
    console.log(`waiting for tx ${transaction_response.transaction_hash} to be accepted`);
    await provider.waitForTransaction(transaction_response.transaction_hash);
  };

  return (
    <div className="font-normal text-gray-900 dark:text-white">
      <div style={{ margin: 32 }}>
        <div>
          Connected account:{" "}
          <a target="_blank" href={`https://goerli.voyager.online/contract/${accountAddress}`} rel="noreferrer">
            {accountAddress}
          </a>
        </div>

        <br />

        <div>
          Contract address: <a href={`https://goerli.voyager.online/contract/${address}`}>{address}</a>
        </div>

        <br />

        <div>My NFT balance: {balanceOf}</div>

        <br />

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => mintToken()}
        >
          mint
        </button>

        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={() => approveToken_0()}
        >
          approve token 0
        </button>
      </div>
    </div>
  );
}

export default Home;
