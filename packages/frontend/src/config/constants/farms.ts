import tokens from "./tokens";
import { FarmConfig } from "./types";

const masterChefBDS = {
  97: "0x1d3A9a47ec7dDdE34d39F88432409Bf723476Faf",
  56: "0x1d3A9a47ec7dDdE34d39F88432409Bf723476Faf",
};

export const BDSUSDT = "0x0aa7158d3d502c2be4153ef39e2f819f0593e82c";
export const BDSBNB = "0x4B7Ba687A8d25184eA320FC73e2cd39Faaf3fA63";
export const BTNBDS = "0xb32dd0ddd9376b1cea12d64a8466d46074a7fded";
export const BLCBDS = "0x0fda38ef63ac6180af2ece83188b031f0feb6506";
export const BIGBDS = "0xe71710e588526747134ed35a69fb9bf5263c5443";

// WBNB masterchef
const masterChefBNB = {
  97: "0xf1e626cb7E3A7AEd751be09670E424c64654e159",
  56: "0x839178de52c28a3F58904951C046B0086e4454D3",
};

// @todo contract farm
const farms: FarmConfig[] = [
  {
    pid: 0,
    lpSymbol: "BDS-USDT LP",
    lpAddresses: {
      97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      56: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 10,
    lpSymbol: "BTN-USDT LP",
    lpAddresses: {
      97: "0xb238008a89323827c008ef93e540e22c596947d5",
      56: "0xb238008a89323827c008ef93e540e22c596947d5",
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 11,
    lpSymbol: "BLC-USDT LP",
    lpAddresses: {
      97: "0x89bd9E55b205F4e3fabFD2b168e09F8937A7E9d8",
      56: "0x89bd9E55b205F4e3fabFD2b168e09F8937A7E9d8",
    },
    token: tokens.sig,
    quoteToken: tokens.usdt,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 1,
    lpSymbol: "BDS",
    lpAddresses: tokens.sig.address,
    token: tokens.sig,
    quoteToken: tokens.sig,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
    bgImg: "/images/bds-banner.png",
    name: "BIG DIGITAL SHARES (BDS)",
    url: "http://bigbds.io",
  },
  {
    pid: 2,
    lpSymbol: "BDS-WBNB LP",
    lpAddresses: {
      97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      56: "0x4B7Ba687A8d25184eA320FC73e2cd39Faaf3fA63",
    },
    token: tokens.sig,
    quoteToken: tokens.wbnb,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 8,
    lpSymbol: "BLC-BDS LP",
    lpAddresses: {
      97: "0x0fDA38ef63Ac6180AF2ECE83188b031f0FEB6506",
      56: "0x0fDA38ef63Ac6180AF2ECE83188b031f0FEB6506",
    },
    token: tokens.sig,
    quoteToken: tokens.sig,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 3,
    lpSymbol: "BTN-BDS LP",
    lpAddresses: {
      97: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
      56: "0xb32dd0ddd9376b1cea12d64a8466d46074a7fded",
    },
    token: tokens.sig,
    quoteToken: tokens.sig,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
  },
  {
    pid: 4,
    lpSymbol: "BTN",
    lpAddresses: tokens.sig.address,
    token: tokens.sig,
    quoteToken: tokens.sig,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
    bgImg: "/images/btn-banner.jpg",
    name: "BIG TAY NINH (BTN)",
    url: "http://bigbds.io/btn.html",
  },

  {
    pid: 9,
    lpSymbol: "BLC",
    lpAddresses: tokens.sig.address,
    token: tokens.sig,
    quoteToken: tokens.sig,
    masterChefContract: masterChefBDS,
    earnToken: tokens.sig,
    openAt: 1627783200000,
    beforeOpenPerBlock: "0",
    bgImg: "/images/blc-banner.jpg",
    name: "BIG LAO CAI (BLC)",
    url: "http://bigbds.io/blc.html",
  },
];

export default farms;
