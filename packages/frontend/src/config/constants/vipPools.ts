import tokens from "./tokens";
import { VipPoolConfig } from "./types";

export const masterchefVipPool = {
  97: "0x6740E754627452bee751940Fb191e457Bb8059D1",
  56: "0x6740E754627452bee751940Fb191e457Bb8059D1",
};

const farms: VipPoolConfig[] = [
  {
    pid: 0,
    name: "Holder",
    isLP: false,
    lpToken: tokens.sig,
    token: tokens.sig,
    quoteToken: tokens.sig,
    earnToken: tokens.sig,
    masterChefContract: masterchefVipPool,
    highlight: false,
  },
  {
    pid: 1,
    name: "VIP 1",
    isLP: true,
    lpToken: {
      symbol: "BDS-USDT LP",
      address: {
        56: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
        97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      },
      decimals: 18,
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    earnToken: tokens.sig,
    masterChefContract: masterchefVipPool,
    highlight: true,
  },
  {
    pid: 2,
    name: "VIP 2",
    isLP: true,
    lpToken: {
      symbol: "BDS-USDT LP",
      address: {
        56: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
        97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      },
      decimals: 18,
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    earnToken: tokens.sig,
    masterChefContract: masterchefVipPool,
    highlight: true,
  },
  {
    pid: 3,
    name: "VIP 3",
    isLP: true,
    lpToken: {
      symbol: "BDS-USDT LP",
      address: {
        56: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
        97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      },
      decimals: 18,
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    earnToken: tokens.sig,
    masterChefContract: masterchefVipPool,
    highlight: true,
  },
];

export default farms;
