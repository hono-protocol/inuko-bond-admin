import addresses from "config/constants/contracts";
import tokens from "config/constants/tokens";
import { Address } from "config/constants/types";

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56;
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

// @todo contract
export const getCakeAddress = () => {
  return getAddress(tokens.sig.address);
};
export const getMasterChefAddress = (address: Address) => {
  return getAddress(address);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};
export const getWbnbAddress = () => {
  return getAddress(tokens.wbnb.address);
};
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery);
};
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT);
};
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile);
};
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits);
};
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory);
};
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund);
};
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo);
};
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial);
};
export const getTradingCompetitionAddress = () => {
  return getAddress(addresses.tradingCompetition);
};
export const getEasterNftAddress = () => {
  return getAddress(addresses.easterNft);
};
export const getCakeVaultAddress = () => {
  return getAddress(addresses.cakeVault);
};
export const getPredictionsAddress = () => {
  return getAddress(addresses.predictions);
};
export const getReferralsAddress = () => {
  return getAddress(addresses.referrals);
};
export const getLotteryV2Address = () => {
  return getAddress(addresses.lotteryV2);
};
