import React, { useMemo, useState } from "react";
import { useContractExistsAtAddress, useContractLoader } from "eth-hooks";
import { StarknetProvider, InjectedConnector } from "@starknet-react/core";
import { Contract } from "starknet";

import Address from "../Address";
import Balance from "../Balance";
import DisplayVariable from "./DisplayVariable";
import FunctionForm from "./FunctionForm";

const noContractDisplay = (
  <div>
    Loading...{" "}
    <div style={{ padding: 32 }}>
      You need to run{" "}
      <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run chain
      </span>{" "}
      and{" "}
      <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      to see your contract here.
    </div>
    <div style={{ padding: 32 }}>
      <span style={{ marginRight: 4 }} role="img" aria-label="warning">
        ☢️
      </span>
      Warning: You might need to run
      <span className="highlight" style={{ marginLeft: 4, padding: 4, borderRadius: 4, fontWeight: "bolder" }}>
        yarn run deploy
      </span>{" "}
      <i>again</i> after the frontend comes up!
    </div>
  </div>
);

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function MyContract({
  account,
  gasPrice,
  signer,
  provider,
  name,
  show,
  price,
  blockExplorer,
  chainId = "1536727068981429685321", // TODO:
  contractConfig,
}) {
  const [refreshRequired, triggerRefresh] = useState(false);

  const { deployedContracts = {}, externalContracts = {} } = contractConfig || {};
  const starknetContract = deployedContracts[chainId].starknetGoerli.contracts[name];

  if (!deployedContracts[chainId].starknetGoerli.contracts[name]) {
    return <div>Could not find contract. Are you sure you have deployed it?</div>;
  }

  const starknetContracts = {};
  starknetContracts[name] = new Contract(starknetContract.abi, starknetContract.address, account);
  console.log({ starknetContracts });
  const contract = starknetContracts[name];

  const contractFunctions = contract.functions;

  const address = contract ? contract.address : "";
  // TODO: check if contract is deployed
  //const contractIsDeployed = useContractExistsAtAddress(provider, address);
  const contractIsDeployed = deployedContracts[chainId]?.starknetGoerli?.contracts[name];

  const contractDisplay = contract.abi.map(contractFuncInfo => {
    if (contractFuncInfo.type === "function") {
      const contractFunction =
        contractFuncInfo.stateMutability === "view" ? contract[contractFuncInfo.name] : contract[contractFuncInfo.name]; // TODO: redundant
      //contract.connect(signer)[contractFuncInfo[0]]; // TODO: use contract.populateTransaction ?

      // const contractFunc = contract.connect(signer)[contractFuncInfo[0]];
      if (isQueryable(contractFuncInfo)) {
        // if there are no inputs, just display return value
        return (
          <DisplayVariable
            key={contractFuncInfo.name}
            contractFunction={contractFunction}
            functionInfo={contractFuncInfo}
            refreshRequired={refreshRequired}
            triggerRefresh={triggerRefresh}
            blockExplorer={blockExplorer}
          />
        );
      }

      // if there are inputs, display a form to allow users to provide these
      return (
        <FunctionForm
          key={`FF${contractFuncInfo.name}`}
          contract={contract}
          contractFunctionName={contractFuncInfo.name}
          //
          contractFunction={contractFunction}
          functionInfo={contractFuncInfo}
          provider={provider}
          gasPrice={gasPrice}
          triggerRefresh={triggerRefresh}
        />
      );
    }
    return null;
  });

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <div className="text-gray-900 dark:text-white">
        <div className="flex justify-around py-5">
          <div className="flex text-lg">{name}</div>
          <Address value={address} size="long" />
          <Balance address={address} provider={provider} price={price} />
        </div>
        <div style={{ float: "right", width: "100%" }}>{contractIsDeployed ? contractDisplay : noContractDisplay}</div>
      </div>
    </div>
  );
}
