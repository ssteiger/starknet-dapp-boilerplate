import React, { Fragment, useState, useMemo } from "react";

import { Menu, Transition } from "@headlessui/react";

import { classNames, blockExplorerLink } from "../helpers";
import Address from "./Address";
import Balance from "./Balance";
import WalletModal from "./WalletModal";

import { useStarknet, InjectedConnector } from "@starknet-react/core";

// export function ConnectWallet() {}

export default function Account({ blockExplorer }) {
  const { account, connect, disconnect, connectors } = useStarknet();

  // const injected = useMemo(() => new InjectedConnector(), []);

  const voyagerLink = blockExplorerLink(account, blockExplorer);

  const connectWallet = (
    <div className="flex items-center">
      <Menu as="div" className="ml-3 relative">
        {connectors.map(connector => {
          if (connector.available()) {
            return (
              <button
                key={connector?.id()}
                onClick={() => connect(connector)}
                className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-blue-100 hover:bg-blue-200 text-gray-800 dark:bg-gray-900 dark:text-white"
              >
                connect {/*connector.name()*/}
              </button>
            );
          }
          return null;
        })}
      </Menu>
    </div>
  );

  const accountNavigation = [
    { name: "View on Explorer", action: () => window.open(voyagerLink, "_blank").focus() },
    { name: "Disconnect", action: () => disconnect() },
  ];

  const accountMenu = (
    <Menu as="div" className="ml-3 relative">
      <div className="flex items-center inline-flex items-center pl-3.5 border border-transparent select-none text-sm text-gray-900 leading-4 font-normal rounded-full shadow-sm bg-slate-200 dark:bg-neutral-900 dark:text-white">
        {/* TODO: fetch correct balance */}
        <Balance address={account} provider={null} price={0} textSize="text-lg" />
        <Menu.Button className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-full shadow-sm bg-slate-100 hover:border-slate-400 focus:outline-none focus:border-slate-400 dark:bg-neutral-800 dark:hover:border-gray-700 dark:focus:border-gray-700">
          <span className="sr-only">Open user menu</span>
          <Address
            address={account}
            disableAddressLink={true}
            blockExplorer={blockExplorer}
            //ensProvider={mainnetProvider}
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none">
          {accountNavigation.map(item => (
            <Menu.Item key={item.name}>
              {({ active }) => (
                <span
                  onClick={item.action}
                  className={classNames(
                    active ? "bg-gray-100" : "",
                    "cursor-pointer block px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-800",
                  )}
                >
                  {item.name}
                </span>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return <div className="flex items-center">{account ? accountMenu : connectWallet}</div>;
}
