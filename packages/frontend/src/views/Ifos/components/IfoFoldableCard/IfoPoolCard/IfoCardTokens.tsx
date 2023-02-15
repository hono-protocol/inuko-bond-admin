import React from "react";
import {
  AutoRenewIcon,
  Box,
  Button,
  CheckmarkCircleIcon,
  Flex,
  FlexProps,
  HelpIcon,
  Text,
  useTooltip,
} from "@bds-libs/uikit";
import { Ifo, PoolIds, Token } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import { formatNumber, getBalanceNumber } from "utils/formatBalance";
import { EnableStatus } from "../types";
import PercentageOfTotal from "./PercentageOfTotal";
import { SkeletonCardTokens } from "./Skeletons";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token;
  secondaryToken?: Token;
}

const TokenSection: React.FC<TokenSectionProps> = ({ children, ...props }) => {
  return (
    <Flex {...props}>
      {/*{renderTokenComponent()}*/}
      <div>{children}</div>
    </Flex>
  );
};

const Label = (props) => (
  <Text
    bold
    fontSize="12px"
    color="secondary"
    textTransform="uppercase"
    {...props}
  />
);

const Value = (props) => (
  <Text bold fontSize="20px" style={{ wordBreak: "break-all" }} {...props} />
);

interface IfoCardTokensProps {
  poolId: PoolIds;
  ifo: Ifo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
  hasProfile: boolean;
  isLoading: boolean;
  onApprove: () => Promise<any>;
  enableStatus: EnableStatus;
}

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
  onApprove,
  enableStatus,
}) => {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      "Sorry, you didn’t contribute enough LP tokens to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your LP tokens."
    ),
    { placement: "bottom" }
  );

  const publicPoolCharacteristics = publicIfoData[poolId];
  const userPoolCharacteristics = walletIfoData[poolId];

  const { currency, token } = ifo;
  const { hasClaimed } = userPoolCharacteristics;
  const distributionRatio = ifo[poolId].distributionRatio * 100;

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />;
    }
    if (account && !hasProfile) {
      if (publicIfoData.status === "finished") {
        return (
          <Text textAlign="center">
            {t("Activate PancakeSwap Profile to take part in next IFO‘s!")}
          </Text>
        );
      }
      return (
        <Text textAlign="center">
          {t("You need an active PancakeSwap Profile to take part in an IFO!")}
        </Text>
      );
    }
    if (publicIfoData.status === "coming_soon") {
      return (
        <>
          <TokenSection>
            <Label>{t("On sale")}</Label>
            <Value>{ifo[poolId].saleAmount}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">
            {t("%ratio%% of total sale", {
              ratio: formatNumber(distributionRatio, 2),
            })}
          </Text>
          {enableStatus !== EnableStatus.ENABLED && account && (
            <Button
              width="100%"
              mt="16px"
              onClick={onApprove}
              isLoading={enableStatus === EnableStatus.IS_ENABLING}
              endIcon={
                enableStatus === EnableStatus.IS_ENABLING ? (
                  <AutoRenewIcon spin color="currentColor" />
                ) : null
              }
            >
              {t("Enable")}
            </Button>
          )}
        </>
      );
    }
    if (publicIfoData.status === "live") {
      return (
        <>
          {!account && (
            <Box>
              <Box
                color="#9BCABB"
                fontSize="20px"
                lineHeight="23px"
                fontWeight="900"
                textAlign="center"
                style={{
                  textTransform: "uppercase",
                }}
              >
                {t("On sale")}
              </Box>
              <Box
                fontWeight="700"
                mt="8px"
                textAlign="center"
                color="#fff"
                fontSize="35px"
                lineHeight="41px"
                style={{
                  textTransform: "uppercase",
                }}
              >
                {ifo[poolId].saleAmount} {ifo.token.symbol}
              </Box>
            </Box>
          )}
          {account && (
            <Box>
              <Box mb="8px">
                <Box
                  textAlign="center"
                  fontSize="15px"
                  lineHeight="24px"
                  color="#9BCABB"
                  fontWeight="500"
                >
                  {t("Your %symbol% committed", { symbol: currency.symbol })}
                </Box>
                <Box
                  mt="6px"
                  fontSize="20px"
                  lineHeight="24px"
                  color="#fff"
                  fontWeight="900"
                  textAlign="center"
                >
                  {formatNumber(
                    getBalanceNumber(
                      userPoolCharacteristics.amountTokenCommittedInLP,
                      currency.decimals
                    ),
                    6
                  )}{" "}
                  (~
                  {formatNumber(
                    publicIfoData.currencyPriceInUSD
                      .multipliedBy(
                        getBalanceNumber(
                          userPoolCharacteristics.amountTokenCommittedInLP,
                          currency.decimals
                        )
                      )
                      .toString(),
                    3
                  )}{" "}
                  USDT)
                </Box>
                <PercentageOfTotal
                  textAlign="center"
                  userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
                  totalAmount={publicPoolCharacteristics.totalAmountPool}
                />
              </Box>
              <Box display="flex">
                <Box
                  fontSize="15px"
                  lineHeight="24px"
                  color="#9BCABB"
                  fontWeight="500"
                  style={{
                    textTransform: "uppercase",
                  }}
                >
                  {t("%symbol% to receive", { symbol: token.symbol })}
                </Box>
                <Box
                  fontSize="20px"
                  lineHeight="24px"
                  color="#fff"
                  fontWeight="900"
                  ml="auto"
                >
                  {getBalanceNumber(
                    userPoolCharacteristics.offeringAmountInToken,
                    token.decimals
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </>
      );
    }
    if (publicIfoData.status === "finished") {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <Text color="#9BCABB">
            {t("You didn’t participate in this sale!")}
          </Text>
        </Flex>
      ) : (
        <>
          <Box mb="8px">
            <Box>
              <Box
                textAlign="center"
                fontSize="15px"
                lineHeight="24px"
                color="#9BCABB"
                fontWeight="500"
              >
                {t(
                  hasClaimed
                    ? "Your %symbol% RECLAIMED"
                    : "Your %symbol% TO RECLAIM",
                  { symbol: currency.symbol }
                )}
              </Box>
              <Box
                mt="6px"
                fontSize="20px"
                lineHeight="24px"
                color="#fff"
                fontWeight="900"
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {formatNumber(
                  getBalanceNumber(
                    userPoolCharacteristics.refundingAmountInLP,
                    currency.decimals
                  ),
                  6
                )}{" "}
                (~
                {formatNumber(
                  publicIfoData.currencyPriceInUSD
                    .multipliedBy(
                      getBalanceNumber(
                        userPoolCharacteristics.refundingAmountInLP,
                        currency.decimals
                      )
                    )
                    .toString(),
                  3
                )}{" "}
                USDT)
                {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
              </Box>
            </Box>
          </Box>
          <Box display="flex">
            <Box
              fontSize="15px"
              lineHeight="24px"
              color="#9BCABB"
              fontWeight="500"
              style={{
                textTransform: "uppercase",
              }}
            >
              {" "}
              {t(hasClaimed ? "%symbol% received" : "%symbol% to receive", {
                symbol: token.symbol,
              })}
            </Box>
            <Box
              fontSize="20px"
              lineHeight="24px"
              color="#fff"
              fontWeight="900"
              ml="auto"
            >
              <Box display="flex">
                {formatNumber(
                  getBalanceNumber(
                    userPoolCharacteristics.offeringAmountInToken,
                    token.decimals
                  ),
                  3
                )}{" "}
                / {ifo[poolId].saleAmount}
                {!hasClaimed &&
                  userPoolCharacteristics.offeringAmountInToken.isEqualTo(
                    0
                  ) && (
                    <div
                      ref={targetRef}
                      style={{ display: "flex", marginLeft: "8px" }}
                    >
                      <HelpIcon />
                    </div>
                  )}
                {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
              </Box>
            </Box>
          </Box>
        </>
      );
    }
    return null;
  };
  return (
    <Box pb="8px">
      {tooltipVisible && tooltip}
      {renderTokenSection()}
    </Box>
  );
};

export default IfoCardTokens;
