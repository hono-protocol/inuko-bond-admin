import { useEffect, useState, useCallback } from "react";
import { BSC_BLOCK_TIME } from "config";
import { IfoStatus, VipIfo } from "config/constants/types";
import { useBlock } from "state/block/hooks";
import useRefresh from "hooks/useRefresh";
import { multicallv2 } from "utils/multicall";
import ifoVipAbi from "config/abi/vip_ifo.json";
import { BIG_ZERO } from "utils/bigNumber";
import { getStatus } from "../helpers";
import { PublicIfoData } from "views/Ifos/types";

// https://github.com/pancakeswap/pancake-contracts/blob/master/projects/ifo/contracts/IFOV2.sol#L431
// 1,000,000,000 / 100
const TAX_PRECISION = 10000000000;

/**
 * Gets all public data of an IFO
 */

const useGetPublicVipIfoData = (ifo: VipIfo): PublicIfoData => {
  const { address, releaseBlockNumber } = ifo;
  const { fastRefresh } = useRefresh();

  const [state, setState] = useState({
    status: "idle" as IfoStatus,
    blocksRemaining: 0,
    secondsUntilStart: 0,
    progress: 5,
    secondsUntilEnd: 0,
    poolBasic: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    poolUnlimited: {
      raisingAmountPool: BIG_ZERO,
      offeringAmountPool: BIG_ZERO,
      limitPerUserInLP: BIG_ZERO,
      taxRate: 0,
      totalAmountPool: BIG_ZERO,
      sumTaxesOverflow: BIG_ZERO,
    },
    startBlockNum: 0,
    endBlockNum: 0,
    numberPoints: 0,
  });
  const { currentBlock } = useBlock();
  const fetchIfoData = useCallback(async () => {
    const ifoCalls = [
      {
        address,
        name: "startBlock",
      },
      {
        address,
        name: "endBlock",
      },
    ];

    const [startBlock, endBlock] = await multicallv2(ifoVipAbi, ifoCalls);

    const startBlockNum = startBlock ? startBlock[0].toNumber() : 0;
    const endBlockNum = endBlock ? endBlock[0].toNumber() : 0;

    const status = getStatus(currentBlock, startBlockNum, endBlockNum);
    const totalBlocks = endBlockNum - startBlockNum;
    const blocksRemaining = endBlockNum - currentBlock;

    // Calculate the total progress until finished or until start
    const progress =
      currentBlock > startBlockNum
        ? ((currentBlock - startBlockNum) / totalBlocks) * 100
        : ((currentBlock - releaseBlockNumber) /
            (startBlockNum - releaseBlockNumber)) *
          100;

    setState((prev) => ({
      ...prev,
      secondsUntilEnd: blocksRemaining * BSC_BLOCK_TIME,
      secondsUntilStart: (startBlockNum - currentBlock) * BSC_BLOCK_TIME,
      status,
      progress,
      blocksRemaining,
      startBlockNum,
      endBlockNum,
    }));
  }, [address, currentBlock, releaseBlockNumber]);

  useEffect(() => {
    fetchIfoData();
  }, [fetchIfoData, fastRefresh]);

  return { ...state, fetchIfoData };
};

export default useGetPublicVipIfoData;
