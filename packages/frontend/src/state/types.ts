import BigNumber from "bignumber.js";
import {
  CampaignType,
  FarmConfig,
  Nft,
  PoolConfig,
  Team,
} from "config/constants/types";
import { VaultsState } from "./vaults";

export type TranslatableText =
  | string
  | {
      key: string;
      data?: {
        [key: string]: string | number;
      };
    };

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  quoteTokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: BigNumber;
  perBlock?: string;
  userData?: {
    allowance: string;
    tokenBalance: string;
    stakedBalance: string;
    earnings: string;
    canHarvest: boolean;
  };
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  startBlock?: number;
  endBlock?: number;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
    canHarvest: boolean;
  };
}

export interface Profile {
  userId: number;
  points: number;
  teamId: number;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  username: string;
  nft?: Nft;
  team: Team;
  hasRegistered: boolean;
}

// Slices states

export interface FarmsState {
  data: Farm[];
  loadArchivedFarmsData: boolean;
  userDataLoaded: boolean;
}

export interface PoolsState {
  data: Pool[];
}

export interface ProfileState {
  isInitialized: boolean;
  isLoading: boolean;
  hasRegistered: boolean;
  data: Profile;
}

export type TeamResponse = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: boolean;
};

export type TeamsById = {
  [key: string]: Team;
};

export interface TeamsState {
  isInitialized: boolean;
  isLoading: boolean;
  data: TeamsById;
}

export interface Achievement {
  id: string;
  type: CampaignType;
  address: string;
  title: TranslatableText;
  description?: TranslatableText;
  badge: string;
  points: number;
}

export interface AchievementState {
  data: Achievement[];
}

// API Price State
export interface PriceApiList {
  /* eslint-disable camelcase */
  [key: string]: {
    name: string;
    symbol: string;
    price: string;
    price_KAI: string;
  };
}

export interface PriceApiListThunk {
  /* eslint-disable camelcase */
  [key: string]: number;
}

export interface PriceApiResponse {
  /* eslint-disable camelcase */
  updated_at: string;
  data: PriceApiList;
}

export interface PriceApiThunk {
  /* eslint-disable camelcase */
  updated_at: string;
  data: PriceApiListThunk;
}

export interface PriceState {
  isLoading: boolean;
  lastUpdated: string;
  data: PriceApiListThunk;
}

export interface ReferralInfo {
  referralsCount: number;
  totalReferralCommissions: number;
  referrer: string;
}

export interface ReferralState {
  isLoading: boolean;
  data: ReferralInfo;
}

// Block

export interface BlockState {
  currentBlock: number;
  initialBlock: number;
}

// Collectibles

export interface CollectiblesState {
  isInitialized: boolean;
  isLoading: boolean;
  data: {
    [key: string]: number[];
  };
}

// Predictions

export enum BetPosition {
  BULL = "Bull",
  BEAR = "Bear",
  HOUSE = "House",
}

export enum PredictionStatus {
  INITIAL = "initial",
  LIVE = "live",
  PAUSED = "paused",
  ERROR = "error",
}

export interface Round {
  id: string;
  epoch: number;
  failed?: boolean;
  startBlock: number;
  startAt: number;
  lockAt: number;
  lockBlock: number;
  lockPrice: number;
  endBlock: number;
  closePrice: number;
  totalBets: number;
  totalAmount: number;
  bullBets: number;
  bearBets: number;
  bearAmount: number;
  bullAmount: number;
  position: BetPosition;
  bets?: Bet[];
}

export interface Market {
  id: string;
  paused: boolean;
  epoch: number;
}

export interface Bet {
  id: string;
  hash: string;
  amount: number;
  position: BetPosition;
  claimed: boolean;
  user: PredictionUser;
  round: Round;
}

export interface PredictionUser {
  id: string;
  address: string;
  block: number;
  totalBets: number;
  totalBNB: number;
}

export interface RoundData {
  [key: string]: Round;
}

export interface HistoryData {
  [key: string]: Bet[];
}

export interface BetData {
  [key: string]: {
    [key: string]: Partial<Bet>;
  };
}

export enum HistoryFilter {
  ALL = "all",
  COLLECTED = "collected",
  UNCOLLECTED = "uncollected",
}

export interface PredictionsState {
  status: PredictionStatus;
  isLoading: boolean;
  isHistoryPaneOpen: boolean;
  isChartPaneOpen: boolean;
  isFetchingHistory: boolean;
  historyFilter: HistoryFilter;
  currentEpoch: number;
  currentRoundStartBlockNumber: number;
  intervalBlocks: number;
  bufferBlocks: number;
  minBetAmount: string;
  rounds: RoundData;
  history: HistoryData;
  bets: BetData;
}

export interface LockedVault {
  begin: number;
  available: number;
  percentage: number;
  release: number;
}

export interface StatisticsState {
  totalSupply: number;
  locked: number;
  locked10: number;
  burned: number;
  distributed: number;
  circulation: number;
  users: number;
  lockedBridge: number;
  usersBep20: number;
  lockedVaults: {
    founding: LockedVault;
    advisor: LockedVault;
    marketing: LockedVault;
    treasury: LockedVault;
    private: LockedVault;
    public: LockedVault;
  };
  krc20: {
    locked: number;
    locked10: number;
    burned: number;
    distributed: number;
    circulation: number;
    users: number;
    lockedBridge: number;
    usersBep20: number;
    bep20: number;
  };
}
export interface AssetsState {
  tokens: {
    [key: string]: {
      balance: string;
      value: string;
      price: string;
    };
  };
}

// Global state

export interface State {
  achievements: AchievementState;
  block: BlockState;
  farms: FarmsState;
  prices: PriceState;
  pools: PoolsState;
  predictions: PredictionsState;
  profile: ProfileState;
  teams: TeamsState;
  collectibles: CollectiblesState;
  referrals: ReferralState;
  statistics: StatisticsState;
  vaults: VaultsState;
  assets: AssetsState;
}
