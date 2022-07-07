import React, { Fragment, useCallback, useEffect, useState } from "react";

import { useExchangeEthPrice } from "eth-hooks/dapps/dex";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  HomeIcon,
  MenuAlt2Icon,
  XIcon,
  CodeIcon,
  TemplateIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  ShareIcon,
} from "@heroicons/react/outline";

import {
  useBalance,
  useContractLoader,
  useContractReader,
  useGasPrice,
  useOnBlock,
  useUserProviderAndSigner,
} from "eth-hooks";

import { StarknetProvider, InjectedConnector } from "@starknet-react/core";
import { Provider } from "starknet";

import "antd/dist/antd.css";
import "graphiql/graphiql.min.css";
import "./App.css";

import {
  Account,
  Contract,
  Faucet,
  GasGauge,
  Header,
  Ramp,
  ThemeSwitch,
  NetworkDisplay,
  FaucetHint,
  NetworkSwitch,
} from "./components";
import { NETWORKS, ALCHEMY_KEY } from "./constants";
// contracts
import deployedStarknetContracts from "./contracts/hardhat_starknet_contracts";
import externalContracts from "./contracts/external_contracts";
import deployedContracts from "./contracts/hardhat_contracts.json";

import { Transactor, Web3ModalSetup, classNames } from "./helpers";
import { Home, ExampleUI, Hints, Subgraph } from "./views";
import { useStaticJsonRPC } from "./hooks";

const { ethers } = require("ethers");

// 📡 What chain are your contracts deployed to?
const initialNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = false;
const NETWORKCHECK = true;
const USE_BURNER_WALLET = false; // toggle burner wallet feature
const USE_NETWORK_SELECTOR = false;

const web3Modal = Web3ModalSetup();

// 🛰 providers
const providers = [
  //"https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
  //`https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
];

function App(props) {
  // specify all the chains your app is available on. Eg: ['localhost', 'mainnet', ...otherNetworks ]
  // reference './constants.js' for other networks
  const networkOptions = [initialNetwork.name, "mainnet", "starknet", "rinkeby", "goerli"];

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[0]);
  const location = useLocation();

  const targetNetwork = NETWORKS[selectedNetwork];

  // 🔭 block explorer URL
  const blockExplorer = targetNetwork.blockExplorer;

  // load all your providers
  const localProvider = useStaticJsonRPC([
    process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : targetNetwork.rpcUrl,
  ]);
  const mainnetProvider = useStaticJsonRPC(providers);

  if (DEBUG) console.log(`Using ${selectedNetwork} network`);

  // 🛰 providers
  if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider();
    if (injectedProvider && injectedProvider.provider && typeof injectedProvider.provider.disconnect == "function") {
      await injectedProvider.provider.disconnect();
    }
    setTimeout(() => {
      window.location.reload();
    }, 1);
  };

  // use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.signer;

  useEffect(() => {
    async function getAddress() {
      if (userSigner) {
        const newAddress = await userSigner.getAddress();
        setAddress(newAddress);
      }
    }
    getAddress();
  }, [userSigner]);

  // You can warn the user if you would like them to be on a specific network
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  const selectedChainId =
    userSigner && userSigner.provider && userSigner.provider._network && userSigner.provider._network.chainId;

  // For more hooks, check out 🔗eth-hooks at: https://www.npmjs.com/package/eth-hooks

  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(userSigner, gasPrice);

  const yourLocalBalance = useBalance(localProvider, address);

  const yourMainnetBalance = useBalance(mainnetProvider, address);

  /* 💵 This hook will get the price of ETH from 🦄 Uniswap: */
  const price = useExchangeEthPrice(targetNetwork, mainnetProvider);

  // const contractConfig = useContractConfig();

  const contractConfig = {
    deployedContracts: deployedStarknetContracts || {},
    externalContracts: externalContracts || {},
  };

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(localProvider, contractConfig);

  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);

  // EXTERNAL CONTRACT EXAMPLE:
  //
  // If you want to bring in the mainnet DAI contract it would look like:
  const mainnetContracts = useContractLoader(mainnetProvider, contractConfig);

  // Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, "DAI", "balanceOf", [
    "0x34aA3F359A9D614239015126635CE7732c18fDF3",
  ]);

  // keep track of a variable from the contract in the local React state:
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  // 👨‍💻 debug 👨‍💻
  useEffect(() => {
    if (DEBUG && mainnetProvider && address && selectedChainId && readContracts && writeContracts && mainnetContracts) {
      console.log("_____________________________________ 👨‍💻 debug _____________________________________");
      console.log("🌎 mainnetProvider", mainnetProvider);
      console.log("🏠 localChainId", localChainId);
      console.log("👩‍💼 selected address:", address);
      console.log("🕵🏻‍♂️ selectedChainId:", selectedChainId);
      console.log("📝 readContracts", readContracts);
      console.log("🔐 writeContracts", writeContracts);
    }
  }, [mainnetProvider, address, selectedChainId, readContracts, writeContracts, mainnetContracts, localChainId]);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
    // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const faucetAvailable = localProvider && localProvider.connection && targetNetwork.name.indexOf("local") !== -1;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "ERC721 Contract", href: "/erc721-contract", icon: CodeIcon },
    { name: "Debug Contracts", href: "/debug", icon: CodeIcon },
    { name: "Hints", href: "/hints", icon: SparklesIcon },
    { name: "ExampleUI", href: "/exampleui", icon: TemplateIcon },
    { name: "Subgraph", href: "/subgraph", icon: ShareIcon },
  ];

  const connectors = [new InjectedConnector({ showModal: true })];

  return (
    <>
      {/* https://github.com/apibara/starknet-react#getting-started */}
      <StarknetProvider connectors={connectors}>
        <div>
          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
              </Transition.Child>
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:focus:ring-gray-900"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-6 w-6 text-white dark:text-gray-900" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-shrink-0 flex items-center px-4">
                    <Header />
                  </div>
                  <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 space-y-1">
                      {navigation.map(item => {
                        const current = location.pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              current
                                ? "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                              "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                                "mr-4 flex-shrink-0 h-6 w-6",
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="flex-shrink-0 flex p-4">
                    <ThemeSwitch />
                  </div>
                </div>
              </Transition.Child>
              <div className="flex-shrink-0 w-14" aria-hidden="true">
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-700 pt-5 bg-white dark:bg-gray-800 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Header />
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {navigation.map(item => {
                    const current = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          current
                            ? "bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        )}
                      >
                        <item.icon
                          className={classNames(
                            current ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-6 w-6",
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex-shrink-0 flex p-4">
                <ThemeSwitch />
              </div>
            </div>
          </div>
          <div className="md:pl-64 flex flex-col flex-1">
            <div className="flex flex-col grow flex-1" style={{ overflowWrap: "break-word" }}>
              {/* top nav */}
              <div className="sticky top-0 z-10 flex flex-shrink-0 h-16 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
                <button
                  type="button"
                  className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="flex-1 px-4 flex flex-row justify-end">
                  {USE_NETWORK_SELECTOR && (
                    <NetworkSwitch
                      networkOptions={networkOptions}
                      selectedNetwork={selectedNetwork}
                      setSelectedNetwork={setSelectedNetwork}
                    />
                  )}
                  <Account
                    useBurner={USE_BURNER_WALLET}
                    address={address}
                    localProvider={localProvider}
                    userSigner={userSigner}
                    mainnetProvider={mainnetProvider}
                    price={price}
                    web3Modal={web3Modal}
                    loadWeb3Modal={loadWeb3Modal}
                    logoutOfWeb3Modal={logoutOfWeb3Modal}
                    blockExplorer={blockExplorer}
                  />
                </div>
              </div>
              {/* Page content */}
              <div className="grow flex-1 bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                  <Routes>
                    <Route path="/" element={<Home contractConfig={contractConfig} readContracts={readContracts} />} />
                    <Route
                      path="/erc721-contract"
                      element={
                        <Contract
                          name="ERC721"
                          price={price}
                          signer={userSigner}
                          provider={localProvider}
                          address={address}
                          blockExplorer={blockExplorer}
                          contractConfig={contractConfig}
                        />
                      }
                    />

                    <Route
                      path="/debug"
                      element={
                        <>
                          <Contract
                            name="Account"
                            price={price}
                            signer={userSigner}
                            provider={localProvider}
                            address={address}
                            blockExplorer={blockExplorer}
                            contractConfig={contractConfig}
                          />
                          <Contract
                            name="ERC721"
                            price={price}
                            signer={userSigner}
                            provider={localProvider}
                            address={address}
                            blockExplorer={blockExplorer}
                            contractConfig={contractConfig}
                          />
                        </>
                      }
                    />

                    <Route
                      path="/hints"
                      element={
                        <Hints
                          address={address}
                          yourLocalBalance={yourLocalBalance}
                          mainnetProvider={mainnetProvider}
                          price={price}
                        />
                      }
                    />

                    <Route
                      path="/exampleui"
                      element={
                        <ExampleUI
                          address={address}
                          userSigner={userSigner}
                          mainnetProvider={mainnetProvider}
                          localProvider={localProvider}
                          yourLocalBalance={yourLocalBalance}
                          price={price}
                          tx={tx}
                          writeContracts={writeContracts}
                          readContracts={readContracts}
                          purpose={purpose}
                        />
                      }
                    />

                    <Route
                      path="/subgraph"
                      element={
                        <Subgraph
                          subgraphUri={props.subgraphUri}
                          tx={tx}
                          writeContracts={writeContracts}
                          mainnetProvider={mainnetProvider}
                        />
                      }
                    />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Global notification live region, render this permanently at the end of the document */}
        <div aria-live="assertive" className="fixed inset-0 flex items-start px-4 pt-20 pb-6 pointer-events-none">
          <div className="w-full flex flex-col items-end space-y-4">
            {/* Alert if wrong network is selected */}
            <NetworkDisplay
              NETWORKCHECK={NETWORKCHECK}
              localChainId={localChainId}
              selectedChainId={selectedChainId}
              targetNetwork={targetNetwork}
            />
          </div>
        </div>
      </StarknetProvider>
    </>
  );
}

export default App;
