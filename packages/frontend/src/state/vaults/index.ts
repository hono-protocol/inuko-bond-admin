import { FarmConfig, VaultConfig } from "../../config/constants/types";
import { vaultConfig } from "../../config/constants/vaults";
import { createSlice } from "@reduxjs/toolkit";
import { getAddress, getMasterChefAddress } from "../../utils/addressHelpers";
import multicall from "../../utils/multicall";
import VaultABI from "../../config/abi/vault.json";
import strategyABI from "../../config/abi/strategy.json";
import erc20ABI from "../../config/abi/erc20.json";
import BigNumber from "bignumber.js";
import masterchefABI from "../../config/abi/masterchef.json";
import { BIG_TEN } from "../../utils/bigNumber";
import erc20 from "../../config/abi/erc20.json";
import { Farm } from "../types";

export interface Vault extends VaultConfig {
  pricePerFullShare?: string;
  tvl?: string;
  poolWeight?: string;
  perBlock?: string;
  lpTotalInQuoteToken?: string;
  userData: {
    allowance: string;
    sharesBalance: string;
    tokenBalance: string;
  };
}

export interface VaultsState {
  data: Vault[];
  userDataLoaded: boolean;
}

const noAccountVaultConfig = vaultConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: "0",
    sharesBalance: "0",
    tokenBalance: "0",
  },
}));

const initialState: VaultsState = {
  data: noAccountVaultConfig,
  userDataLoaded: false,
};

export const vaultsSlice = createSlice({
  name: "Vaults",
  initialState,
  reducers: {
    setVaultsPublicData: (state, action) => {
      const liveFarmsData: Vault[] = action.payload;
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.id === farm.id);
        return {
          ...farm,
          ...liveFarmData,
          userData: {
            ...liveFarmData.userData,
            ...farm.userData,
          },
        };
      });
    },
    setVaultUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl, index) => {
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
      state.userDataLoaded = true;
    },
  },
});

export const { setVaultsPublicData, setVaultUserData } = vaultsSlice.actions;

async function fetchFarmVaults(farms: VaultConfig[]): Promise<Vault[]> {
  return await Promise.all(
    farms.map(async (f) => {
      const vaultAddress = getAddress(f.vaultAddress);
      const calls = [
        {
          address: vaultAddress,
          name: "getPricePerFullShare",
        },
        {
          address: vaultAddress,
          name: "balance",
        },
        {
          address: vaultAddress,
          name: "strategy",
        },
      ];

      const [pricePerFullShare, tvl, strategy] = await multicall(
        VaultABI,
        calls
      );

      const callsStrategy = [
        {
          address: strategy[0],
          name: "masterchef",
        },
        {
          address: strategy[0],
          name: "poolId",
        },
      ];

      const [masterChef, poolId] = await multicall(strategyABI, callsStrategy);

      const masterChefAddress = masterChef[0];

      const [info, totalAllocPoint, masterChefPerBlock] = await multicall(
        masterchefABI,
        [
          {
            address: masterChefAddress,
            name: "poolInfo",
            params: [poolId[0].toNumber()],
          },
          {
            address: masterChefAddress,
            name: "totalAllocPoint",
          },
          {
            address: masterChefAddress,
            name: "BEP20TokenPerBlock",
          },
          // {
          //   address: lpAddress,
          //   name: 'balanceOf',
          //   params: [masterChefAddress]
          // },
        ]
      );

      const lpAddress = info.lpToken;

      const callsPool = [
        // Balance of token in the LP contract
        {
          address: getAddress(f.token.address),
          name: "balanceOf",
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(f.quoteToken.address),
          name: "balanceOf",
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: "balanceOf",
          params: [masterChefAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: "totalSupply",
        },
        // Token decimals
        {
          address: getAddress(f.token.address),
          name: "decimals",
        },
        // Quote token decimals
        {
          address: getAddress(f.quoteToken.address),
          name: "decimals",
        },
      ];

      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, callsPool);

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
        new BigNumber(lpTotalSupply)
      );

      let lpTotalInQuoteToken: BigNumber;

      if (f.quoteToken === f.token) {
        lpTotalInQuoteToken = new BigNumber(lpTokenBalanceMC).div(
          new BigNumber(10).pow(tokenDecimals)
        );
      } else {
        lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
          .div(BIG_TEN.pow(f.quoteToken.decimals ?? 18))
          .times(new BigNumber(2))
          .times(lpTokenRatio);
      }

      const allocPoint = new BigNumber(info.allocPoint._hex);

      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      return {
        ...f,
        pricePerFullShare: new BigNumber(pricePerFullShare).toString(),
        tvl: new BigNumber(tvl).toString(),
        strategy: strategy[0],
        poolWeight: poolWeight.toJSON(),
        perBlock: new BigNumber(masterChefPerBlock[0].toString())
          .div(new BigNumber(10).pow(f.earnToken.decimals || 18))
          .toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        userData: {
          allowance: "0",
          sharesBalance: "0",
          tokenBalance: "0",
        },
      };
    })
  );
}

export const fetchVaultUserAllowances = async (
  account: string,
  farmsToFetch: VaultConfig[]
) => {
  const calls = farmsToFetch.map((farm) => {
    const vaultAddress = getAddress(farm.vaultAddress);
    return {
      address: getAddress(farm.token.address),
      name: "allowance",
      params: [account, vaultAddress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchVaultUserShares = async (
  account: string,
  farmsToFetch: VaultConfig[]
) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: getAddress(farm.vaultAddress),
      name: "balanceOf",
      params: [account],
    };
  });

  const shares = await multicall(erc20ABI, calls);

  const parsedLpAllowances = shares.map((share) => {
    return new BigNumber(share.toString())
      .div(new BigNumber(10).pow(18))
      .toString();
  });

  return parsedLpAllowances;
};

export const fetchVaultUserTokenBalances = async (
  account: string,
  farmsToFetch: VaultConfig[]
) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = getAddress(farm.token.address);
    return {
      address: lpContractAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toString();
  });
  return parsedTokenBalances;
};

export const fetchVaultUserDataAsync =
  (account: string) => async (dispatch, getState) => {
    const farmsToFetch = vaultConfig;

    const userFarmAllowances = await fetchVaultUserAllowances(
      account,
      farmsToFetch
    );

    const vaultUserShare = await fetchVaultUserShares(account, farmsToFetch);

    const tokenBalances = await fetchVaultUserTokenBalances(
      account,
      farmsToFetch
    );

    const arrayOfUserDataObjects = userFarmAllowances.map(
      (farmAllowance, index) => {
        return {
          allowance: userFarmAllowances[index],
          sharesBalance: vaultUserShare[index],
          tokenBalance: tokenBalances[index],
        };
      }
    );
    dispatch(setVaultUserData({ arrayOfUserDataObjects }));
  };

export const fetchVaultPublicDataAsync = () => async (dispatch, getState) => {
  try {
    const vaults = await fetchFarmVaults(vaultConfig);
    dispatch(setVaultsPublicData(vaults));
  } catch (e) {
    console.log(e);
  }
};

export default vaultsSlice.reducer;
