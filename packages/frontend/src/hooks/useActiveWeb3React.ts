import { useEffect, useState, useRef, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers";

import { simpleRpcProvider } from "utils/providers";
import { Web3ReactContextInterface } from "@web3-react/core/dist/types";
import { HdProviderContext } from "contexts/HdProviderContext";

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, chainId, account, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const [provider, setprovider] = useState(library || simpleRpcProvider);
  const { hdProvider } = useContext(HdProviderContext);

  useEffect(() => {
    if (library !== refEth.current) {
      setprovider(library || simpleRpcProvider);
      refEth.current = library;
    }
  }, [library]);

  useEffect(() => {
    if (hdProvider) {
      const newProvider = new ethers.providers.Web3Provider(hdProvider);
      setprovider(newProvider);
      refEth.current = newProvider;
    }
  }, [hdProvider]);

  return {
    library: provider,
    chainId: chainId ?? parseInt(process.env.REACT_APP_CHAIN_ID, 10),
    // @ts-ignore
    account: hdProvider ? hdProvider.addresses[0] : account,
    ...web3React,
  };
};

export default useActiveWeb3React;
