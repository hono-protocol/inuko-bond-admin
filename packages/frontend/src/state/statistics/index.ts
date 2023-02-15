/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LockedVault, StatisticsState } from "../types";
import { getAddress } from "../../utils/addressHelpers";
import tokens from "../../config/constants/tokens";
import multicall, { multicallCustom } from "../../utils/multicall";
import erc20 from "../../config/abi/erc20.json";
import { getBalanceNumber } from "../../utils/formatBalance";
import { ethers } from "ethers";

const initialState: StatisticsState = {
  totalSupply: 0,
  burned: 0,
  locked: 0,
  locked10: 0,
  distributed: 0,
  circulation: 0,
  users: 0,
  usersBep20: 0,
  lockedBridge: 0,
  lockedVaults: {
    founding: {
      available: 0,
      begin: 150_000_000,
      percentage: 0,
      release: 10,
    },
    advisor: {
      available: 0,
      begin: 150_000_000,
      percentage: 0,
      release: 10,
    },
    marketing: {
      available: 0,
      begin: 300_000_000,
      percentage: 0,
      release: 10,
    },
    treasury: {
      available: 0,
      begin: 100_000_000,
      percentage: 0,
      release: 10,
    },
    private: {
      available: 0,
      begin: 100_000_000,
      percentage: 0,
      release: 10,
    },
    public: {
      available: 0,
      begin: 200_000_000,
      percentage: 0,
      release: 10,
    },
  },
  krc20: {
    burned: 0,
    locked: 0,
    locked10: 0,
    distributed: 0,
    circulation: 0,
    users: 0,
    usersBep20: 0,
    lockedBridge: 0,
    bep20: 0,
  },
};

export const statisticsSlice = createSlice({
  name: "Block",
  initialState,
  reducers: {
    setStatistics: (state, action: PayloadAction<Partial<StatisticsState>>) => {
      return {
        ...initialState,
        ...state,
        ...action.payload,
      };
    },
  },
});

// Actions
export const { setStatistics } = statisticsSlice.actions;

export default statisticsSlice.reducer;

export const fetchStatisticAsync = () => async (dispatch, currentState) => {
  const currentStatistic: StatisticsState = currentState().statistics;
  const maxSupply = 1_000_000_000;
  const bdsAddress = getAddress(tokens.sig.address);
  const calls2 = [
    // Balance of token in the LP contract
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0x93427A58cd1E27d25e7140b685E2753950eeac2C"],
    },
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0x000000000000000000000000000000000000dEaD"],
    },
    // Founding team
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0xCefE90a33B88e73130b46e3b1Db1c27fBa62C83a"],
    },
    // Team/Advisors/Contractors
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0x34ab7fb3d71A88AB21046cCAE25DF1B507087AB7"],
    },
    // Marketing/Operations
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0x93af35cffa3bd127ba5e323b28b33dbc983db01f"],
    },
    // Treasury
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0x72691335E7E77cf5F4080e84564Bbe81D025d6EC"],
    },
    // Private Sale investor
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0xFFc9327E02737F4aE50A6144410b8cA812132c05"],
    },
    // Private Sale investor
    {
      address: bdsAddress,
      name: "balanceOf",
      params: ["0xEeb2D3dBCCC131ABA7eaC857d2863671D45c8033"],
    },
  ];

  const results = await Promise.all([
    fetch(
      `https://backend.kardiachain.io/api/v1/krc20/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b/holders?page=1&limit=25`
    ),
    fetch(
      `https://api.bscscan.com/api?module=token&action=tokenholderlist&contractaddress=0x030ce78aa5be014976bca9b8448e78d1d87fce0b&page=1&offset=100000&apikey=ITVBRJR178CWUWF73XR94YGC75GYDKDMA6`
    ),
    multicall(erc20, calls2),
    fetchKrc20Statistic(),
  ]);

  const data = await results[0].json();

  const data2 = await results[1].json();

  const users = data.data.total;

  const state = {
    burned: getBalanceNumber(results[2][1], tokens.sig.decimals),
    lockedBridge: getBalanceNumber(results[2][0], tokens.sig.decimals),
    circulation:
      1_000_000_000 - getBalanceNumber(results[2][0], tokens.sig.decimals),
  };

  const vaults = {
    founding: {
      available: getBalanceNumber(results[2][2], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][2], tokens.sig.decimals) / maxSupply) *
        100,
    },
    advisor: {
      available: getBalanceNumber(results[2][3], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][3], tokens.sig.decimals) / maxSupply) *
        100,
    },
    marketing: {
      available: getBalanceNumber(results[2][4], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][4], tokens.sig.decimals) / maxSupply) *
        100,
    },
    treasury: {
      available: getBalanceNumber(results[2][5], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][5], tokens.sig.decimals) / maxSupply) *
        100,
    },
    private: {
      available: getBalanceNumber(results[2][6], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][6], tokens.sig.decimals) / maxSupply) *
        100,
    },
    public: {
      available: getBalanceNumber(results[2][7], tokens.sig.decimals),
      percentage:
        (getBalanceNumber(results[2][7], tokens.sig.decimals) / maxSupply) *
        100,
    },
  };

  const currentAllVault =
    vaults.private.available +
    vaults.advisor.available +
    vaults.public.available +
    vaults.founding.available +
    vaults.marketing.available +
    vaults.treasury.available;

  dispatch(
    setStatistics({
      ...state,
      locked: currentAllVault,
      circulation: maxSupply - (currentAllVault + state.burned),
      totalSupply: maxSupply - state.burned,
      users,
      usersBep20: data2.result.length,
      krc20: results[3],
      lockedVaults: {
        founding: {
          ...currentStatistic.lockedVaults.founding,
          ...vaults.founding,
        },
        advisor: {
          ...currentStatistic.lockedVaults.advisor,
          ...vaults.advisor,
        },
        private: {
          ...currentStatistic.lockedVaults.private,
          ...vaults.private,
        },
        public: {
          ...currentStatistic.lockedVaults.public,
          ...vaults.public,
        },
        marketing: {
          ...currentStatistic.lockedVaults.marketing,
          ...vaults.marketing,
        },
        treasury: {
          ...currentStatistic.lockedVaults.treasury,
          ...vaults.treasury,
        },
      },
    })
  );
};

export const fetchKrc20Statistic = async () => {
  const tokenBDS = {
    symbol: "BDS",
    address: "0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b",
    decimals: 8,
  };

  const calls = [
    // Balance of token in the LP contract
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x7393cb99887df39bd17cfd32994efdf556c61f81"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x000000000000000000000000000000000000dEaD"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x081eb304C1dD3E88510A5043cbF828cAaeaCFe59"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x87E775c5A91A893a9167E8bb9c2e77B9fFE98f91"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0xA58bf15D35a7F518b983D970cfDD6205DeEe522b"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x12f081f6a1fCB6756021F563C04093b0e8c7ff54"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x2D4746b6A1A9556a74F6d89B1277a2C058d1c5B5"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0xc3626aEE59f009a04eC094399F8911a474e5E0A9"],
    },
    {
      address: tokenBDS.address,
      name: "balanceOf",
      params: ["0x87AC7883Cad9511f301d6b85DF414A0720aBCd12"],
    },
  ];

  const response = await fetch(
    `https://backend.kardiachain.io/api/v1/krc20/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b/holders?page=1&limit=25`
  );

  const data = await response.json();

  const users = data.data.total;

  const rpcProvider = new ethers.providers.JsonRpcProvider(
    "https://rpc.kardiachain.io/"
  );
  const multicallAdd = "0xb7B85166F948838F5Fd6Fc80a6B933B81Dec7891";

  const r = await multicallCustom(erc20, calls, multicallAdd, rpcProvider);

  const state = {
    locked10: getBalanceNumber(r[0], tokenBDS.decimals),
    burned: getBalanceNumber(r[1], tokenBDS.decimals),
    bep20: getBalanceNumber(r[8], tokenBDS.decimals),
  };

  const distributed = 1_000_000_000 - state.locked10 - state.burned;

  const locked =
    getBalanceNumber(r[2], tokenBDS.decimals) +
    getBalanceNumber(r[3], tokenBDS.decimals) +
    getBalanceNumber(r[4], tokenBDS.decimals) +
    getBalanceNumber(r[5], tokenBDS.decimals) +
    getBalanceNumber(r[6], tokenBDS.decimals) +
    getBalanceNumber(r[7], tokenBDS.decimals);

  return {
    ...state,
    distributed,
    circulation: distributed - locked,
    locked,
    users,
  };
};
