/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AssetsState } from "../types";
import { ERC20_ABI } from "../../config/abi/erc20";
import multicall, { Call } from "../../utils/multicall";
import BigNumber from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import { AppState } from "../index";
import { Contract } from "ethers";
import lpAbi from "../../config/abi/lpToken.json";
import ercAbi from "../../config/abi/erc20.json";
import { simpleRpcProvider } from "../../utils/providers";

const initialState: AssetsState = {
  tokens: {},
};

export const AssetsSlice = createSlice({
  name: "Assets",
  initialState,
  reducers: {
    resetTokenBalance: (state) => {
      state.tokens = {};

      return state;
    },
    setTokenBalance: (
      state,
      action: PayloadAction<
        { address: string; balance: string; price: string; value: string }[]
      >
    ) => {
      action.payload.forEach((p) => {
        state.tokens[p.address] = {
          balance: p.balance,
          price: p.price,
          value: p.value,
        };
      });

      return state;
    },
  },
});

// Actions
export const { setTokenBalance, resetTokenBalance } = AssetsSlice.actions;

export default AssetsSlice.reducer;

async function calcLP(lpAdd: string) {
  const provider = simpleRpcProvider;
  const contract = new Contract(lpAdd, lpAbi, provider);

  const [token0, token1, lpTotalSupply] = await Promise.all([
    contract.token0(),
    contract.token1(),
    contract.totalSupply(),
  ]);

  const contractToken0 = new Contract(token0, ercAbi, provider);
  const contractToken1 = new Contract(token1, ercAbi, provider);

  const [balanceTokenLP, decimals, balanceTokenLP1, decimals1] =
    await Promise.all([
      contractToken0.balanceOf(lpAdd),
      contractToken0.decimals(),
      contractToken1.balanceOf(lpAdd),
      contractToken1.decimals(),
    ]);

  const quoteTokenToMultiplyQuoteTokenPrice = new BigNumber(
    balanceTokenLP.toString()
  )
    .div(new BigNumber(10).pow(decimals))
    .times(2)
    .div(
      new BigNumber(lpTotalSupply.toString()).div(new BigNumber(10).pow(18))
    );

  const quoteTokenToMultiplyQuoteTokenPrice1 = new BigNumber(
    balanceTokenLP1.toString()
  )
    .div(new BigNumber(10).pow(decimals1))
    .times(2)
    .div(
      new BigNumber(lpTotalSupply.toString()).div(new BigNumber(10).pow(18))
    );

  return {
    quoteTokenToMultiplyQuoteTokenPrice,
    quoteTokenToMultiplyQuoteTokenPrice1,
    token0,
    token1,
  };
}

export const fetchTokenAssetAsync =
  (
    address: { address: string; decimal: number; isLP?: boolean }[],
    userAddress: string
  ) =>
  async (dispatch, getState) => {
    const calls = address.map<Call>((a) => {
      return {
        address: a.address,
        name: "balanceOf",
        params: [userAddress],
      };
    });

    const state: AppState = getState();

    const prices = state.prices.data;

    const result = await multicall(ERC20_ABI, calls);

    const listLP = address.filter((l) => {
      return l.isLP === true;
    });

    const lpResult = await Promise.all(
      listLP.map(async (l) => {
        return await calcLP(l.address);
      })
    );

    dispatch(
      setTokenBalance(
        result.map((r, i) => {
          const t = address[i];
          const balance = new BigNumber(
            formatUnits(r.toString(), address[i].decimal)
          );

          let price = 0;

          if (!t.isLP && prices[t.address.toLowerCase()]) {
            price = prices[t.address.toLowerCase()];
          }

          if (t.isLP) {
            const index = listLP.findIndex((x) => x.address === t.address);

            const lpResultDetail = lpResult[index];

            if (lpResultDetail) {
              const price0 = prices[lpResultDetail.token0.toLowerCase()];
              const price1 = prices[lpResultDetail.token1.toLowerCase()];

              if (price0) {
                price =
                  new BigNumber(
                    lpResultDetail.quoteTokenToMultiplyQuoteTokenPrice
                  )
                    .times(price0)
                    .toNumber() || new BigNumber(0).toNumber();
              }

              if (price === 0 && price1) {
                price =
                  new BigNumber(
                    lpResultDetail.quoteTokenToMultiplyQuoteTokenPrice1
                  )
                    .times(price1)
                    .toNumber() || new BigNumber(0).toNumber();
              }
            }
          }

          const value = balance.multipliedBy(price);

          return {
            value: value.toString(),
            price: price.toString(),
            address: address[i].address,
            balance: balance.toString(),
          };
        })
      )
    );
  };
