import { useCallback } from "react";
import { ethers, Contract } from "ethers";
import { useAppDispatch } from "state";
import { fetchFarmUserDataAsync } from "state/actions";
import { Address } from "../config/constants/types";
import useActiveWeb3React from "./useActiveWeb3React";
import { getMasterChefAddress } from "../utils/addressHelpers";
import { fetchVaultUserDataAsync } from "../state/vaults";
import useToast from "./useToast";

export const useApprove = (
  lpContract: Contract,
  masterChefAddress: Address
) => {
  const dispatch = useAppDispatch();
  const { toastError } = useToast();
  const { account } = useActiveWeb3React();
  const handleApprove = useCallback(async () => {
    try {
      const tx = await lpContract.approve(
        getMasterChefAddress(masterChefAddress),
        ethers.constants.MaxUint256
      );
      const receipt = await tx.wait();
      // @ts-ignore
      dispatch(fetchFarmUserDataAsync(account));
      // @ts-ignore
      dispatch(fetchVaultUserDataAsync(account));
      return receipt.status;
    } catch (e) {
      console.log(e);
      // @ts-ignore
      toastError("Error!", e.message);
      return false;
    }
  }, [account, dispatch, lpContract, masterChefAddress]);

  return { onApprove: handleApprove };
};
