import { useContext, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { getBep20Contract, getCakeContract } from "utils/contractHelpers";
import { BIG_ZERO } from "utils/bigNumber";
import { simpleRpcProvider } from "utils/providers";
import useRefresh from "./useRefresh";
import useLastUpdated from "./useLastUpdated";
import useActiveWeb3React from "./useActiveWeb3React";
import { BnbContext } from "contexts/BnbContext";
import { Token, TokenAmount } from "@pancakeswap/sdk";
import { useTokenContract } from "./useContract";
import { NEVER_RELOAD, useSingleCallResult } from "state/multicall/hooks";

type UseTokenBalanceState = {
  balance: BigNumber;
  fetchStatus: FetchStatus;
};

export enum FetchStatus {
  NOT_FETCHED = "not-fetched",
  SUCCESS = "success",
  FAILED = "failed",
}

export const useBalance = (token: Token, params?: string[], reload = false) => {
  const contract = useTokenContract(token?.address, true);

  const totalSupply: BigNumber = useSingleCallResult(contract, 'balanceOf', params, !reload ? NEVER_RELOAD : undefined)
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
}

const useTokenBalance = (tokenAddress: string) => {
  const { NOT_FETCHED, SUCCESS, FAILED } = FetchStatus;
  const [balanceState, setBalanceState] = useState<UseTokenBalanceState>({
    balance: BIG_ZERO,
    fetchStatus: NOT_FETCHED,
  });
  const { account } = useActiveWeb3React();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress);
      try {
        const res = await contract.balanceOf(account);
        setBalanceState({
          balance: new BigNumber(res.toString()),
          fetchStatus: SUCCESS,
        });
      } catch (e) {
        console.error(e);
        setBalanceState((prev) => ({
          ...prev,
          fetchStatus: FAILED,
        }));
      }
    };

    if (account) {
      fetchBalance();
    }
  }, [account, tokenAddress, fastRefresh, SUCCESS, FAILED]);

  return balanceState;
};

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract();
      const supply = await cakeContract.totalSupply();
      setTotalSupply(new BigNumber(supply.toString()));
    }

    fetchTotalSupply();
  }, [slowRefresh]);

  return totalSupply;
};

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO);
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress);
      const res = await contract.balanceOf(
        "0x000000000000000000000000000000000000dEaD"
      );
      setBalance(new BigNumber(res.toString()));
    };

    fetchBalance();
  }, [tokenAddress, slowRefresh]);

  return balance;
};

export const useGetBnbBalance = () => {
  const {
    balance,
    fetchStatus,
    refresh: setLastUpdated,
  } = useContext(BnbContext);
  return { balance, fetchStatus, refresh: setLastUpdated };
};

export default useTokenBalance;
