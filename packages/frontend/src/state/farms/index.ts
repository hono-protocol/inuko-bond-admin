/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import farmsConfig from "config/constants/farms";
import isArchivedPid, { getFarmFromPidMasterChef } from "utils/farmHelpers";
import fetchFarms from "./fetchFarms";
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from "./fetchFarmUser";
import { FarmsState, Farm } from "../types";
import { getMasterChefAddress } from "../../utils/addressHelpers";
import fetchFarmsPrices from "./fetchFarmsPrices";

const nonArchivedFarms = farmsConfig.filter(({ pid }) => !isArchivedPid(pid));

const noAccountFarmConfig = farmsConfig.map((farm) => ({
  ...farm,
  userData: {
    allowance: "0",
    tokenBalance: "0",
    stakedBalance: "0",
    earnings: "0",
    canHarvest: false,
  },
}));

const initialState: FarmsState = {
  data: noAccountFarmConfig,
  loadArchivedFarmsData: false,
  userDataLoaded: false,
};

export const farmsSlice = createSlice({
  name: "Farms",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload;
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find(
          (f) =>
            f.lpSymbol === farm.lpSymbol &&
            getMasterChefAddress(f.masterChefContract).toLowerCase() ===
              getMasterChefAddress(farm.masterChefContract).toLowerCase()
        );
        return { ...farm, ...liveFarmData };
      });
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { pid, masterChefContract } = userDataEl;
        const { index } = getFarmFromPidMasterChef(
          state.data,
          pid,
          masterChefContract
        );
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
      state.userDataLoaded = true;
    },
    setLoadArchivedFarmsData: (state, action) => {
      const loadArchivedFarmsData = action.payload;
      state.loadArchivedFarmsData = loadArchivedFarmsData;
    },
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData, setLoadArchivedFarmsData } =
  farmsSlice.actions;

// Thunks
export const fetchFarmsPublicDataAsync =
  (bnbPrice: number) => async (dispatch, getState) => {
    const fetchArchived = getState().farms.loadArchivedFarmsData;
    const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms;
    const farms = await fetchFarms(farmsToFetch);
    const farmsWithPrices = await fetchFarmsPrices(farms, bnbPrice);
    dispatch(setFarmsPublicData(farmsWithPrices));
  };
export const fetchFarmUserDataAsync =
  (account: string) => async (dispatch, getState) => {
    const fetchArchived = getState().farms.loadArchivedFarmsData;
    const farmsToFetch = fetchArchived ? farmsConfig : nonArchivedFarms;
    const userFarmAllowances = await fetchFarmUserAllowances(
      account,
      farmsToFetch
    );

    const userFarmTokenBalances = await fetchFarmUserTokenBalances(
      account,
      farmsToFetch
    );
    const userStakedBalances = await fetchFarmUserStakedBalances(
      account,
      farmsToFetch
    );
    const userFarmEarnings = await fetchFarmUserEarnings(account, farmsToFetch);

    const arrayOfUserDataObjects = userFarmAllowances.map(
      (farmAllowance, index) => {
        return {
          pid: farmsToFetch[index].pid,
          masterChefContract: farmsToFetch[index].masterChefContract,
          allowance: userFarmAllowances[index],
          tokenBalance: userFarmTokenBalances[index],
          stakedBalance: userStakedBalances[index],
          canHarvest: true,
          earnings: userFarmEarnings[index],
        };
      }
    );
    dispatch(setFarmUserData({ arrayOfUserDataObjects }));
  };

export default farmsSlice.reducer;
