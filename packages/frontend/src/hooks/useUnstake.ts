import { useCallback } from "react";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/actions";
import { unstake } from "utils/callHelpers";
import { useMasterchef } from "./useContract";
import useToast from "./useToast";
import { Address } from "../config/constants/types";
import { useFarms } from "../state/hooks";
import { getFarmFromPidMasterChef } from "../utils/farmHelpers";
import useActiveWeb3React from "./useActiveWeb3React";

const useUnstake = (pid: number, master: Address) => {
  const dispatch = useAppDispatch();
  const { account } = useActiveWeb3React();

  const farms = useFarms();

  const { farm } = getFarmFromPidMasterChef(farms.data, pid, master);

  const masterChefContract = useMasterchef(farm.masterChefContract);

  const { toastError } = useToast();

  const handleUnstake = useCallback(
    async (amount: string, decimals?: number) => {
      try {
        const txHash = await unstake(
          masterChefContract,
          pid,
          amount,
          account,
          decimals
        );
        // @ts-ignore
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
      } catch (e) {
        toastError("Failed unstake", "");
        console.error(e);
      }
    },
    [account, dispatch, masterChefContract, pid]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
