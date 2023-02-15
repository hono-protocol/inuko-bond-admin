import { ChainId, Token } from "@pancakeswap/sdk";

export const CAKE: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    18,
    "CAKE",
    "PancakeSwap Token"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe",
    18,
    "CAKE",
    "PancakeSwap Token"
  ),
};

export const SIG: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0xea51801b8f5b88543ddad3d1727400c15b209d8f",
    18,
    "INUKO",
    "INUKO"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0x7Ff6a992707FD30223Ea3878143600D8Feb3978e",
    9,
    "INUKO",
    "INUKO"
  ),
};

export const BDS: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
    8,
    "BDS",
    "Big Digital Shares"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
    8,
    "BDS",
    "Big Digital Shares"
  ),
};

export const BIG: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0xa7e4a0c5272f2c892b58c1352ee041d31606f0f9",
    8,
    "BIG",
    "Big Token"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
    8,
    "BDS",
    "Big Digital Shares"
  ),
};

export const BLC: { [chainId: number]: Token } = {
  [ChainId.TESTNET]: new Token(
    ChainId.MAINNET,
    "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
    8,
    "BDS",
    "Big Digital Shares"
  ),
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0x15aC0a5240EDEd9c4B62112342dd808d59F88675",
    8,
    "BLC",
    "Big Lao Cai"
  ),
};

export const BTN: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0x280f1638a642fa379e7cb8094411fc7fac919d70",
    8,
    "BTN",
    "Big Tay Ninh"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
    8,
    "BDS",
    "Big Tay Ninh"
  ),
};

export const BUSD: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    18,
    "BUSD",
    "Binance USD"
  ),
  [ChainId.TESTNET]: new Token(
    ChainId.TESTNET,
    "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    18,
    "BUSD",
    "Binance USD"
  ),
};

export const WBNB = new Token(
  ChainId.MAINNET,
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  18,
  "WBNB",
  "Wrapped BNB"
);
export const DAI = new Token(
  ChainId.MAINNET,
  "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
  18,
  "DAI",
  "Dai Stablecoin"
);
export const USDT = new Token(
  ChainId.MAINNET,
  "0x55d398326f99059fF775485246999027B3197955",
  18,
  "USDT",
  "Tether USD"
);
export const BTCB = new Token(
  ChainId.MAINNET,
  "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
  18,
  "BTCB",
  "Binance BTC"
);
export const UST = new Token(
  ChainId.MAINNET,
  "0x23396cF899Ca06c4472205fC903bDB4de249D6fC",
  18,
  "UST",
  "Wrapped UST Token"
);
export const ETH = new Token(
  ChainId.MAINNET,
  "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
  18,
  "ETH",
  "Binance-Peg Ethereum Token"
);
export const USDC = new Token(
  ChainId.MAINNET,
  "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
  18,
  "USDC",
  "Binance-Peg USD Coin"
);

const tokens = {
  bnb: {
    symbol: "BNB",
    projectLink: "https://kardiachain.io/",
  },
  sig: {
    symbol: "INUKO",
    address: {
      56: "0xea51801b8f5b88543ddad3d1727400c15b209d8f",
      97: "0x7Ff6a992707FD30223Ea3878143600D8Feb3978e",
    },
    decimals: 18,
  },
  busd: {
    symbol: "BUSD",
    address: {
      56: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      97: "0xbe31B897aE6612F551909B93e2477DE92169d5fd",
    },
    decimals: 18,
  },
  wbnb: {
    symbol: "WBNB",
    address: {
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      97: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    decimals: 18,
  },
  cake: {
    symbol: "CAKE",
    address: {
      56: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      97: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    },
    decimals: 18,
  },
  usdt: {
    symbol: "USDT",
    address: {
      56: "0x55d398326f99059fF775485246999027B3197955",
      97: "0xbe31B897aE6612F551909B93e2477DE92169d5fd",
    },
    decimals: 18,
    projectLink: "https://tether.to/",
  },
  lpSigBusd: {
    symbol: "INUKO-USDT",
    address: {
      56: "0xD50B9Bcd8B7D4B791EA301DBCC8318EE854d8B67",
      97: "0x93DD0aDa344CCB6a22EeCf7D4B278b3643c68BDa",
    },
    decimals: 18,
    projectLink: "https://tether.to/",
  },
};

export const createToken = (token: any) => {
  const chainId = process.env.REACT_APP_CHAIN_ID;

  // @ts-ignore
  return {
    ...token,
    chainId,
    address: token.address[chainId],
  } as Token;
};

export const createToken2 = (token: any) => {
  const chainId = process.env.REACT_APP_CHAIN_ID;

  // @ts-ignore
  return {
    ...token,
    chainId,
    address: token?.address,
  } as Token;
};

export const createLpToken = (address) => {
  const chainId = process.env.REACT_APP_CHAIN_ID;

  // @ts-ignore
  return {
    decimals: 18,
    symbol: "LP",
    chainId,
    address: address,
  } as Token;
};

export const getLpName = (address: string) => {
  const chainId = process.env.REACT_APP_CHAIN_ID;
  const listTokens = Object.values(tokens);

  const token = listTokens.find((o) => {
    // @ts-ignore
    const tokenAddress = o.address?.[chainId];
    return tokenAddress?.toLowerCase() === address.toLowerCase();
  });
  return token?.symbol || "LP Token";
};

export default tokens;
