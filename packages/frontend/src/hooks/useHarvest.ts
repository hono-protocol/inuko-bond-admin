import { useCallback } from "react";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/actions";
import { harvest } from "utils/callHelpers";
import { useMasterchef } from "./useContract";
import { Address } from "../config/constants/types";
import { useFarms } from "../state/hooks";
import masterChef from "../config/abi/masterchef.json";
import { getMasterChefAddress } from "../utils/addressHelpers";
import { getContract } from "../utils/contractHelpers";
import { getFarmFromPidMasterChef } from "../utils/farmHelpers";
import useActiveWeb3React from "./useActiveWeb3React";
import { getProviderOrSigner } from "../utils";

export const useHarvest = (farmPid: number, master: Address) => {
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();

  const farms = useFarms();

  const { farm } = getFarmFromPidMasterChef(farms.data, farmPid, master);

  const masterChefContract = useMasterchef(farm.masterChefContract);

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account);
    // @ts-ignore
    dispatch(fetchFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useAllHarvest = (farmPids: number[]) => {
  const { library, account } = useActiveWeb3React();

  const farms = useFarms();

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      const farm = farms.data.find((f) => f.pid === pid);
      if (farm) {
        const contract = getContract(
          masterChef,
          getMasterChefAddress(farm.masterChefContract),
          getProviderOrSigner(library, account)
        );
        return [...accum, harvest(contract, pid, account)];
      }
      return accum;
    }, []);

    return Promise.all(harvestPromises);
  }, [account, farmPids, farms]);

  return { onReward: handleHarvest };
};
