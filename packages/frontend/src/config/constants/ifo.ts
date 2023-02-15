import { Ifo } from "./types";

const ifos: Ifo[] = [
  {
    id: "1",
    address: "0x0e5785C1B27b5c8D77FC2bE193E4dD3a6463b38E",
    isActive: false,
    name: "Big Tay Ninh",
    lpName: "BDS-USDT",
    poolBasic: {
      saleAmount: "50,000",
      raiseAmount: "30,000 USDT",
      cakeToBurn: "3,000 USDT",
      distributionRatio: 0.25,
    },
    poolUnlimited: {
      saleAmount: "200,000",
      raiseAmount: "120,000 USDT",
      cakeToBurn: "12,000 USDT",
      distributionRatio: 0.75,
    },
    currency: {
      symbol: "BDS-USDT",
      address: {
        "56": "0x0aa7158d3d502c2be4153ef39e2f819f0593e82c",
        "97": "0x0aa7158d3d502c2be4153ef39e2f819f0593e82c",
      },
      decimals: 18,
    },
    currencyIsLP: true,
    token: {
      symbol: "BTN",
      address: {
        56: "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
        97: "0x030ce78aa5be014976bca9b8448e78d1d87fce0b",
      },
      decimals: 8,
    },
    releaseBlockNumber: 7707736,
    campaignId: "511110000",
    articleUrl: "https://bigbds.io/btn.html",
    tokenOfferingPrice: 0.6,
    version: 2,
    title: "Big Tay Ninh housing - BTN",
    bgUrl: "/images/itos/test.jpg",
    logoUrl: "/images/itos/tokens/btn.png",
    lpAmount: "0.00000288",
    lpPriceDisplay: "~0.6 USDT = ~0.624 BDS",
  },
];

export default ifos;
