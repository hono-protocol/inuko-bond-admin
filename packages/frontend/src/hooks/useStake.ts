import { useCallback } from "react";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/actions";
import { stake } from "utils/callHelpers";
import { useMasterchef } from "./useContract";
import useToast from "./useToast";
import { Address } from "../config/constants/types";
import { useFarms } from "../state/hooks";
import { getFarmFromPidMasterChef } from "../utils/farmHelpers";
import useActiveWeb3React from "./useActiveWeb3React";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export function getReferrer() {
  const ref = localStorage.getItem("REFERRER");
  if (ref) {
    return ref;
  }
  return EMPTY_ADDRESS;
}

const useStake = (pid: number, master: Address) => {
  const dispatch = useAppDispatch();

  const { account } = useActiveWeb3React();

  const farms = useFarms();

  const { farm } = getFarmFromPidMasterChef(farms.data, pid, master);

  const masterChefContract = useMasterchef(farm.masterChefContract);

  const { toastError } = useToast();

  const handleStake = useCallback(
    async (amount: string, decimals?: number) => {
      try {
        const referrer = getReferrer();
        const txHash = await stake(
          masterChefContract,
          pid,
          amount,
          account,
          referrer,
          decimals
        );
        // @ts-ignore
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
        if (referrer !== EMPTY_ADDRESS) {
          localStorage.removeItem("REFERRER");
        }
      } catch (e) {
        toastError("Failed stake", "");
        console.error(e);
      }
    },
    [account, dispatch, masterChefContract, pid]
  );

  return { onStake: handleStake };
};

export default useStake;
