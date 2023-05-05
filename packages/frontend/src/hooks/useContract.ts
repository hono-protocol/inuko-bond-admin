import {
  EXPIRY_SDA_ADDRESS,
  EXPIRY_TELLER_ADDRESS,
  TERM_SDA_ADDRESS,
  TERM_TELLER_ADDRESS,
} from "./../config/constants/index";
import { useMemo } from "react";
import { Contract } from "ethers";
import { WETH, ChainId } from "@pancakeswap/sdk";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getCakeVaultContract,
  getSouschefV2Contract,
  getLotteryV2Contract,
  getContract,
} from "utils/contractHelpers";
import { Address } from "../config/constants/types";
import useActiveWeb3React from "./useActiveWeb3React";
import ENS_PUBLIC_RESOLVER_ABI from "../config/abi/ens-public-resolver.json";
import ENS_ABI from "../config/abi/ens-registrar.json";
import { ERC20_ABI, ERC20_BYTES32_ABI } from "config/abi/erc20";
import SIG_TOKEN_ABI from "config/abi/sig_token.json";
import DISTRIBUTOR_ABI from "config/abi/distributor.json";
import BOND_ABI from "config/abi/bond_abi.json";
import INVERSE_BOND_ABI from "config/abi/inverse_bond.json";
import STAKING_ABI from "config/abi/staking_abi.json";
import WETH_ABI from "../config/abi/weth.json";
import EXPIRY_SDA_ABI from "../config/abi/expirySda.json";
import TERM_SDA_ABI from "../config/abi/termSda.json";
import TELLER_ABI from "../config/abi/teller_abi.json";
import TERM_TELLER_ABI from "../config/abi/term_teller_abi.json";
import {
  MULTICALL_ABI,
  MULTICALL_NETWORKS,
} from "../config/constants/multicall";
import {
  BOND_ADDRESS,
  DISTRIBUTOR_ADDRESS,
  INVERSE_BOND_ADDRESS,
  STAKING_ADDRESS,
} from "config/constants";

export const useIfoV1Contract = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getIfoV1Contract(address, library.getSigner()),
    [address, library]
  );
};

export const useIfoV2Contract = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getIfoV2Contract(address, library.getSigner()),
    [address, library]
  );
};

export const useERC20 = (address?: string) => {
  const { library } = useActiveWeb3React();

  return useMemo(
    () => !!address && getBep20Contract(address, library.getSigner()),
    [address, library]
  );
};

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getErc721Contract(address, library.getSigner()),
    [address, library]
  );
};

export const useCake = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getCakeContract(library.getSigner()), [library]);
};

export const useBunnyFactory = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getBunnyFactoryContract(library.getSigner()), [library]);
};

export const usePancakeRabbits = () => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getPancakeRabbitContract(library.getSigner()),
    [library]
  );
};

export const useProfile = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getProfileContract(library.getSigner()), [library]);
};

export const useLotteryV2Contract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getLotteryV2Contract(library.getSigner()), [library]);
};

export const useMasterchef = (add: Address) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getMasterchefContract(library.getSigner(), add),
    [library]
  );
};

export const useSousChef = (id) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getSouschefContract(id, library.getSigner()),
    [id, library]
  );
};

export const useSousChefV2 = (id) => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getSouschefV2Contract(id, library.getSigner()),
    [id, library]
  );
};

export const usePointCenterIfoContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getPointCenterIfoContract(library.getSigner()),
    [library]
  );
};

export const useBunnySpecialContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getBunnySpecialContract(library.getSigner()), [library]);
};

export const useClaimRefundContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getClaimRefundContract(library.getSigner()), [library]);
};

export const useTradingCompetitionContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(
    () => getTradingCompetitionContract(library.getSigner()),
    [library]
  );
};

export const useEasterNftContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getEasterNftContract(library.getSigner()), [library]);
};

export const useCakeVaultContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getCakeVaultContract(library.getSigner()), [library]);
};

// returns null on errors
export function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        ABI,
        address,
        account ? library.getSigner(account) : library
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export const getTokenContract = (address: string) => {
  return getContract(ERC20_ABI, address);
};

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useSigTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, SIG_TOKEN_ABI, withSignerIfPossible);
}

export function useDistributorContract(): Contract | null {
  return useContract(DISTRIBUTOR_ADDRESS, DISTRIBUTOR_ABI, true);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId ? WETH[chainId].address : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    // eslint-disable-next-line default-case
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
        address = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract() {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}

export function useBridgeContract(
  contractAddress: string,
  abi: any
): Contract | null {
  return useContract(contractAddress, abi, true);
}

export function useBondContract(): Contract | null {
  return useContract(BOND_ADDRESS, BOND_ABI, true);
}

export function useInverseBondContract(): Contract | null {
  return useContract(INVERSE_BOND_ADDRESS, INVERSE_BOND_ABI, true);
}

export function useStakingContract(): Contract | null {
  return useContract(STAKING_ADDRESS, STAKING_ABI, true);
}

export function useExpirySdaContract(): Contract | null {
  return useContract(EXPIRY_SDA_ADDRESS, EXPIRY_SDA_ABI, true);
}

export function useTermSdaContract(): Contract | null {
  return useContract(TERM_SDA_ADDRESS, TERM_SDA_ABI, true);
}

export function useExpiryTellerContract(): Contract | null {
  return useContract(EXPIRY_TELLER_ADDRESS, TELLER_ABI, true);
}

export function useTermTellerContract(): Contract | null {
  return useContract(TERM_TELLER_ADDRESS, TERM_TELLER_ABI, true);
}
