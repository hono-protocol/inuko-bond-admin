import { LinkStatus } from "./types";

export const status = {
  LIVE: <LinkStatus>{
    text: "LIVE",
    color: "failure",
  },
  SOON: <LinkStatus>{
    text: "SOON",
    color: "warning",
  },
  NEW: <LinkStatus>{
    text: "NEW",
    color: "success",
  },
};

export const links = [
  {
    label: "Home",
    icon: "HomeIcon",
    href: "/",
  },
  {
    label: "Trade",
    icon: "TradeIcon",
    items: [
      {
        label: "Exchange",
        href: window.origin,
      },
      {
        label: "Liquidity",
        href: window.origin,
      },
    ],
  },
  {
    label: "Farms",
    icon: "FarmIcon",
    href: "/farms",
    status: status.LIVE,
  },
  {
    label: "Pools",
    icon: "PoolIcon",
    href: "/syrup",
  },
  {
    label: "Lottery",
    icon: "TicketIcon",
    href: "/lottery",
  },
  {
    label: "IFO",
    icon: "IfoIcon",
    items: [
      {
        label: "Next",
        href: "/ifo",
      },
      {
        label: "History",
        href: "/ifo/history",
      },
    ],
  },
  {
    label: "More",
    icon: "MoreIcon",
    items: [
      {
        label: "Voting",
        href: "https://voting.becoswap.com",
      },
      {
        label: "Github",
        href: "https://github.com/becoswap",
      },
      {
        label: "Docs",
        href: "https://docs.becoswap.com",
      },
      {
        label: "Blog",
        href: "https://becoswap.medium.com",
      },
    ],
  },
];

export interface SocialLink {
  icon: string;
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
}

export const socials: SocialLink[] = [
  {
    label: "Facebook",
    icon: "FBIcon",
    href: "https://www.facebook.com/InukoFinance",
  },
  // {
  //   label: "Github",
  //   icon: "GithubIcon",
  //   href: "https://google.com",
  // },
  {
    label: "Medium",
    icon: "NewMediumIcon",
    href: "https://medium.com/@InukoFinance",
  },
  {
    label: "Telegram",
    icon: "NewTelegramIcon",
    href: "https://t.me/InukoFinance",
    // items: [
    //   {
    //     label: "English",
    //     href: "https://t.me/bigbdsglobal",
    //   },
    //   {
    //     label: "Vietnamese",
    //     href: "https://t.me/bigbds",
    //   },
    // ],
  },
  {
    label: "Twitter",
    icon: "NewTwitterIcon",
    href: "https://twitter.com/InukoFinance",
  },
];

export const MENU_MOBILE_HEIGHT = 40;
export const MENU_HEIGHT = 64;
export const MENU_ENTRY_HEIGHT = 48;
export const SIDEBAR_WIDTH_FULL = 240;
export const SIDEBAR_WIDTH_REDUCED = 56;
