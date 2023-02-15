import React from "react";
import { Button, Box, Card, useModal } from "@bds-libs/uikit";
import { formatNumber } from "../../../utils/formatBalance";
import { formatUnits } from "ethers/lib/utils";
import { useTranslation } from "../../../contexts/Localization";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import { useContract } from "../../../hooks/useContract";
import timelockABI from "../../../config/abi/poollock.json";
import multicall from "../../../utils/multicall";
import QuestionHelper from "../../../components/QuestionHelper";
import useBlockCountdown from "../../../hooks/useGetBlockCountdown";
import UnlockButton from "../../../components/UnlockButton";
import format from "date-fns/format";
import addSeconds from "date-fns/addSeconds";
import WithdrawModal from "./WithdrawModal";
import { parseUnits } from "@ethersproject/units";
import { CurrencyLogo } from "../../../components/Logo";
import { BDS } from "../../../config/constants/tokens";
import { ChainId, Token } from "@pancakeswap/sdk";
import { BLOCKS_PER_DAY } from "../../../config";
import { useGetApiPrices, usePriceCakeBusd } from "../../../state/hooks";

export interface TimeLockCardProps {
  children?: React.ReactNode;
  address: string;
  pooId: number;
  tokenSymbol: string;
  tokenAddress: string;
  tokenDecimal: number;
}

const StyledButton = styled(Button)`
  background-color: #ffae58;
  color: #052e22;
`;

const BodyWrapper = styled(Card)`
  background: transparent;
  flex: 0 0 100%;
  -moz-box-flex: 0;
  padding-left: 10px;
  padding-top: 10px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 0 0 50%;
  }
`;

const Body = styled(Card)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: ${({ theme }) => {
    return theme.colors.background;
  }};
  border-radius: 15px;
`;

enum PoolType {
  FOREVER,
  BLOCK,
}

function useTimeLock(props: { address: string; pooId: number }) {
  const { address, pooId } = props;

  const [state, setState] = React.useState({
    lockOf: new BigNumber(0),
    pendingTokens: new BigNumber(0),
    total: new BigNumber(0),
    perDay: new BigNumber(0),
    lastRewardBlock: new BigNumber(0),
    type: PoolType.FOREVER,
    canWithdraw: false,
    unlocked: false,
  });

  const [isPending, setPending] = React.useState(false);

  const [isFetching, setIsFetching] = React.useState(true);

  const { t } = useTranslation();

  const { account } = useActiveWeb3React();

  const timelockContract = useContract(address, timelockABI, true);

  const handleHarvest = React.useCallback(async () => {
    if (timelockContract) {
      try {
        setPending(true);
        const tx = await timelockContract.harvest(pooId);
        await tx.wait();
      } catch (e) {
        console.error(e);
      } finally {
        setPending(false);
      }
    }
  }, [timelockContract, pooId]);

  const handleWithdraw = React.useCallback(
    async (amount: string) => {
      if (timelockContract) {
        try {
          setPending(true);
          const tx = await timelockContract.withdraw(pooId, amount);
          await tx.wait();
        } catch (e) {
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    },
    [timelockContract, pooId]
  );

  const getData = React.useCallback(() => {
    if (timelockContract && account) {
      multicall(timelockABI, [
        { address, name: "poolInfo", params: [pooId] },
        {
          address,
          name: "userInfo",
          params: [pooId, account],
        },
        {
          address,
          name: "pendingBEP20Token",
          params: [pooId, account],
        },
        {
          address,
          name: "canWithdraw",
          params: [pooId, account],
        },
      ]).then((r) => {
        setIsFetching(false);
        setState((c) => {
          return {
            ...c,
            canWithdraw: r[3][0],
            total: r[1].amount,
            perDay: r[0].rewardbps,
            lockOf: r[2],
            lastRewardBlock: r[0].lastRewardBlock,
            unlocked: r[1].unlocked,
            type:
              formatUnits(r[0].lastRewardBlock.toString(), 0) === "999999999999"
                ? PoolType.FOREVER
                : PoolType.BLOCK,
          };
        });
      });
    }
  }, [account, timelockContract, address]);

  React.useEffect(() => {
    getData();
    const time = setInterval(() => {
      getData();
    }, 6000);

    return () => {
      clearInterval(time);
    };
  }, [account, timelockContract]);

  return {
    state,
    isPending,
    handleHarvest,
    handleWithdraw,
    isFetching,
  };
}

const StyledUnlock = styled(UnlockButton)`
  width: 100%;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const BDS_DECIMAL = 8;

function TimeLockCard(props: TimeLockCardProps) {
  const { address, pooId, tokenAddress, tokenSymbol, tokenDecimal } = props;
  const priceReward = usePriceCakeBusd();
  const { account } = useActiveWeb3React();
  const prices = useGetApiPrices();
  const priceInput = prices[tokenAddress.toLowerCase()];
  const { t } = useTranslation();

  const data = useTimeLock({
    address,
    pooId,
  });

  const { isPending, handleHarvest, isFetching, handleWithdraw } = data;
  const {
    lockOf,
    perDay,
    total,
    canWithdraw,
    lastRewardBlock,
    type,
    unlocked,
  } = data.state;

  const s = useBlockCountdown(
    type === PoolType.FOREVER
      ? 0
      : parseInt(formatUnits(lastRewardBlock.toString(), 0))
  );

  const currentTimeToUnlock = addSeconds(new Date(0), s);

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      decimals={tokenDecimal}
      max={new BigNumber(total.toString())}
      onConfirm={async (amount, decimals) => {
        await handleWithdraw(parseUnits(amount, decimals).toString());
      }}
      tokenName=""
    />
  );

  const ratio = new BigNumber(perDay.toString())
    .multipliedBy(BLOCKS_PER_DAY.toString())
    .toString();

  const apr = new BigNumber(formatUnits(ratio, 12))
    .multipliedBy(new BigNumber(10).pow(tokenDecimal))
    .div(new BigNumber(10).pow(BDS_DECIMAL))
    .multipliedBy(priceReward.toNumber() / priceInput)
    .multipliedBy(100 * 365);

  if (!account || new BigNumber(total.toString()).eq(0)) {
    return <></>;
  }

  return (
    <BodyWrapper>
      <Body>
        <Box
          display="flex"
          alignItems="center"
          color="textSubtle"
          fontSize="24px"
          fontWeight="700"
        >
          <Box display="flex" alignItems="center">
            <Box mr="11px">
              <Box position="relative" display="flex">
                <CurrencyLogo
                  style={{
                    zIndex: 2,
                    position: "relative",
                  }}
                  size="32px"
                  currency={BDS[ChainId.MAINNET]}
                />
                <CurrencyLogo
                  style={{
                    zIndex: 1,
                    position: "relative",
                    left: "-10px",
                  }}
                  size="32px"
                  currency={new Token(56, tokenAddress, 18, tokenSymbol)}
                />
              </Box>
            </Box>
          </Box>
          <Box ml="0" fontSize="24px" fontWeight="900">
            {t("Lock %symbol% earn BDS", {
              symbol: tokenSymbol,
            })}
          </Box>
          <Box
            display="flex"
            minWidth="30px"
            fontSize="12px"
            ml="auto"
            bg="primary"
            color="#fff"
            p="8px"
            borderRadius="16px"
          >
            {formatNumber(apr.toString())}%
          </Box>
        </Box>
        <Box mt="20px" border="1px solid #9BCABB" />
        <Box
          mt="12px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total Token block")}
          <Box ml="auto" as="strong" color="primaryBright" fontWeight={700}>
            {formatNumber(formatUnits(total.toString(), tokenDecimal), 3)}
          </Box>
        </Box>
        <Box
          mt="8px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Daily bonus rate", {
            symbol: "BDS",
          })}
          <Box ml="auto" as="strong" color="primaryBright" fontWeight={700}>
            1 {tokenSymbol} : {formatNumber(formatUnits(ratio, 12), 5)} BDS
          </Box>
        </Box>
        <Box mt="20px" border="1px solid #9BCABB" />
        <Box
          mt="12px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Bonus available", {
            symbol: "BDS",
          })}
          <Box ml="auto" as="strong" color="textSubtle" fontWeight={700}>
            {formatNumber(formatUnits(lockOf.toString(), BDS_DECIMAL), 3)} BDS
          </Box>
        </Box>
        {!account && (
          <Box mt="20px">
            <StyledUnlock />
          </Box>
        )}
        {account && (
          <>
            {!isFetching && (
              <Box>
                <Box mt="20px">
                  <StyledButton
                    width="100%"
                    disabled={
                      new BigNumber(lockOf.toString()).eq(0) || isPending
                    }
                    onClick={handleHarvest}
                  >
                    {t("Withdraw bonus BDS")}
                  </StyledButton>
                </Box>
                <Box mt="20px">
                  {type !== PoolType.FOREVER && (
                    <Button
                      width="100%"
                      onClick={onPresentWithdraw}
                      disabled={!canWithdraw && s != 0}
                    >
                      {s !== 0 && (
                        <Box>
                          {t("Unlock")}
                          {s !== 0 && (
                            <Box ml="4px">
                              {Math.floor(s / (3600 * 24))} D :
                              {format(currentTimeToUnlock, " HH 'H' : mm 'M'")}
                            </Box>
                          )}
                        </Box>
                      )}
                      {s == 0 && <Box>{t("Withdraw token")}</Box>}
                    </Button>
                  )}
                  {type === PoolType.FOREVER && (
                    <Button
                      width="100%"
                      onClick={onPresentWithdraw}
                      disabled={!unlocked}
                    >
                      <>
                        {unlocked && t("Withdraw")}
                        {!unlocked && (
                          <>
                            {t("Unlock")}
                            {type === PoolType.FOREVER && (
                              <Box>
                                <QuestionHelper
                                  zIndex={1000}
                                  position="relative"
                                  text={
                                    <Box
                                      fontSize="14px"
                                      fontWeight="500"
                                      width="200px"
                                      zIndex={1000}
                                      position="relative"
                                    >
                                      {t(
                                        "This is a conditional unlock token, please contact support to unlock it"
                                      )}
                                    </Box>
                                  }
                                  ml="4px"
                                />
                              </Box>
                            )}
                          </>
                        )}
                      </>
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Body>
    </BodyWrapper>
  );
}

export default TimeLockCard;
