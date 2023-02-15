import Metamask from "./icons/Metamask";
import WalletConnect from "./icons/WalletConnect";
import TrustWallet from "./icons/TrustWallet";
import MathWallet from "./icons/MathWallet";
import TokenPocket from "./icons/TokenPocket";
import BinanceChain from "./icons/BinanceChain";
import { Config, ConnectorNames } from "./types";

const connectors: Config[] = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: ConnectorNames.WalletConnect,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: ConnectorNames.Injected,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: ConnectorNames.Injected,
  },

  {
    title: "Binance Smart Chain",
    icon: BinanceChain,
    connectorId: ConnectorNames.BSC,
  },
];

export default connectors;
export const connectorLocalStorageKey = "connectorId";
