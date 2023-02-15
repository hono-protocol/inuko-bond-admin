import tokens from "./tokens";
import { VipIfo } from "./types";

const ifos: VipIfo[] = [
  {
    id: "1",
    address: "0xaab5386D63255Ac142A20e3A0BC625F30E5A5826",
    isActive: true,
    name: "Big Lao Cai",
    pools: [
      {
        pid: 0,
        name: "Holder",
        condition: "Deposited Pool HOLDER",
        isLP: false,
        lpToken: tokens.usdt,
        saleAmount: 50000,
        raiseAmount: 30000,
        highlight: false,
        burnRatio: 0.1, // 0-1 range
      },
      {
        pid: 1,
        name: "Vip 1",
        condition: "Deposited Pool VIP 1",
        isLP: false,
        lpToken: tokens.sig,
        saleAmount: 50000,
        raiseAmount: 30000,
        highlight: true,
        burnRatio: 0.1, // 0-1 range
      },
      {
        pid: 2,
        name: "Vip 2",
        condition: "Deposited Pool VIP 2",
        isLP: false,
        lpToken: tokens.sig,
        saleAmount: 50000,
        raiseAmount: 30000,
        highlight: true,
        burnRatio: 0.1, // 0-1 range
      },
      {
        pid: 3,
        name: "Vip 3",
        condition: "Deposited Pool VIP 3",
        isLP: false,
        lpToken: tokens.sig,
        saleAmount: 50000,
        raiseAmount: 30000,
        highlight: true,
        burnRatio: 0.1, // 0-1 range
      },
    ],
    token: {
      symbol: "BLC",
      address: {
        56: "0x15ac0a5240eded9c4b62112342dd808d59f88675",
        97: "0x15ac0a5240eded9c4b62112342dd808d59f88675",
      },
      decimals: 8,
    },
    releaseBlockNumber: 17707736,
    campaignId: "511110000",
    lpAmount: 1000000,
    articleUrl: "https://bigbds.io/blc.html",
    title: "Big Lao Cai Office & Hotel Building - BLC",
    bgUrl:
      "http://bigbds.io/assets/images/projects/lao-cai-blc/project-exterior1.jpg",
    logoUrl: "/images/tokens/0x15aC0a5240EDEd9c4B62112342dd808d59F88675.png",
  },
];

export default ifos;
