import { ethers } from "ethers";
import getRpcUrl from "utils/getRpcUrl";
import HDWalletProvider from "@truffle/hdwallet-provider";

const RPC_URL = getRpcUrl();

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

export const generateHDWalletProvider = (pk) => {
  return (
    pk &&
    new HDWalletProvider({
      privateKeys: [pk],
      providerOrUrl: process.env.REACT_APP_NODE_1,
    })
  );
};

export default null;
