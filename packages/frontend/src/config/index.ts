import { ChainId } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js/bignumber";
import { BIG_TEN } from "utils/bigNumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const BSC_BLOCK_TIME = 3;

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: "https://bscscan.com",
  [ChainId.TESTNET]: "https://testnet.bscscan.com",
};

// BECO_PER_BLOCK details
// 70 BECO is minted per block

export const BECO_PER_BLOCK = new BigNumber(20);
export const BLOCKS_PER_YEAR = new BigNumber(
  (60 / BSC_BLOCK_TIME) * 60 * 24 * 365
); // 10512000
export const BLOCKS_PER_DAY = new BigNumber((60 / BSC_BLOCK_TIME) * 60 * 24);
export const CAKE_PER_BLOCK = new BigNumber(40);
export const CAKE_PER_YEAR = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR);
export const BASE_URL = window.origin.toString();
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`;
export const BASE_SWAP_URL = `${BASE_URL}/swap`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_URL}/pool`;
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET];
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50;
export const LOTTERY_TICKET_PRICE = 1;
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18);
export const DEFAULT_GAS_LIMIT = 200000;
export const DEFAULT_GAS_PRICE = 5;
export const AUCTION_BIDDERS_TO_FETCH = 500;
export const RECLAIM_AUCTIONS_TO_FETCH = 500;
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500;
