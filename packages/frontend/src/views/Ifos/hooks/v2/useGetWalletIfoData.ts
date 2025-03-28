import { useEffect, useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import { Ifo, PoolIds } from "config/constants/types";
import { useERC20, useIfoV2Contract } from "hooks/useContract";
import useRefresh from "hooks/useRefresh";
import { multicallv2 } from "utils/multicall";
import ifoV2Abi from "config/abi/ifoV2.json";
import { getAddress } from "utils/addressHelpers";
import { BIG_ZERO } from "utils/bigNumber";
import useIfoAllowance from "../useIfoAllowance";
import { WalletIfoState, WalletIfoData } from "../../types";
import useActiveWeb3React from "hooks/useActiveWeb3React";

/**
 * Gets all data from an IFO related to a wallet
 */
const useGetWalletIfoData = (ifo: Ifo): WalletIfoData => {
  const { fastRefresh } = useRefresh();
  const [state, setState] = useState<WalletIfoState>({
    poolBasic: {
      amountTokenCommittedInLP: BIG_ZERO,
      offeringAmountInToken: BIG_ZERO,
      refundingAmountInLP: BIG_ZERO,
      taxAmountInLP: BIG_ZERO,
      hasClaimed: false,
      isPendingTx: false,
    },
    poolUnlimited: {
      amountTokenCommittedInLP: BIG_ZERO,
      offeringAmountInToken: BIG_ZERO,
      refundingAmountInLP: BIG_ZERO,
      taxAmountInLP: BIG_ZERO,
      hasClaimed: false,
      isPendingTx: false,
    },
  });

  const { address, currency } = ifo;

  const { account } = useActiveWeb3React();
  const contract = useIfoV2Contract(address);
  const currencyContract = useERC20(getAddress(currency.address));
  const allowance = useIfoAllowance(currencyContract, address);

  const setPendingTx = (status: boolean, poolId: PoolIds) =>
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        isPendingTx: status,
      },
    }));

  const setIsClaimed = (poolId: PoolIds) => {
    setState((prevState) => ({
      ...prevState,
      [poolId]: {
        ...prevState[poolId],
        hasClaimed: true,
      },
    }));
  };

  const fetchIfoData = useCallback(async () => {
    const ifoCalls = [
      "viewUserInfo",
      "viewUserOfferingAndRefundingAmountsForPools",
    ].map((method) => ({
      address,
      name: method,
      params: [account, [0, 1]],
    }));

    const [userInfo, amounts] = await multicallv2(ifoV2Abi, ifoCalls);

    setState((prevState) => ({
      ...prevState,
      poolBasic: {
        ...prevState.poolBasic,
        amountTokenCommittedInLP: new BigNumber(userInfo[0][0].toString()),
        offeringAmountInToken: new BigNumber(amounts[0][0][0].toString()),
        refundingAmountInLP: new BigNumber(amounts[0][0][1].toString()),
        taxAmountInLP: new BigNumber(amounts[0][0][2].toString()),
        hasClaimed: userInfo[1][0],
      },
      poolUnlimited: {
        ...prevState.poolUnlimited,
        amountTokenCommittedInLP: new BigNumber(userInfo[0][1].toString()),
        offeringAmountInToken: new BigNumber(amounts[0][1][0].toString()),
        refundingAmountInLP: new BigNumber(amounts[0][1][1].toString()),
        taxAmountInLP: new BigNumber(amounts[0][1][2].toString()),
        hasClaimed: userInfo[1][1],
      },
    }));
  }, [account, address]);

  useEffect(() => {
    if (account) {
      fetchIfoData();
    }
  }, [account, fetchIfoData, fastRefresh]);

  return {
    ...state,
    allowance,
    contract,
    setPendingTx,
    setIsClaimed,
    fetchIfoData,
  };
};

export default useGetWalletIfoData;
