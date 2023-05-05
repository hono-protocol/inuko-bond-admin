import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

Moralis.start({
  apiKey: process.env.REACT_APP_KEY,
});

export const getLatestPrice = async (address: string) => {
  const chain = EvmChain.BSC;

  const response = await Moralis.EvmApi.token.getTokenPrice({
    address,
    chain,
  });

  return (response as any).jsonResponse.usdPrice;
};
