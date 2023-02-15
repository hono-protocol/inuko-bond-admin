import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import farmsReducer from "./farms";
import vaultsReducer from "./vaults";
import assetsReducer from "./assets";
import poolsReducer from "./pools";
import pricesReducer from "./prices";
import profileReducer from "./profile";
import teamsReducer from "./teams";
import achievementsReducer from "./achievements";
import blockReducer from "./block";
import collectiblesReducer from "./collectibles";
import referralsReducer from "./referrals";
import statisticsReducer from "./statistics";
import application from "./application/reducer";
import user from "./user/reducer";
import swap from "./swap/reducer";
import lists from "./lists/reducer";
import multicall from "./multicall/reducer";
import transactions from "./transactions/reducer";
import burn from "./burn/reducer";
import mint from "./mint/reducer";

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    achievements: achievementsReducer,
    block: blockReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    profile: profileReducer,
    teams: teamsReducer,
    collectibles: collectiblesReducer,
    referrals: referralsReducer,
    statistics: statisticsReducer,
    vaults: vaultsReducer,
    assets: assetsReducer,
    application,
    swap,
    multicall,
    lists,
    transactions,
    user,
    mint,
    burn,
  },
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
