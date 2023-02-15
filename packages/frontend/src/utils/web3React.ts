import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { KaiConnector } from "@becoswap-libs/kai-connector";
import { BscConnector } from "@binance-chain/bsc-connector";
import { ConnectorNames } from "@bds-libs/uikit";
import { ethers } from "ethers";
import getNodeUrl from "./getRpcUrl";

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);
const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();

const injected = new InjectedConnector({ supportedChainIds: [chainId] });

const kaiConnector = new KaiConnector({ supportedChainIds: [chainId] });

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: "https://pancakeswap.bridge.walletconnect.org/",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});
const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.KAI]: kaiConnector,
  [ConnectorNames.WalletConnect]: walletconnect,
};

export const getLibrary = (provider): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};
