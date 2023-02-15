import BigNumber from "bignumber.js";
import { BIG_TEN } from "./bigNumber";

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount: BigNumber | string, decimals = 18) => {
  return new BigNumber(amount).times(BIG_TEN.pow(decimals));
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount.toString()).dividedBy(BIG_TEN.pow(decimals));
};

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance: BigNumber, decimals = 18) => {
  return getBalanceAmount(balance, decimals).toNumber();
};

export const getFullDisplayBalance: (
  balance: BigNumber,
  decimals?: number,
  decimalsToAppear?: number
) => string = (
  balance: BigNumber,
  decimals = 18,
  decimalsToAppear?: number
) => {
  return balance.dividedBy(BIG_TEN.pow(decimals)).toFixed(decimalsToAppear);
};

export const getBalance: (balance: BigNumber, decimals?: number) => BigNumber =
  (balance: BigNumber, decimals = 18) => {
    return balance.dividedBy(BIG_TEN.pow(decimals));
  };

export const formatNumber = (raw: number | string, fraction = 2) => {
  let input;
  if (typeof raw === "string") {
    try {
      input = parseFloat(raw) || 0;
    } catch (e) {
      input = 0;
    }
  } else {
    input = raw;
  }
  const result = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fraction,
  }).format(input);
  return result === "NaN" || !result ? 0 : result;
};
