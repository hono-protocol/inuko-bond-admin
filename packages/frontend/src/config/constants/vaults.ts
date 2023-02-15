import { VaultConfig } from "./types";
import tokens from "./tokens";

export const vaultConfig: VaultConfig[] = [
  {
    id: "2",
    vaultAddress: {
      "97": "abc",
      "56": "0xa74D333c9A3D08B466180c9E225bC6F26D479911",
    },
    earnToken: tokens.sig,
    token: {
      symbol: "BDS-USDT",
      address: {
        56: "0x0AA7158D3D502C2BE4153ef39e2f819F0593E82C",
        97: "",
      },
      decimals: 18,
    },
    quoteToken: tokens.usdt,
    lpToken: [tokens.sig, tokens.usdt],
    isSingle: false,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "6",
    vaultAddress: {
      "97": "abc",
      "56": "0xd6f08a48d568E0d705ba21b10B935432107DcF1B",
    },
    earnToken: tokens.sig,
    token: {
      symbol: "BTN-USDT",
      address: {
        56: "0xb238008a89323827c008ef93e540e22c596947d5",
        97: "",
      },
      decimals: 18,
    },
    quoteToken: tokens.usdt,
    lpToken: [tokens.sig, tokens.usdt],
    isSingle: false,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "7",
    vaultAddress: {
      "97": "abc",
      "56": "0x2Ac3f07954A39Bfe4221d81022000008Fb67a47f",
    },
    earnToken: tokens.sig,
    token: {
      symbol: "BLC-USDT",
      address: {
        56: "0x89bd9E55b205F4e3fabFD2b168e09F8937A7E9d8",
        97: "",
      },
      decimals: 18,
    },
    quoteToken: tokens.usdt,
    lpToken: [tokens.sig, tokens.usdt],
    isSingle: false,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "1",
    vaultAddress: {
      "97": "abc",
      "56": "0x7c3934284EeAD0d5A9aa8628943d4C56065Eee5c",
    },
    earnToken: tokens.sig,
    token: tokens.sig,
    quoteToken: tokens.sig,
    isSingle: true,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "3",
    vaultAddress: {
      "97": "abc",
      "56": "0xf6004Cd133924F6aE63542EC6Cfcc15f6253c156",
    },
    earnToken: tokens.sig,
    token: {
      symbol: "BDS-WBNB",
      address: {
        56: "0x4B7Ba687A8d25184eA320FC73e2cd39Faaf3fA63",
        97: "",
      },
      decimals: 18,
    },
    quoteToken: tokens.wbnb,
    lpToken: [tokens.sig, tokens.wbnb],
    isSingle: false,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "4",
    vaultAddress: {
      "97": "abc",
      "56": "0xc802aB02165b3e98834C294A414Dc2f0E1B066E3",
    },
    earnToken: tokens.sig,
    token: tokens.sig,
    quoteToken: tokens.sig,
    isSingle: true,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
  {
    id: "5",
    vaultAddress: {
      "97": "abc",
      "56": "0xb22Ac34bCC875C90715Ec3C7e4073F002a0d1A42",
    },
    earnToken: tokens.sig,
    token: {
      symbol: "BTN-BDS",
      address: {
        56: "0xb32dd0ddd9376b1cea12d64a8466d46074a7fded",
        97: "",
      },
      decimals: 18,
    },
    quoteToken: tokens.sig,
    lpToken: [tokens.sig, tokens.sig],
    isSingle: false,
    withdrawFee: "1%",
    performanceFee: "6%",
    multiplier: "10x",
  },
];
