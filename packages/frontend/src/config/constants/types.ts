import { TranslatableText } from "state/types";

export interface Address {
  97?: string;
  56: string;
}

export interface Token {
  symbol: string;
  address?: Address;
  decimals?: number;
  projectLink?: string;
  busdPrice?: string;
}

export enum PoolIds {
  poolBasic = "poolBasic",
  poolUnlimited = "poolUnlimited",
}

export type IfoStatus = "idle" | "coming_soon" | "live" | "finished";

interface IfoPoolInfo {
  name?: string;
  condition?: string;
  saleAmount: string;
  raiseAmount: string;
  cakeToBurn: string;
  distributionRatio: number; // Range [0-1]
}

export interface IfoVipPoolInfo {
  pid: number;
  name?: string;
  condition?: string;
  saleAmount: number;
  raiseAmount: number;
  burnRatio: number;
  isLP: boolean;
  lpToken: Token;
  highlight?: boolean;
}

export interface Ifo {
  id: string;
  title: string;
  lpName: string;
  bgUrl?: string;
  isActive: boolean;
  address: string;
  name: string;
  currency: Token;
  currencyIsLP: boolean;
  token: Token;
  releaseBlockNumber: number;
  articleUrl: string;
  campaignId: string;
  tokenOfferingPrice: number;
  version: number;
  logoUrl: string;
  lpAmount: string;
  lpPriceDisplay: string;
  [PoolIds.poolBasic]?: IfoPoolInfo;
  [PoolIds.poolUnlimited]: IfoPoolInfo;
}

export interface VipIfo {
  id: string;
  title: string;
  bgUrl?: string;
  isActive: boolean;
  address: string;
  name: string;
  token: Token;
  releaseBlockNumber: number;
  articleUrl: string;
  campaignId: string;
  logoUrl: string;
  lpAmount: number;
  pools: IfoVipPoolInfo[];
}

export enum PoolCategory {
  "COMMUNITY" = "Community",
  "CORE" = "Core",
  "BINANCE" = "Binance", // Pools using native BNB behave differently than pools using a token
  "AUTO" = "Auto",
}

export interface FarmConfig {
  pid: number;
  name?: string;
  url?: string;
  bgImg?: string;
  lpSymbol: string;
  lpAddresses: Address;
  token: Token;
  quoteToken: Token;
  multiplier?: string;
  isCommunity?: boolean;
  depositFeeBP?: number;
  harvestInterval?: number;
  openAt?: number;
  beforeOpenPerBlock?: string;
  masterChefContract: Address;
  earnToken: Token;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
}

export interface VipPoolConfig {
  pid: number;
  name: string;
  isLP: boolean;
  lpToken: Token;
  token: Token;
  quoteToken: Token;
  earnToken: Token;
  masterChefContract: Address;
  highlight?: boolean;
}

export interface PoolConfig {
  sousId: number;
  earningToken: Token;
  stakingToken: Token;
  stakingLimit?: number;
  contractAddress: Address;
  poolCategory: PoolCategory;
  tokenPerBlock: string;
  sortOrder?: number;
  harvest?: boolean;
  isFinished?: boolean;
  enableEmergencyWithdraw?: boolean;
  depositFeeBP?: number;
  harvestInterval?: number;
  smartChef?: boolean;
}

export type Images = {
  lg: string;
  md: string;
  sm: string;
  ipfs?: string;
};

export type NftImages = {
  blur?: string;
} & Images;

export type NftVideo = {
  webm: string;
  mp4: string;
};

export type NftSource = {
  [key in NftType]: {
    address: Address;
    identifierKey: string;
  };
};

export enum NftType {
  PANCAKE = "pancake",
  MIXIE = "mixie",
}

export type Nft = {
  description: string;
  name: string;
  images: NftImages;
  sortOrder: number;
  type: NftType;
  video?: NftVideo;

  // Uniquely identifies the nft.
  // Used for matching an NFT from the config with the data from the NFT's tokenURI
  identifier: string;

  // Used to be "bunnyId". Used when minting NFT
  variationId?: number | string;
};

export type TeamImages = {
  alt: string;
} & Images;

export type Team = {
  id: number;
  name: string;
  description: string;
  isJoinable?: boolean;
  users: number;
  points: number;
  images: TeamImages;
  background: string;
  textColor: string;
};

export type CampaignType = "ifo" | "teambattle";

export type Campaign = {
  id: string;
  type: CampaignType;
  title?: TranslatableText;
  description?: TranslatableText;
  badge?: string;
};

export type PageMeta = {
  title: string;
  description?: string;
  image?: string;
};

export interface VaultConfig {
  id: string;
  earnToken: Token;
  token: Token;
  quoteToken: Token;
  lpSymbol?: string;
  lpToken?: Token[];
  vaultAddress: Address;
  withdrawFee: string;
  performanceFee: string;
  isSingle?: boolean;
  multiplier: string;
}
