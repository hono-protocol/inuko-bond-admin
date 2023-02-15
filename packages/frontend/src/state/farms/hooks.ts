import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { getBalanceAmount } from "utils/formatBalance";
import { farmsConfig } from "config/constants";
import useRefresh from "hooks/useRefresh";
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from ".";
import { State, Farm, FarmsState } from "../types";
import { useGetApiPrices } from "../hooks";
import { getAddress } from "../../utils/addressHelpers";
import tokens from "../../config/constants/tokens";
import useActiveWeb3React from "hooks/useActiveWeb3React";

export const usePollFarmsData = (includeArchive = false) => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  const { account } = useActiveWeb3React();
  const prices = useGetApiPrices();
  useEffect(() => {
    const bnbPrice =
      prices?.[getAddress(tokens.wbnb.address).toLowerCase()] || 0;
    const farmsToFetch = farmsConfig;
    const pids = farmsToFetch.map((farmToFetch) => farmToFetch.pid);
    // @ts-ignore
    dispatch(fetchFarmsPublicDataAsync(bnbPrice));

    if (account) {
      // @ts-ignore
      dispatch(fetchFarmUserDataAsync(account));
    }
  }, [includeArchive, dispatch, slowRefresh, account, prices]);
};

/**
 * Fetches the "core" farm data used globally
 * 251 = CAKE-BNB LP
 * 252 = BUSD-BNB LP
 */
// export const usePollCoreFarmData = () => {
//   const dispatch = useAppDispatch();
//   const { fastRefresh } = useRefresh();
//
//   useEffect(() => {
//     dispatch(fetchFarmsPublicDataAsync([251, 252]));
//   }, [dispatch, fastRefresh]);
// };

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : BIG_ZERO,
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : BIG_ZERO,
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  };
};

// Return the base token price for a farm, from a given pid
export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid);
  return farm && new BigNumber(farm.token.busdPrice);
};

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol);
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid);
  let lpTokenPrice = BIG_ZERO;

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmount);
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2);
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(new BigNumber(farm.lpTotalSupply));
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens);
  }

  return lpTokenPrice;
};
