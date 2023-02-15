import { useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { useAppDispatch } from "state";
import { orderBy } from "lodash";
import { Address, Team } from "config/constants/types";
import Nfts from "config/constants/nfts";
import { getWeb3NoAccount } from "utils/web3";
import { getAddress, getMasterChefAddress } from "utils/addressHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import { BIG_ZERO } from "utils/bigNumber";
import useRefresh from "hooks/useRefresh";
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsUserDataAsync,
  setBlock,
} from "./actions";
import {
  State,
  Farm,
  Pool,
  ProfileState,
  TeamsState,
  AchievementState,
  PriceState,
  FarmsState,
} from "./types";
import { fetchProfile } from "./profile";
import { fetchTeam, fetchTeams } from "./teams";
import { fetchAchievements } from "./achievements";
import { fetchPrices } from "./prices";
import { fetchWalletNfts } from "./collectibles";
import fetchReferralInfo from "./referrals/fetchReferralsInfo";
import tokens from "../config/constants/tokens";
import { fetchStatisticAsync } from "./statistics";
import { fetchVaultPublicDataAsync } from "./vaults";
import useActiveWeb3React from "hooks/useActiveWeb3React";

export const useFetchPublicData = () => {
  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    // @ts-ignore
    dispatch(fetchFarmsPublicDataAsync());
    // @ts-ignore
    dispatch(fetchVaultPublicDataAsync());
    // @ts-ignore
    // dispatch(fetchPoolsPublicDataAsync())
    // @ts-ignore
    dispatch(fetchStatisticAsync());
  }, [dispatch, slowRefresh]);

  useEffect(() => {
    const web3 = getWeb3NoAccount();
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      dispatch(setBlock(blockNumber));
    }, 6000);

    return () => clearInterval(interval);
  }, [dispatch]);
};

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms);
  return farms;
};

export const useFarmFromPid = (pid, masterAddress: Address): Farm => {
  const masterChef = getMasterChefAddress(masterAddress);
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => {
      const farmMasterAddress = getMasterChefAddress(farm.masterChefContract);

      return (
        f.pid === pid &&
        farmMasterAddress.toLowerCase() === masterChef.toLowerCase()
      );
    })
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid, masterAddress: Address) => {
  const farm = useFarmFromPid(pid, masterAddress);

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

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromSymbol(symbol);
  const tokenPriceInUsd = useGetApiPrice(getAddress(farm.token.address));
  return farm.lpTotalSupply && farm.lpTotalInQuoteToken
    ? new BigNumber(getBalanceNumber(farm.lpTotalSupply))
        .div(farm.lpTotalInQuoteToken)
        .times(tokenPriceInUsd)
        .times(2)
    : BIG_ZERO;
};

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (account) {
      // @ts-ignore
      dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const pools = useSelector((state: State) => state.pools.data);
  return pools;
};

// Profile

export const useFetchProfile = () => {
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchProfile(account));
  }, [account, dispatch]);
};

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState =
    useSelector((state: State) => state.profile);
  return {
    profile: data,
    hasProfile: isInitialized && hasRegistered,
    isInitialized,
    isLoading,
  };
};

const saveReferrer = async (account, ref) => {
  const currentReferrer = localStorage.getItem("REFERRER");
  if (!ethers.utils.isAddress(ref) || account === ref || currentReferrer) {
    return;
  }
  const referralData = await fetchReferralInfo(account);

  if (referralData.referrer === "0x0000000000000000000000000000000000000000") {
    localStorage.setItem("REFERRER", ref);
  }
};

export const useSaveReferrer = () => {
  // eslint-disable-next-line
  const search = window.location.search;
  const ref = new URLSearchParams(search).get("ref");
  // if (ref === null) {
  //   // Default ref account, used for burning
  //   ref = "0xDd7Fb652D70c12e50cd05a926a00A881732ECe13";
  // }
  const { account } = useActiveWeb3React();
  useEffect(() => {
    if (account && ref) {
      saveReferrer(account, ref);
    }
  }, [account, ref]);
};

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchTeam(id));
  }, [id, dispatch]);

  return team;
};

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector(
    (state: State) => state.teams
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchTeams());
  }, [dispatch]);

  return { teams: data, isInitialized, isLoading };
};

// Achievements

export const useFetchAchievements = () => {
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (account) {
      // @ts-ignore
      dispatch(fetchAchievements(account));
    }
  }, [account, dispatch]);
};

export const useAchievements = () => {
  const achievements: AchievementState["data"] = useSelector(
    (state: State) => state.achievements.data
  );
  return achievements;
};

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchPrices());
  }, [dispatch, slowRefresh]);
};

export const useGetApiPrices = () => {
  const prices: PriceState["data"] = useSelector(
    (state: State) => state.prices.data
  );
  return prices;
};

export const useGetApiPrice = (address: string) => {
  const prices = useGetApiPrices();
  if (!prices) {
    return null;
  }

  return prices[address.toLowerCase()];
};

export const usePriceBnbBusd = (): BigNumber => {
  const prices = useGetApiPrices();
  const address = getAddress(tokens.wbnb.address).toLowerCase();
  return prices && prices[address]
    ? new BigNumber(prices[address])
    : new BigNumber(0);
};

export const usePriceCakeBusd = (): BigNumber => {
  const prices = useGetApiPrices();
  const address = getAddress(tokens.sig.address).toLowerCase();
  return prices && prices[address]
    ? new BigNumber(prices[address])
    : new BigNumber(0);
};

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block);
};

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock);
};

// Predictions
export const useIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isHistoryPaneOpen);
};

export const useIsChartPaneOpen = () => {
  return useSelector((state: State) => state.predictions.isChartPaneOpen);
};

export const useGetRounds = () => {
  return useSelector((state: State) => state.predictions.rounds);
};

export const useGetSortedRounds = () => {
  const roundData = useGetRounds();
  return orderBy(Object.values(roundData), ["epoch"], ["asc"]);
};

export const useGetCurrentEpoch = () => {
  return useSelector((state: State) => state.predictions.currentEpoch);
};

export const useGetIntervalBlocks = () => {
  return useSelector((state: State) => state.predictions.intervalBlocks);
};

export const useGetBufferBlocks = () => {
  return useSelector((state: State) => state.predictions.bufferBlocks);
};

export const useGetTotalIntervalBlocks = () => {
  const intervalBlocks = useGetIntervalBlocks();
  const bufferBlocks = useGetBufferBlocks();
  return intervalBlocks + bufferBlocks;
};

export const useGetRound = (id: string) => {
  const rounds = useGetRounds();
  return rounds[id];
};

export const useGetCurrentRound = () => {
  const currentEpoch = useGetCurrentEpoch();
  const rounds = useGetSortedRounds();
  return rounds.find((round) => round.epoch === currentEpoch);
};

export const useGetPredictionsStatus = () => {
  return useSelector((state: State) => state.predictions.status);
};

export const useGetHistoryFilter = () => {
  return useSelector((state: State) => state.predictions.historyFilter);
};

export const useGetCurrentRoundBlockNumber = () => {
  return useSelector(
    (state: State) => state.predictions.currentRoundStartBlockNumber
  );
};

export const useGetMinBetAmount = () => {
  const minBetAmount = useSelector(
    (state: State) => state.predictions.minBetAmount
  );
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount]);
};

export const useGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.predictions.isFetchingHistory);
};

export const useGetHistory = () => {
  return useSelector((state: State) => state.predictions.history);
};

export const useGetHistoryByAccount = (account: string) => {
  const bets = useGetHistory();
  return bets ? bets[account] : [];
};

export const useGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.predictions.bets);

  if (!bets[account]) {
    return null;
  }

  if (!bets[account][roundId]) {
    return null;
  }

  return bets[account][roundId];
};

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();
  const { isInitialized, isLoading, data } = useSelector(
    (state: State) => state.collectibles
  );
  const identifiers = Object.keys(data);

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      // @ts-ignore
      dispatch(fetchWalletNfts(account));
    }
  }, [isInitialized, account, dispatch]);

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  };
};

export const useGetReferralInfo = () => {
  return useSelector((state: State) => state.referrals.data);
};
