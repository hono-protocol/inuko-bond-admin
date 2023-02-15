import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import masterChefABI from "config/abi/masterchef.json";
import { farmsConfig } from "config/constants";
import { FarmConfig } from "config/constants/types";
import useRefresh from "./useRefresh";
import useActiveWeb3React from "./useActiveWeb3React";

export interface FarmWithBalance extends FarmConfig {
  balance: BigNumber;
}

const useFarmsWithBalance = () => {
  const [farmsWithBalances, setFarmsWithBalances] = useState<FarmWithBalance[]>(
    []
  );
  const { account } = useActiveWeb3React();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(farm.masterChefContract),
        name: "pendingBEP20Token",
        params: [farm.pid, account],
      }));

      const rawResults = await multicall(masterChefABI, calls);
      const results = farmsConfig.map((farm, index) => ({
        ...farm,
        balance: new BigNumber(rawResults[index]),
      }));

      setFarmsWithBalances(results);
    };

    if (account) {
      fetchBalances();
    }
  }, [account, fastRefresh]);

  return farmsWithBalances;
};

export default useFarmsWithBalance;
