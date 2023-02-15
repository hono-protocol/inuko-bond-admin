import poolsConfig from "config/constants/pools";
import sousChefABI from "config/abi/sousChef.json";
import cakeABI from "config/abi/cake.json";
import multicall from "utils/multicall";
import { getAddress } from "utils/addressHelpers";
import BigNumber from "bignumber.js";

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.smartChef);
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "startBlock",
    };
  });
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "bonusEndBlock",
    };
  });

  const starts = await multicall(sousChefABI, callsStartBlock);
  const ends = await multicall(sousChefABI, callsEndBlock);

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index];
    const endBlock = ends[index];
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    };
  });
};

// export const fetchPools = async () => {
//   const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
//   const calls = nonBnbPools.map((poolConfig) => {
//     return {
//       address: getMasterChefAddress(),
//       name: 'poolInfo',
//       params: [poolConfig.sousId],
//     }
//   })
//   const poolsInfo = await multicall(masterchefABI, calls)
//   return nonBnbPools.map((p, index) => {
//     const info = poolsInfo[index]

//     const harvestInterval = new BigNumber(info.harvestInterval._hex)
//     const depositFeeBP = new BigNumber(info.depositFeeBP)
//     return {
//       sousId: p.sousId,
//       depositFeeBP: depositFeeBP.div(100).toString(),
//       harvestInterval: harvestInterval.div(60).div(60).toString(),
//     }
//   })
// }

export const fetchPoolsTotalStaking = async () => {
  const callsPools = poolsConfig.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: "balanceOf",
      params: [getAddress(poolConfig.contractAddress)],
    };
  });
  const totalStaked = await multicall(cakeABI, callsPools);
  return [
    ...poolsConfig.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(totalStaked[index]).toJSON(),
    })),
  ];
};
