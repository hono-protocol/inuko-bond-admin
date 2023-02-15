import React, { useState } from "react";
import { Button, Box, Card, useModal, VipIcon } from "@bds-libs/uikit";
import { formatUnits } from "ethers/lib/utils";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { parseUnits } from "@ethersproject/units";
import { Currency } from "@pancakeswap/sdk";

import { formatNumber } from "../../../utils/formatBalance";
import { useTranslation } from "../../../contexts/Localization";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import { useContract } from "../../../hooks/useContract";
import vippoolABI from "../../../config/abi/vip_pool.json";
import erc20ABI from "../../../config/abi/erc20.json";
import multicall from "../../../utils/multicall";
import useBlockCountdown from "../../../hooks/useGetBlockCountdown";
import UnlockButton from "../../../components/UnlockButton";
import WithdrawModal from "./WithdrawModal";
import { CurrencyLogo } from "../../../components/Logo";
import { BASE_ADD_LIQUIDITY_URL, BLOCKS_PER_DAY } from "../../../config";
import { useGetApiPrices, usePriceCakeBusd } from "../../../state/hooks";
import { getAddress } from "../../../utils/addressHelpers";
import { VipPoolConfig } from "config/constants/types";
import ApyButton from "views/FarmsBDS/components/FarmCard/ApyButton";
import DetailsSection from "./DetailsSection";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import useToast from "hooks/useToast";
import { ethers } from "ethers";
import DepositModal from "./DepositModal";
import { getReferrer } from "hooks/useStake";
import { BIG_TEN } from "utils/bigNumber";
import { useLPPrice } from "usePrice";

export interface VipPoolCardProps {
  children?: React.ReactNode;
  data: VipPoolConfig;
}

const StyledButton = styled(Button)`
  background-color: #177358;
  color: #fff;
  flex: 1;
`;
const HighlightButton = styled(Button)`
  background-color: #ffae58;
  color: #052e22;
  width: 100%;
`;
const BodyWrapper = styled(Card)`
  background: transparent;
  flex: 0 0 100%;
  -moz-box-flex: 0;
  padding: 0 10px;
  padding-top: 10px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 0 0 50%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex: 0 0 25%;
  }
`;
const StyledApy = styled(ApyButton)`
  color: ${({ color }: { color: string }) => color};

  svg {
    fill: ${({ color }: { color: string }) => color};
  }
`;
const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;
const StyledExpandableSectionButton = styled(ExpandableSectionButton)`
  & > * {
    color: ${({ theme }) => theme.colors.secondary};
  }

  & svg {
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;
const StyledUnlock = styled(UnlockButton)`
  width: 100%;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

function useVipPool(props: {
  address: string;
  poolId: number;
  lpTokenAddress: string;
}) {
  const { address, poolId, lpTokenAddress } = props;
  const { toastError } = useToast();

  const [state, setState] = React.useState({
    lockOf: new BigNumber(0),
    pendingTokens: new BigNumber(0),
    total: new BigNumber(0),
    ratio: new BigNumber(0),
    lastRewardBlock: new BigNumber(0),
    minAmount: new BigNumber(0),
    poolSize: new BigNumber(0),
    allowance: new BigNumber(0),
    currentSize: new BigNumber(0),
    lpLockinPeriod: new BigNumber(0),
    balance: new BigNumber(0),
    canWithdraw: false,
  });

  const [isPending, setPending] = React.useState(false);

  const [isFetching, setIsFetching] = React.useState(true);

  const { account } = useActiveWeb3React();

  const timelockContract = useContract(address, vippoolABI, true);
  const bep20Contract = useContract(lpTokenAddress, erc20ABI, true);

  const handleHarvest = React.useCallback(async () => {
    if (timelockContract) {
      try {
        setPending(true);
        const tx = await timelockContract.harvest(poolId);
        await tx.wait();
      } catch (e) {
        // @ts-ignore
        toastError("Failed to harvest!", e.message);
        console.error(e);
      } finally {
        setPending(false);
      }
    }
  }, [timelockContract, poolId]);

  const handleApprove = React.useCallback(async () => {
    if (timelockContract) {
      try {
        setPending(true);
        const tx = await bep20Contract.approve(
          address,
          ethers.constants.MaxUint256
        );
        await tx.wait();
      } catch (e) {
        // @ts-ignore
        toastError("Failed to approve!", e.message);
        console.error(e);
      } finally {
        setPending(false);
      }
    }
  }, [timelockContract, poolId]);

  const handleWithdraw = React.useCallback(
    async (amount: string) => {
      if (timelockContract) {
        try {
          setPending(true);
          const tx = await timelockContract.withdraw(poolId, amount);
          await tx.wait();
        } catch (e) {
          // @ts-ignore
          toastError("Failed to withdraw!", e.message);
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    },
    [timelockContract, poolId]
  );

  const handleStake = React.useCallback(
    async (amount: string, decimals?: number) => {
      if (timelockContract) {
        try {
          const referrer = getReferrer();
          setPending(true);
          const tx = await timelockContract.deposit(
            poolId,
            new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed(0),
            referrer
          );
          await tx.wait();
        } catch (e) {
          // @ts-ignore
          toastError("Failed to stake!", e.message);
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    },
    [timelockContract, poolId]
  );

  const getData = React.useCallback(async () => {
    if (timelockContract) {
      if (account) {
        const r = await multicall(vippoolABI, [
          { address, name: "poolInfo", params: [poolId] },
          {
            address,
            name: "userInfo",
            params: [poolId, account],
          },
          {
            address,
            name: "pendingBEP20Token",
            params: [poolId, account],
          },
          {
            address,
            name: "canWithdraw",
            params: [poolId, account],
          },
        ]);
        const r2 = await multicall(erc20ABI, [
          {
            address: lpTokenAddress,
            name: "allowance",
            params: [account, address],
          },
          {
            address: lpTokenAddress,
            name: "balanceOf",
            params: [account],
          },
        ]);

        setIsFetching(false);
        setState((c) => {
          return {
            ...c,
            canWithdraw: r[3][0],
            total: r[1].amount,
            ratio: r[0].rewardbps,
            lockOf: r[1].amount,
            pendingTokens: r[2][0],
            minAmount: r[0].minAmount,
            poolSize: r[0].maxPoolAmount,
            currentSize: r[0].amount,
            lastRewardBlock: r[1].initBlock.add(r[0].lpLockinPeriod),
            lpLockinPeriod: r[0].lpLockinPeriod,
            allowance: r2[0][0],
            balance: r2[1][0],
          };
        });
      } else {
        const r = await multicall(vippoolABI, [
          { address, name: "poolInfo", params: [poolId] },
        ]);

        setIsFetching(false);
        setState((c) => {
          return {
            ...c,
            ratio: r[0].rewardbps,
            minAmount: r[0].minAmount,
            poolSize: r[0].maxPoolAmount,
            currentSize: r[0].amount,
            lpLockinPeriod: r[0].lpLockinPeriod,
          };
        });
      }
    }
  }, [account, timelockContract, address]);

  React.useEffect(() => {
    getData();
    const time = setInterval(() => {
      getData();
    }, 9000);

    return () => {
      clearInterval(time);
    };
  }, [account, timelockContract]);

  return {
    state,
    isPending,
    handleHarvest,
    handleWithdraw,
    handleApprove,
    handleStake,
    isFetching,
  };
}

const TEXT_COLOR = "rgb(155, 202, 187)";
const RATIO_DECIMALS = 15;

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return {
    d,
    h,
    m,
    s,
  };
}

function VipPoolCard({ data }: VipPoolCardProps) {
  const {
    pid,
    name,
    earnToken,
    isLP,
    lpToken,
    masterChefContract,
    token,
    quoteToken,
    highlight,
  } = data;
  const priceReward = usePriceCakeBusd();
  const { account } = useActiveWeb3React();
  const prices = useGetApiPrices();
  let priceInput = prices[getAddress(lpToken.address).toLowerCase()];
  const { price: priceCallLP } = useLPPrice(getAddress(lpToken.address));
  priceInput = isLP ? priceCallLP.toNumber() : priceInput;
  const earnPrice = prices[getAddress(earnToken.address).toLowerCase()];
  const { t } = useTranslation();
  const [showExpandableSection, setShowExpandableSection] = useState(false);
  const poolData = useVipPool({
    address: getAddress(masterChefContract),
    poolId: pid,
    lpTokenAddress: getAddress(lpToken.address),
  });

  const {
    isPending,
    handleHarvest,
    handleWithdraw,
    handleApprove,
    handleStake,
  } = poolData;
  const {
    lockOf,
    pendingTokens,
    total,
    ratio,
    lastRewardBlock,
    minAmount,
    poolSize,
    allowance,
    lpLockinPeriod,
    canWithdraw,
    currentSize,
    balance,
  } = poolData.state;

  const deposited = new BigNumber(lockOf.toString()).gt(0);
  const approved = new BigNumber(allowance.toString()).gt(0);

  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${getAddress(
    lpToken.address
  )}`;
  const s = useBlockCountdown(
    parseInt(formatUnits(lastRewardBlock.toString(), 0))
  );
  const dhms = secondsToDhms(s);

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      decimals={lpToken.decimals}
      max={new BigNumber(total.toString())}
      onConfirm={async (amount, decimals) => {
        await handleWithdraw(parseUnits(amount, decimals).toString());
      }}
      tokenName=""
    />
  );
  const [onPresentDeposit] = useModal(
    <DepositModal
      LPPrice={new BigNumber(priceInput)}
      decimals={lpToken.decimals}
      max={
        new BigNumber(
          Math.min(
            new BigNumber(poolSize.toString())
              .minus(new BigNumber(currentSize.toString()))
              .minus(new BigNumber(1))
              .toNumber(),
            new BigNumber(balance.toString()).toNumber()
          )
        )
      }
      subText={`${name.toUpperCase()}\nMin: ${formatNumber(
        formatUnits(minAmount.toString(), lpToken.decimals),
        8
      )} ${lpToken.symbol} (~${formatNumber(
        new BigNumber(formatUnits(minAmount.toString(), lpToken.decimals))
          .multipliedBy(new BigNumber(priceInput))
          .toString(),
        3
      )} USDT)`}
      min={new BigNumber(minAmount.toString())}
      onConfirm={handleStake}
      tokenName={lpToken.symbol}
      addLiquidityUrl={addLiquidityUrl}
    />
  );

  const perBlock = new BigNumber(ratio.toString())
    .multipliedBy(new BigNumber(10).pow(lpToken.decimals))
    .div(new BigNumber(10).pow(earnToken.decimals + RATIO_DECIMALS));
  const perDay = perBlock.multipliedBy(BLOCKS_PER_DAY.toString());
  const apr = perDay
    .multipliedBy(priceReward.toNumber() / priceInput)
    .multipliedBy(100 * 365);
  const lockPeriod = new BigNumber(lpLockinPeriod.toString()).div(
    BLOCKS_PER_DAY
  );

  const currentPoolSize = new BigNumber(
    formatUnits(currentSize.toString(), lpToken.decimals)
  );
  const totalValueFormatted = currentPoolSize.multipliedBy(priceInput);

  const renderActionBtn = () => {
    if (!account) {
      return <StyledUnlock />;
    }
    if (deposited) {
      return (
        <Button
          width="100%"
          onClick={onPresentWithdraw}
          disabled={!canWithdraw && s != 0}
        >
          {s !== 0 && (
            <Box>
              {t("Unlock")}
              {s !== 0 && (
                <Box ml="4px">{`${dhms.d} D : ${dhms.h} H : ${dhms.m} M`}</Box>
              )}
            </Box>
          )}
          {s == 0 && <Box>{t("Withdraw token")}</Box>}
        </Button>
      );
    }

    if (!approved) {
      return (
        <Button
          variant="action"
          width="100%"
          disabled={isPending}
          onClick={handleApprove}
        >
          {t("Approve Contract")}
        </Button>
      );
    }

    return (
      <HighlightButton onClick={onPresentDeposit} disabled={isPending}>
        {t("Deposit")}
      </HighlightButton>
    );
  };

  return (
    <BodyWrapper>
      <Box
        alignItems="center"
        overflow="hidden"
        borderRadius="16px"
        boxShadow="0px 2px 12px -8px rgb(25 19 38 / 10%), 0px 1px 1px rgb(25 19 38 / 5%)"
      >
        <Box
          display="flex"
          alignItems="center"
          width="100%"
          backgroundColor={highlight ? "#ffae58" : "rgba(5, 46, 34, 0.3)"}
          p="16px 16px 4px"
        >
          <Box width="60px">
            <VipIcon width="60px" color="#aaa" />
          </Box>
          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            mr="11px"
          >
            <Box
              color={highlight ? "rgb(5, 46, 34)" : "white"}
              fontSize="20px"
              mb="6px"
              fontWeight="bold"
            >
              {`${name.toUpperCase()} (${lpToken.symbol})`}
            </Box>
            <Box
              color={highlight ? "rgb(5, 46, 34)" : "white"}
              fontSize="17px"
              mb="2px"
              fontWeight="100"
            >
              {`Lock ${formatNumber(lockPeriod.toString(), 2)} days`}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              color={highlight ? "rgb(5, 46, 34)" : "#ffae58"}
              fontSize="17px"
              fontWeight="bold"
            >
              APR: {formatNumber(apr.toString(), 0)}%{" "}
              <StyledApy
                color={highlight ? "rgb(5, 46, 34)" : "#ffae58"}
                earnToken={earnToken}
                lpLabel={lpToken.symbol}
                addLiquidityUrl={isLP && addLiquidityUrl}
                earnPrice={earnPrice}
                apr={apr.toNumber()}
              />
            </Box>
          </Box>
          <Box>
            <Box position="relative" display="flex">
              {isLP ? (
                <>
                  <CurrencyLogo
                    style={{
                      zIndex: 2,
                      position: "relative",
                    }}
                    size="32px"
                    currency={token as Currency}
                  />
                  <CurrencyLogo
                    style={{
                      zIndex: 1,
                      position: "relative",
                      left: "-10px",
                    }}
                    size="32px"
                    currency={quoteToken as Currency}
                  />
                </>
              ) : (
                <CurrencyLogo size="32px" currency={lpToken as Currency} />
              )}
            </Box>
          </Box>
        </Box>
        <Box p="16px" backgroundColor="rgb(5, 46, 34)">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="10px"
          >
            <Box color={TEXT_COLOR} fontSize="15px" fontWeight="bold">
              Pool Size
            </Box>
            <Box color={TEXT_COLOR} fontSize="14px" fontWeight="100">
              {formatNumber(
                formatUnits(poolSize.toString(), lpToken.decimals),
                0
              )}{" "}
              {lpToken.symbol}
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="10px"
          >
            <Box color={TEXT_COLOR} fontSize="15px" fontWeight="bold">
              {t("Reward per day")}
            </Box>
            <Box color={TEXT_COLOR} fontSize="14px" fontWeight="100">
              1 {isLP ? "LP" : lpToken.symbol} :{" "}
              {formatNumber(perDay.toString(), 6)} {earnToken.symbol}
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            mb="20px"
          >
            <Box color={TEXT_COLOR} fontSize="15px" fontWeight="bold">
              {t("Min deposit")}
            </Box>
            <Box
              color={TEXT_COLOR}
              fontSize="14px"
              fontWeight="100"
              textAlign="right"
            >
              {formatNumber(
                formatUnits(minAmount.toString(), lpToken.decimals),
                8
              )}{" "}
              {lpToken.symbol}
              <br />
              <Box fontSize="14px" color="#ffae58" mt="4px">
                ~{" "}
                {formatNumber(
                  new BigNumber(
                    formatUnits(minAmount.toString(), lpToken.decimals)
                  )
                    .multipliedBy(new BigNumber(priceInput))
                    .toString(),
                  3
                )}{" "}
                USDT
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb="20px"
          >
            <Box display="flex" flexDirection="column" flex="1">
              <Box fontSize="15px" fontWeight="bold" color="#ffae58" mb="6px">
                {earnToken.symbol} {t("reward")}
              </Box>
              <Box fontSize="15px" fontWeight="bold" color="#fff" mb="2px">
                {formatNumber(
                  formatUnits(pendingTokens.toString(), earnToken.decimals),
                  6
                )}
              </Box>
              <Box fontSize="14px" color="#ffae58">
                ~{" "}
                {formatNumber(
                  new BigNumber(
                    formatUnits(pendingTokens.toString(), earnToken.decimals)
                  )
                    .multipliedBy(new BigNumber(earnPrice))
                    .toString(),
                  3
                )}{" "}
                USDT
              </Box>
            </Box>
            <StyledButton
              width="100%"
              disabled={!deposited || isPending}
              onClick={handleHarvest}
            >
              {t("Harvest")}
            </StyledButton>
          </Box>
          <Box
            textAlign="center"
            fontSize="15px"
            fontWeight="bold"
            color="#ffae58"
            mb="6px"
          >
            {lpToken.symbol} {t("Staked").toLowerCase()}
          </Box>
          <Box
            textAlign="center"
            display="flex"
            justifyContent="center"
            alignItems="center"
            fontSize="15px"
            fontWeight="bold"
            color="#ffae58"
            mb="20px"
          >
            <Box color="white" mr="12px">
              {formatNumber(
                formatUnits(lockOf.toString(), lpToken.decimals),
                6
              )}
            </Box>
            <Box color="#ffae58" fontWeight="100">
              (~{" "}
              {formatNumber(
                new BigNumber(formatUnits(lockOf.toString(), lpToken.decimals))
                  .multipliedBy(new BigNumber(priceInput))
                  .toString(),
                3
              )}{" "}
              USDT)
            </Box>
          </Box>
          {renderActionBtn()}
          <Box mt="25px">
            <StyledExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
            />
          </Box>
          <ExpandingWrapper expanded={showExpandableSection}>
            <DetailsSection
              removed={!isLP}
              bscScanAddress={`https://bscscan.com/address/${getAddress(
                lpToken.address
              )}`}
              infoAddress={`https://bscscan.com/address/${getAddress(
                lpToken.address
              )}`}
              totalValueFormatted={formatNumber(
                totalValueFormatted.toString(),
                3
              ).toString()}
              totalFormatted={formatNumber(
                currentPoolSize.toString(),
                3
              ).toString()}
              lpLabel={lpToken.symbol}
              addLiquidityUrl={addLiquidityUrl}
            />
          </ExpandingWrapper>
        </Box>
      </Box>
    </BodyWrapper>
  );
}

export default VipPoolCard;
