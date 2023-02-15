import { useState, useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { NoBscProviderError } from "@becoswap-libs/kai-connector";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import { ConnectorNames, connectorLocalStorageKey } from "@bds-libs/uikit";
import { connectorsByName } from "utils/web3React";
import { setupNetwork } from "utils/wallet";
import useToast from "hooks/useToast";
import { profileClear } from "state/profile";
import { useAppDispatch } from "state";

declare global {
  interface Window {
    kardiachain: any;
    kaiAccount: any;
  }
}

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { activate, deactivate } = useWeb3React();
  const { toastError } = useToast();
  const [kaiAccount, setKaiAccount] = useState("");

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID];
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey);
          if (
            error instanceof NoEthereumProviderError ||
            error instanceof NoBscProviderError
          ) {
            toastError("Provider Error", "No provider was found");
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector;
              walletConnector.walletConnectProvider = null;
            }
            toastError(
              "Authorization Error",
              "Please authorize to access your account"
            );
          } else {
            toastError(error.name, error.message);
          }
        }
      });
    } else {
      toastError("Can't find connector", "The connector config is wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kardiaWalletEnabled = useCallback(() => {
    if (window.kardiachain) {
      (window as any).web3 = new Web3(window.kardiachain);
      if (window.kardiachain.isKaiWallet) {
        window.kardiachain.enable();
        return true;
      }
    }
    return false;
  }, []);

  const getKaiAccount = useCallback(async () => {
    if (!kardiaWalletEnabled()) {
      alert("Please install the Kardia Extension Wallet to access.");
      return undefined;
    }

    const accounts = await (window as any).web3.eth.getAccounts();
    setKaiAccount(accounts?.[0] || "");
    window.kaiAccount = accounts?.[0] || "";
    return accounts;
  }, [kardiaWalletEnabled]);

  const logout = useCallback(() => {
    dispatch(profileClear());
    deactivate();
  }, [deactivate, dispatch]);

  return { login, logout, kardiaWalletEnabled, getKaiAccount, kaiAccount };
};

export default useAuth;
