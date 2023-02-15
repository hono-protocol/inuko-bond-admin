import React, { useState } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { Flex, Text, Skeleton, Box } from "@bds-libs/uikit";
import { Farm } from "state/types";
import { provider as ProviderType } from "web3-core";
import { useTranslation } from "contexts/Localization";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import DetailsSection from "./DetailsSection";
import CardHeading from "./CardHeading";
import CardActionsContainer from "./CardActionsContainer";
import ApyButton from "./ApyButton";
import StyledCardHeader from "../StyledCardHeader";
import ExpandedFooter from "./CardFooter";
import { formatNumber } from "../../../../utils/formatBalance";

export interface FarmWithStakedValue extends Farm {
  apr?: number;
  liquidity?: BigNumber;
}

// const RainbowLight = keyframes`
// 	0% {
// 		background-position: 0% 50%;
// 	}
// 	50% {
// 		background-position: 100% 50%;
// 	}
// 	100% {
// 		background-position: 0% 50%;
// 	}
// `;

// const StyledCardAccent = styled.div`
//   background: linear-gradient(
//     45deg,
//     rgba(255, 0, 0, 1) 0%,
//     rgba(255, 154, 0, 1) 10%,
//     rgba(208, 222, 33, 1) 20%,
//     rgba(79, 220, 74, 1) 30%,
//     rgba(63, 218, 216, 1) 40%,
//     rgba(47, 201, 226, 1) 50%,
//     rgba(28, 127, 238, 1) 60%,
//     rgba(95, 21, 242, 1) 70%,
//     rgba(186, 12, 248, 1) 80%,
//     rgba(251, 7, 217, 1) 90%,
//     rgba(255, 0, 0, 1) 100%
//   );
//   background-size: 300% 300%;
//   animation: ${RainbowLight} 2s linear infinite;
//   border-radius: 32px;
//   filter: blur(6px);
//   position: absolute;
//   top: -2px;
//   right: -2px;
//   bottom: -2px;
//   left: -2px;
//   z-index: -1;
// `;

const FCard = styled.div`
  align-self: baseline;
  background: #052e22;
  border-radius: 16px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1),
    0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 16px;
  position: relative;
  text-align: center;
`;

function countDown(time: number) {
  const distance = time - Date.now();
  const _second = 1000;
  const _minute = _second * 60;
  const _hour = _minute * 60;
  const _day = _hour * 24;

  if (distance > 0) {
    const days = Math.floor(distance / _day);
    const hours = Math.floor((distance % _day) / _hour);
    const minutes = Math.floor((distance % _hour) / _minute);
    const seconds = Math.floor((distance % _minute) / _second);
    return {
      isFinished: false,
      days,
      hours,
      minutes,
      seconds,
    };
  } else {
    return {
      isFinished: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
}

function useCountDown(time?: number) {
  const [state, setState] = React.useState({
    isFinished: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  React.useEffect(() => {
    const current = countDown(time);
    let interval;
    setState(current);

    if (!current.isFinished) {
      interval = setInterval(() => {
        setState(countDown(time));
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return state;
}

function formatCountDown(count: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  function formatDigit(digit: number) {
    return digit < 10 ? `0${digit}` : digit;
  }

  return {
    days: formatDigit(count.days),
    hours: formatDigit(count.hours),
    minutes: formatDigit(count.minutes),
    seconds: formatDigit(count.seconds),
  };
}

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

const StyledApy = styled(ApyButton)`
  color: ${({ theme }) => theme.colors.textSubtle};

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const StyledExpandableSectionButton = styled(ExpandableSectionButton)`
  & > * {
    color: ${({ theme }) => theme.colors.secondary};
  }

  & svg {
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;

interface FarmCardProps {
  isPool?: boolean;
  farm: FarmWithStakedValue;
  removed: boolean;
  earnPrice?: number;
  provider?: ProviderType;
  account?: string;
}

const FarmCard: React.FC<FarmCardProps> = ({
  isPool,
  farm,
  removed,
  earnPrice,
  account,
}) => {
  const { t } = useTranslation();
  const [showExpandableSection, setShowExpandableSection] = useState(false);

  // We assume the token name is coin pair + lp e.g. BECO-BNB LP, LINK-BNB LP,
  // NAR-BECO LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = farm.lpSymbol.split(" ")[0].toLocaleLowerCase();
  //console.log(farm.liquidity.toNumber());
  const totalValueFormatted = farm.liquidity
    ? `${farm.liquidity.toFormat(4).toLocaleString()} USDT`
    : "-";

  const lpLabel =
    farm.lpSymbol && farm.lpSymbol.toUpperCase().replace("PANCAKE", "");
  const earnLabel = farm.earnToken.symbol || "BDS";

  const farmAPR =
    farm.apr && farm.apr.toLocaleString("en-US", { maximumFractionDigits: 2 });
  const depositFee = farm.depositFeeBP || 0;

  const lpAddress = farm.lpAddresses[process.env.REACT_APP_CHAIN_ID];

  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${lpAddress}`;

  const countdown = useCountDown(farm.openAt);

  const formattedDigitCountDown = formatCountDown(countdown);

  return (
    <FCard>
      {farm.multiplier === "0X" && (
        <Text color="textSubtle" textAlign="center">
          {t("Farm is testing and will close soon.")}
          <br />
          {t("Please do NOT deposit!!!")}
        </Text>
      )}
      {!isPool && (
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={farm.isCommunity}
          farmImage={farmImage}
          tokenSymbol={farm.token.symbol}
          quoteToken={farm.quoteToken}
          token={farm.token}
        />
      )}
      {isPool && (
        <StyledCardHeader
          name={farm.name}
          bgImg={farm.bgImg}
          multiplier={farm.multiplier}
          earningToken={farm.earnToken}
          stakingToken={farm.token}
          url={farm.url}
        />
      )}
      {!removed && (
        <Flex justifyContent="space-between" alignItems="center">
          <Text
            color="textSubtle"
            fontSize="17px"
            lineHeight="24px"
            fontWeight="400"
          >
            {t("APR")}:
          </Text>
          <Text
            color="textSubtle"
            fontSize="17px"
            lineHeight="24px"
            fontWeight="900"
            style={{ display: "flex", alignItems: "center" }}
          >
            {farm.apr ? (
              <>
                <StyledApy
                  earnToken={farm.earnToken}
                  lpLabel={lpLabel}
                  addLiquidityUrl={addLiquidityUrl}
                  earnPrice={earnPrice}
                  apr={farm.apr}
                />
                {farmAPR}%
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
          </Text>
        </Flex>
      )}
      {!isPool && (
        <React.Fragment>
          <Flex justifyContent="space-between">
            <Text
              color="primaryBright"
              fontSize="17px"
              lineHeight="24px"
              fontWeight="400"
            >
              {t("Earn")}:
            </Text>
            <Text
              color="primaryBright"
              fontSize="17px"
              lineHeight="24px"
              fontWeight="400"
              bold
            >
              {earnLabel}
            </Text>
          </Flex>
        </React.Fragment>
      )}
      <Flex justifyContent="space-between">
        <Text
          color="primaryBright"
          fontSize="17px"
          lineHeight="24px"
          fontWeight="400"
        >
          {farm.earnToken.symbol} {t("per day")}:
        </Text>
        <Text
          color="primaryBright"
          fontSize="17px"
          lineHeight="24px"
          fontWeight="900"
        >
          {formatNumber(
            new BigNumber(farm.poolWeight)
              .multipliedBy(farm.perBlock)
              .multipliedBy(20 * 60 * 24)
              .toString()
          )}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text
          color="primaryBright"
          fontSize="17px"
          lineHeight="24px"
          fontWeight="400"
        >
          {t("Withdraw Fee")}:
        </Text>
        <Text
          color="primaryBright"
          fontSize="17px"
          lineHeight="24px"
          fontWeight="900"
        >
          {depositFee}%
        </Text>
      </Flex>
      <Text
        color="primaryBright"
        fontSize="12px"
        lineHeight="24px"
        fontWeight="400"
        textAlign="left"
      >
        {t("The fee will be used to buy and burn BDS token")}.
      </Text>
      {!countdown.isFinished && (
        <Flex justifyContent="space-between">
          <Text>{t("Open in")}:</Text>
          <Text bold>
            {formattedDigitCountDown.days}d-
            {formattedDigitCountDown.hours}h-
            {formattedDigitCountDown.minutes}m-
            {formattedDigitCountDown.seconds}s
          </Text>
        </Flex>
      )}
      <CardActionsContainer
        disableHarvest={!countdown.isFinished}
        farm={farm}
        account={account}
        addLiquidityUrl={addLiquidityUrl}
      />

      <Box mt="25px">
        <StyledExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
      </Box>
      {isPool && (
        <ExpandingWrapper expanded={showExpandableSection}>
          <ExpandedFooter
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            depositFee={depositFee}
            stakingTokenSymbol={farm.token.symbol}
            totalValue={formatNumber(
              farm.lpTotalInQuoteToken?.toString() || 0,
              5
            ).toString()}
            projectLink={farm.token.projectLink}
            contractAddress={farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}
          />
        </ExpandingWrapper>
      )}
      {!isPool && (
        <ExpandingWrapper expanded={showExpandableSection}>
          <DetailsSection
            removed={removed}
            bscScanAddress={`https://bscscan.com/address/${
              farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
            }`}
            infoAddress={`https://bscscan.com/address/${lpAddress}`}
            totalValueFormatted={totalValueFormatted}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
          />
        </ExpandingWrapper>
      )}
    </FCard>
  );
};

export default FarmCard;
