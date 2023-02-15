import { useEffect, useState } from "react";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import masterChefABI from "config/abi/masterchef.json";
import { farmsConfig } from "config/constants";
import useRefresh from "./useRefresh";
import useActiveWeb3React from "./useActiveWeb3React";

const useAllEarnings = () => {
  const [balances, setBalance] = useState([]);
  const { account } = useActiveWeb3React();
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(farm.masterChefContract),
        name: "pendingBEP20Token",
        params: [farm.pid, account],
      }));

      const res = await multicall(masterChefABI, calls);

      setBalance(res);
    };

    if (account) {
      fetchAllBalances();
    }
  }, [account, fastRefresh]);

  return balances;
};

export default useAllEarnings;
