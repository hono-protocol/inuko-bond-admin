/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PriceApiResponse, PriceApiThunk, PriceState } from "state/types";
import BigNumber from "bignumber.js";

import multicall from "utils/multicall";
import erc20 from "config/abi/erc20.json";
import tokens from "config/constants/tokens";
import { getAddress } from "./../../utils/addressHelpers";

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: {},
};

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiThunk>(
  "prices/fetch",
  async () => {
    const response2 = await fetch("https://api.pancakeswap.info/api/v2/tokens");    

    const fetchBDSPriceByPairs = async (bnbPrice: string) => {
      const SIG = getAddress(tokens.sig.address)
      const BUSD = getAddress(tokens.usdt.address);
      const pairs = getAddress(tokens.lpSigBusd.address); // INUKO - BUSD

      const calls = [
        {
          address: SIG, // INUKO
          name: "balanceOf",
          params: [pairs],
        },
        {
          address: BUSD, // BUSD
          name: "balanceOf",
          params: [pairs], // INUKO - BUSD
        },
      ];
      const [
        sigBal,
        busdBal,
      ] = await multicall(erc20, calls);

      const sigPrice = new BigNumber(busdBal)
        .div(new BigNumber(10).pow(tokens.usdt.decimals))
        .div(
          new BigNumber(sigBal).div(new BigNumber(10).pow(tokens.sig.decimals))
        )
        .toNumber();        

      return {
        sigPrice
      };
    };

    const data2 = (await response2.json()) as PriceApiResponse;

    const data = { data: null };

    data.data = {
      ...data2.data,
    };

    const bnbPrice = data.data[getAddress(tokens.wbnb.address)]?.price || "0";

    const { sigPrice } =
      await fetchBDSPriceByPairs(bnbPrice);

    // Return normalized token names
    const prices = {
      updated_at: new Date().toString(),
      data: Object.keys(data.data).reduce(
        (accum, token) => {
          return {
            ...accum,
            [token.toLowerCase()]: parseFloat(data.data[token].price),
          };
        },
        {
          [getAddress(tokens.sig.address).toLowerCase()]: sigPrice,
        }
      ),
    };

    return prices;
  }
);

export const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(
      fetchPrices.fulfilled,
      (state, action: PayloadAction<PriceApiThunk>) => {
        state.isLoading = false;
        state.lastUpdated = action.payload.updated_at;
        state.data = action.payload.data;
      }
    );
  },
});

export default pricesSlice.reducer;
