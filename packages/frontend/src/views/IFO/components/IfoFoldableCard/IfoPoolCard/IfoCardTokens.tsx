import React from "react";
import {
  Box,
  Button,
  CheckmarkCircleIcon,
  Flex,
  FlexProps,
  Skeleton,
  Text,
} from "@bds-libs/uikit";
import { IfoVipPoolInfo, Token, VipIfo } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import { formatNumber, getBalanceNumber } from "utils/formatBalance";
import { SkeletonCardTokens } from "./Skeletons";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import UnlockButton from "components/UnlockButton";
import ContributeButton from "./ContributeButton";
import ClaimButton from "./ClaimButton";
import Timer from "../Timer";
import getTimePeriods from "utils/getTimePeriods";

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token;
  secondaryToken?: Token;
}

const TokenSection: React.FC<TokenSectionProps> = ({ children, ...props }) => {
  return (
    <Flex {...props}>
      {/*{renderTokenComponent()}*/}
      {children}
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

const StyledUnlock = styled(UnlockButton)`
  width: 100%;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export interface FooterEntryProps {
  label: string;
  value: string | number;
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small color="#9BCABB">
        {label}
      </Text>
      {value ? (
        <Text fontWeight={900} color="#9BCABB" small textAlign="right">
          {typeof value === "number" ? formatNumber(value, 7) : value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  );
};

interface IfoCardTokensProps {
  ifo: VipIfo;
  poolConfig: IfoVipPoolInfo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
  isLoading: boolean;
  onApprove: () => Promise<any>;
  totalLPCommitted: BigNumber;
  refundingAmountInLP: BigNumber;
  amountTokenCommittedInLP: BigNumber;
  limitPerUserInLP: BigNumber;
  offeringAmountInToken: BigNumber;
  approved: boolean;
  isPending: boolean;
  hasClaimed: boolean;
  raisingAmountPool: BigNumber;
  offeringAmountPool: BigNumber;
  canDeposit: boolean;
}

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
  ifo,
  poolConfig,
  publicIfoData,
  isLoading,
  onApprove,
  totalLPCommitted,
  approved,
  isPending,
  hasClaimed,
  refundingAmountInLP,
  amountTokenCommittedInLP,
  limitPerUserInLP,
  offeringAmountInToken,
  raisingAmountPool,
  offeringAmountPool,
  canDeposit,
}) => {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const maxLpTokens = getBalanceNumber(
    limitPerUserInLP,
    poolConfig.lpToken.decimals
  );
  const raisingAmount = getBalanceNumber(
    raisingAmountPool,
    poolConfig.lpToken.decimals
  );
  const offeringAmount = getBalanceNumber(
    offeringAmountPool,
    ifo.token.decimals
  );
  const totalLPCommittedDisplay = getBalanceNumber(
    totalLPCommitted,
    poolConfig.lpToken.decimals
  );
  const priceInLP = (raisingAmount * 1.0) / offeringAmount;

  const renderButton = () => {
    if (!account) {
      return <StyledUnlock />;
    }

    if (publicIfoData.status === "finished") {
      if (amountTokenCommittedInLP.isEqualTo(0)) {
        return (
          <Flex flexDirection="column" alignItems="center">
            <Text color="#9BCABB">
              {t("You didn’t participate in this sale!")}
            </Text>
          </Flex>
        );
      }

      return (
        <ClaimButton
          ifo={ifo}
          poolConfig={poolConfig}
          hasClaimed={hasClaimed}
          offeringAmountInToken={offeringAmountInToken}
          refundingAmountInLP={refundingAmountInLP}
        />
      );
    }

    if (!canDeposit) {
      return (
        <Button
          variant="action"
          width="100%"
          onClick={() => (window.location.href = "/vip-pools")}
          style={{ textTransform: "none" }}
        >
          {t("You haven't deposited in VIP Pool. Do it!")}
        </Button>
      );
    }

    if (!approved) {
      return (
        <Button
          variant="action"
          width="100%"
          disabled={isPending}
          onClick={onApprove}
        >
          {t("Approve Contract")}
        </Button>
      );
    }

    if (publicIfoData.status === "coming_soon") {
      const { status, secondsUntilStart, secondsUntilEnd, startBlockNum } =
        publicIfoData;
      const countdownToUse =
        status === "coming_soon" ? secondsUntilStart : secondsUntilEnd;
      const timeUntil = getTimePeriods(countdownToUse);

      return (
        <Button
          variant="action"
          width="100%"
          disabled={true}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text color="gray">
            {t("Open")}:
            {t("%day%d %hour%h %minute%m", {
              day: timeUntil.days,
              hour: timeUntil.hours,
              minute: timeUntil.minutes,
            })}
          </Text>
        </Button>
      );
    }

    if (publicIfoData.status === "live") {
      return (
        <ContributeButton
          ifo={ifo}
          poolConfig={poolConfig}
          publicIfoData={publicIfoData}
          isPending={isPending}
          amountTokenCommittedInLP={amountTokenCommittedInLP}
          limitPerUserInLP={limitPerUserInLP}
        />
      );
    }
  };

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />;
    }
    return (
      <>
        <TokenSection justifyContent="space-between">
          <Label>
            {t("Price")} {ifo.token.symbol}
          </Label>
          <Label>
            {formatNumber(priceInLP, 3)} {poolConfig.lpToken.symbol}
          </Label>
        </TokenSection>
        <TokenSection justifyContent="space-between">
          <Label>{t("Total staked")}</Label>
          <Label>
            {formatNumber(totalLPCommittedDisplay, 3)}{" "}
            {poolConfig.lpToken.symbol} (
            {formatNumber((totalLPCommittedDisplay * 100.0) / raisingAmount, 2)}
            %)
          </Label>
        </TokenSection>
        {publicIfoData.status === "live" && (
          <>
            <TokenSection mt="1rem" justifyContent="space-between">
              <Label color="white">{t("Your commit")}</Label>
              <Label color="white">
                {formatNumber(
                  getBalanceNumber(
                    amountTokenCommittedInLP,
                    poolConfig.lpToken.decimals
                  ),
                  3
                )}{" "}
                {poolConfig.lpToken.symbol} (
                {formatNumber(
                  (getBalanceNumber(
                    amountTokenCommittedInLP,
                    poolConfig.lpToken.decimals
                  ) *
                    100.0) /
                    totalLPCommittedDisplay,
                  2
                )}
                %)
              </Label>
            </TokenSection>
            <TokenSection justifyContent="space-between">
              <Label color="white">{t("Token IVO receive")}</Label>
              <Label color="white">
                {formatNumber(
                  getBalanceNumber(offeringAmountInToken, ifo.token.decimals),
                  3
                )}{" "}
                {ifo.token.symbol}
              </Label>
            </TokenSection>
          </>
        )}
        {publicIfoData.status === "finished" && (
          <>
            <TokenSection mt="1rem" justifyContent="space-between">
              <Label color="white">{t("Refunding")}</Label>
              <Label color="white">
                {formatNumber(
                  getBalanceNumber(
                    refundingAmountInLP,
                    poolConfig.lpToken.decimals
                  ),
                  3
                )}{" "}
                {poolConfig.lpToken.symbol}
              </Label>
            </TokenSection>
            <TokenSection justifyContent="space-between">
              <Label color="white">{t("Token IVO receive")}</Label>
              <Label color="white">
                {formatNumber(
                  getBalanceNumber(offeringAmountInToken, ifo.token.decimals),
                  3
                )}{" "}
                {ifo.token.symbol}
              </Label>
            </TokenSection>
          </>
        )}
        <Box m="0.5rem 0">{renderButton()}</Box>
        <FooterEntry
          label={t("Total Sale")}
          value={`${formatNumber(offeringAmount)} ${ifo.token.symbol}`}
        />
        <FooterEntry
          label={t("Funds to raise")}
          value={`${formatNumber(raisingAmount)} ${poolConfig.lpToken.symbol}`}
        />
        <FooterEntry
          label={t("Max entry")}
          value={`${formatNumber(maxLpTokens, 7)} ${poolConfig.lpToken.symbol}`}
        />
        <FooterEntry
          label={`${t("Fee burn")} (${poolConfig.burnRatio * 100}%)`}
          value={`${formatNumber(raisingAmount * poolConfig.burnRatio)} ${
            poolConfig.lpToken.symbol
          }`}
        />
      </>
    );
  };
  return <Box pb="8px">{renderTokenSection()}</Box>;
};

export default IfoCardTokens;
