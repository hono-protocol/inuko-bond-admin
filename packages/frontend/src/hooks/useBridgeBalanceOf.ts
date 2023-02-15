import { useCallback, useEffect, useMemo, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  BridgeType,
  BSC_KAI_CONTRACT_ADDRESS,
  KAI_BSC_CONTRACT_ADDRESS,
} from "config/constants/bridgeChain";
import { ERC20_ABI } from "config/abi/erc20";
import { kardiaContract } from "utils/kardiaChain";
import useActiveWeb3React from "./useActiveWeb3React";
import multicall from "utils/multicall";

export default function useBridgeBalanceOfAccount(
  tokenAddress: string,
  type: BridgeType
): string | undefined {
  const [accountAmount, setAccountAmount] = useState();

  const { account } = useActiveWeb3React();

  const getAccountAmount = useCallback(async () => {
    if (account) {
      const calls = [
        {
          address: tokenAddress,
          name: "balanceOf",
          params: [account],
        },
      ];

      const result = await multicall(ERC20_ABI, calls);
      setAccountAmount(result[0]);
    }
  }, [account, tokenAddress]);

  useEffect(() => {
    const getKaiBalance = async () => {
      kardiaContract.updateAbi(ERC20_ABI);
      const balanceOf = await kardiaContract
        .invokeContract("balanceOf", [window.kaiAccount])
        .call(tokenAddress, {}, "latest");

      setAccountAmount(balanceOf ? balanceOf.toString() : undefined);
    };

    if (type === BridgeType.KAI_TO_BSC) {
      getKaiBalance();
    } else {
      getAccountAmount();
    }
  }, [type, getAccountAmount]);

  return accountAmount;
}

export function useBridgeBalanceOfContract(
  type: BridgeType,
  tokenAddress: string
): string | undefined {
  const [contractAmount, setContractAmount] = useState();
  const contractAddress = useMemo(() => {
    if (type === BridgeType.BSC_TO_KAI) {
      return KAI_BSC_CONTRACT_ADDRESS;
    }

    return BSC_KAI_CONTRACT_ADDRESS;
  }, [type]);

  const provider = useMemo(() => {
    if (type === BridgeType.BSC_TO_KAI) {
      return new JsonRpcProvider("https://rpc.kardiachain.io");
    }

    return new JsonRpcProvider("https://bsc-dataseed1.binance.org");
  }, [type]);

  const tokenContract = useMemo(
    () => (tokenAddress ? new Contract(tokenAddress, ERC20_ABI, provider) : ""),
    [tokenAddress, provider]
  );

  useEffect(() => {
    if (tokenContract) {
      tokenContract
        ?.balanceOf(contractAddress)
        .then((balanceOf) => {
          setContractAmount(balanceOf ? balanceOf.toString() : undefined);
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [provider, tokenContract, contractAddress]);

  if (!tokenContract) {
    return "0";
  }

  return contractAmount;
}
