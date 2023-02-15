import { ChainId, JSBI, Percent, Token, WETH } from "@pancakeswap/sdk";
import {
  BUSD,
  DAI,
  USDT,
  BTCB,
  CAKE,
  UST,
  ETH,
  USDC,
  BIG,
  BTN,
  BDS,
  SIG,
} from "./tokens";

const routerAddress = {
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  97: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
};
const distributorAddress = {
  56: "0xf0B7eA20b67106938c8E2Ee9Aa8902A66976e48f",
  97: "0xeB5e072a22E3098c52a42Dd0fa77761655b0390D",
};
const bondAddress = {
  56: "0x50727f960148fe4f22a8fff844698b461ac24197",
  97: "0xdd906af9b2553AFDf6e6D25865CA8A7f67C75538",
};
const inverseBondAddress = {
  56: "0xD9a67130e419A00c5d284b1C3B94b74b7011f156",
  97: "0xd4b07D46f794c1a6cffdE1B9b2f8FD57a5096e12",
};
const stakingAddress = {
  56: "0xeca8d71c1f667f5c122b72af5f6e87b1dcffee78",
  97: "0xb2E1F69542F9DF321dF4D17612D0d9998eA44636",
};
const lockedLPWallet = {
  56: "0x62d55e1D648Dc1076b5E273018122607d9666BEa",
  97: "0x62d55e1D648Dc1076b5E273018122607d9666BEa",
};
const treasuryWallet = {
  56: "0x1611B7DB34579Ea71B65991F4beac4a1E3aB640C",
  97: "0x1611B7DB34579Ea71B65991F4beac4a1E3aB640C",
};

export const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
export const ROUTER_ADDRESS = routerAddress[process.env.REACT_APP_CHAIN_ID];
export const DISTRIBUTOR_ADDRESS =
  distributorAddress[process.env.REACT_APP_CHAIN_ID];
export const BOND_ADDRESS = bondAddress[process.env.REACT_APP_CHAIN_ID];
export const INVERSE_BOND_ADDRESS =
  inverseBondAddress[process.env.REACT_APP_CHAIN_ID];
export const STAKING_ADDRESS = stakingAddress[process.env.REACT_APP_CHAIN_ID];
export const LOCKED_LP_WALLET = lockedLPWallet[process.env.REACT_APP_CHAIN_ID];
export const TREASURY_WALLET = treasuryWallet[process.env.REACT_APP_CHAIN_ID];

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    CAKE[ChainId.MAINNET],
    BUSD[ChainId.MAINNET],
    USDT,
    BTCB,
    UST,
    ETH,
    USDC,
  ],
  [ChainId.TESTNET]: [
    WETH[ChainId.TESTNET],
    CAKE[ChainId.TESTNET],
    BUSD[ChainId.TESTNET],
  ],
};

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
  [ChainId.MAINNET]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
  [ChainId.MAINNET]: {},
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [SIG[ChainId.MAINNET], BUSD[ChainId.MAINNET], USDT, BTCB],
  [ChainId.TESTNET]: [
    SIG[ChainId.TESTNET],
    WETH[ChainId.TESTNET],
    CAKE[ChainId.TESTNET],
    BUSD[ChainId.TESTNET],
  ],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    DAI,
    BUSD[ChainId.MAINNET],
    USDT,
    BDS[ChainId.MAINNET],
    BIG[ChainId.MAINNET],
    BTN[ChainId.MAINNET],
    SIG[ChainId.MAINNET],
  ],
  [ChainId.TESTNET]: [
    WETH[ChainId.TESTNET],
    CAKE[ChainId.TESTNET],
    BUSD[ChainId.TESTNET],
  ],
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {
  [ChainId.MAINNET]: [
    [SIG[ChainId.MAINNET], USDT],
    [BUSD[ChainId.MAINNET], USDT],
    [BDS[ChainId.MAINNET], USDT],
    [BIG[ChainId.MAINNET], USDT],
    [BTN[ChainId.MAINNET], USDT],
    [BDS[ChainId.MAINNET], BIG[ChainId.MAINNET]],
    [BDS[ChainId.MAINNET], BTN[ChainId.MAINNET]],
    [DAI, USDT],
  ],
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 3000;

// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

export const BIG_INT_ZERO = JSBI.BigInt(0);

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(
  JSBI.BigInt(50),
  JSBI.BigInt(10000)
);

export const ZERO_PERCENT = new Percent("0");
export const ONE_HUNDRED_PERCENT = new Percent("1");

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",
  "0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b",
  "0x901bb9583b24D97e995513C6778dc6888AB6870e",
  "0xA7e5d5A720f06526557c513402f2e6B5fA20b008",
  "0x8576aCC5C05D6Ce88f4e49bf65BdF0C62F91353C",
];

export { default as farmsConfig } from "./farms";
export { default as poolsConfig } from "./pools";
export { default as ifosConfig } from "./ifo";
export { default as vipIfoConfig } from "./vipIfo";

export const INUKO_TAX = 0.12;

const aggregatorAddress = {
  97: "0xDdbC4118aC6367e4bA4Fbda60A719b2b32E10D4a",
  56: "",
};
const expiryTeller = {
  97: "0x7EEf2d5385525BdcD7E261fAb1507B39Aa2F8F4A",
  56: "",
};
const expirySda = {
  97: "0xB720a4F8256C71D470d1d1186DE50D624A336E76",
  56: "",
};
const fixedTermTeller = {
  97: "0xEAF9cEFAA448236161bb8a4D32404840bDd501EB",
  56: "",
};
const fixedTermSda = {
  97: "0x28F96390670aC4051358fDc22fF67F2B64e7D7e8",
  56: "",
};
export const AGGREGATOR_ADDRESS =
  aggregatorAddress[process.env.REACT_APP_CHAIN_ID];
export const EXPIRY_TELLER_ADDRESS =
  expiryTeller[process.env.REACT_APP_CHAIN_ID];
export const EXPIRY_SDA_ADDRESS = expirySda[process.env.REACT_APP_CHAIN_ID];
export const TERM_TELLER_ADDRESS =
  fixedTermTeller[process.env.REACT_APP_CHAIN_ID];
export const TERM_SDA_ADDRESS = fixedTermSda[process.env.REACT_APP_CHAIN_ID];
