import { BigNumber } from "@ethersproject/bignumber";
import { Token, TokenAmount } from "@pancakeswap/sdk";
import {
  useBondContract,
  useDistributorContract,
  useInverseBondContract,
  useSigTokenContract,
  useStakingContract,
  useTokenContract,
} from "./useContract";
import { NEVER_RELOAD, useSingleCallResult } from "../state/multicall/hooks";

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, "totalSupply")
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
}

export const useGetAmount = (
  token: Token,
  functionName: string,
  params?: string[],
  reload = false
) => {
  const contract = useSigTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(
    contract,
    functionName,
    params,
    !reload ? NEVER_RELOAD : undefined
  )?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
};

export const useGetSigTokenFunc = (
  token: Token,
  functionName: string,
  params?: string[]
) => {
  const contract = useSigTokenContract(token?.address, false);

  const totalSupply = useSingleCallResult(
    contract,
    functionName,
    params,
    NEVER_RELOAD
  )?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
};

export const useGetDistributorFunc = (
  token: Token,
  func: string,
  params?: string[],
  reload = NEVER_RELOAD
) => {
  const contract = useDistributorContract();

  const totalSupply = useSingleCallResult(contract, func, params, reload)
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
};

export const useGetDistributorNormalFunc = (
  func: string,
  params?: string[],
  reload = false
) => {
  const contract = useDistributorContract();

  const val = useSingleCallResult(
    contract,
    func,
    params,
    !reload ? NEVER_RELOAD : undefined
  )?.result;

  return val;
};

export const useGetBondAmountFunc = (
  token: Token,
  func: string,
  params?: string[]
) => {
  const contract = useBondContract();
  const totalSupply = useSingleCallResult(contract, func, params, NEVER_RELOAD)
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
};

export const useGetInverseBondAmountFunc = (
  token: Token,
  func: string,
  params?: string[]
) => {
  const contract = useInverseBondContract();
  const totalSupply = useSingleCallResult(contract, func, params, NEVER_RELOAD)
    ?.result?.[0];

  return token && totalSupply
    ? new TokenAmount(token, totalSupply.toString())
    : undefined;
};

export const useGetBondFunc = (func: string, params?: string[]) => {
  const contract = useBondContract();
  const val = useSingleCallResult(contract, func, params, NEVER_RELOAD)
    ?.result?.[0];

  return val;
};

export const useGetInverseBondFunc = (func: string, params?: string[]) => {
  const contract = useInverseBondContract();
  const val = useSingleCallResult(contract, func, params, NEVER_RELOAD)
    ?.result?.[0];

  return val;
};

export const useGetStakingFunc = (func: string, params?: string[]) => {
  const contract = useStakingContract();
  const val = useSingleCallResult(contract, func, params, NEVER_RELOAD)
    ?.result?.[0];

  return val;
};

export const useGetStakingNormFunc = (
  func: string,
  params?: string[],
  reload = false
) => {
  const contract = useStakingContract();
  const val = useSingleCallResult(
    contract,
    func,
    params,
    !reload ? NEVER_RELOAD : undefined
  )?.result;

  return val;
};

export default useTotalSupply;
