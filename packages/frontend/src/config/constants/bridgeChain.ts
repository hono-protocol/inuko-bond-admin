export interface BridgeChain {
  chainId: number;
  name: string;
  symbol: string;
  address?: string;
  status?: BridgeChainStatus;
  logoUrl?: string;
}

export interface BridgeToken {
  name: string;
  symbol: string;
  address: {
    [key in BridgeType]: string;
  };
  decimal: {
    [key in BridgeType]: number;
  };
  logo: string;
  onlySupportBridges?: BridgeType[];
  minimumTransfer: number;
  transferNote?: string;
  transferFee?: {
    [key in BridgeType]: number; // language key
  };
  resultFormula?: (amount: number) => number;
}

export enum BridgeType {
  BSC_TO_KAI = "bsc_to_kai",
  KAI_TO_BSC = "kai_to_bsc",
}
export enum BridgeChainStatus {
  UPCOMING = "UPCOMING",
}

export const BNB_ADDRESS = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
export const BSC_CONTRACT_ADDRESS =
  "0x00b310A01182Ed7b10572173506c2ff8B270a806";
export const BSC_KAI_CONTRACT_ADDRESS =
  "0x93427A58cd1E27d25e7140b685E2753950eeac2C";
export const KAI_BSC_CONTRACT_ADDRESS =
  "0x87AC7883Cad9511f301d6b85DF414A0720aBCd12";

export const ETH_CHAIN = 1;
export const BSC_CHAIN = 56;

export const supportedChains: BridgeChain[] = [
  {
    chainId: 1,
    name: "KardiaChain",
    symbol: "KAI",
    address: "0xD9Ec3ff1f8be459Bb9369b4E79e9Ebcf7141C093",
  },
  {
    chainId: 56,
    name: "Binance Smart Chain",
    symbol: "BSC",
    address: BNB_ADDRESS,
  },
];

export const supportedTokens: BridgeToken[] = [
  // {
  //   name: 'Tether',
  //   symbol: 'USDT',
  //   address: {
  //     [BridgeType.BSC_TO_KAI]: '0x55d398326f99059ff775485246999027b3197955', // USDT in BSC
  //     [BridgeType.KAI_TO_BSC]: '0x92364Ec610eFa050D296f1EEB131f2139FB8810e' // USDT in KardiaChain
  //   },
  //   decimal: {
  //     [BridgeType.BSC_TO_KAI]: 18,
  //     [BridgeType.KAI_TO_BSC]: 6 // decimal in KardiaChain
  //   },
  //   logo: '/images/tokens/0x55d398326f99059ff775485246999027b3197955.png',
  //   minimumTransfer: 10,
  //   transferFee: {
  //     [BridgeType.BSC_TO_KAI]: 90063,
  //     [BridgeType.KAI_TO_BSC]: 90064
  //   },
  //   resultFormula: (amount: number) => (amount - 0.5) * 0.999
  // },
  {
    name: "Big Digital Shares",
    symbol: "BDS",
    address: {
      [BridgeType.BSC_TO_KAI]: "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
      [BridgeType.KAI_TO_BSC]: "0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b", // BDS in KardiaChain
    },
    decimal: {
      [BridgeType.BSC_TO_KAI]: 8,
      [BridgeType.KAI_TO_BSC]: 8, // decimal in KardiaChain
    },
    logo: "/images/tokens/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b.png",
    minimumTransfer: 10,
    resultFormula: (amount: number) => amount,
  },
];

export type BridgeOption<T> = T & {
  label: string;
  value: string;
};
