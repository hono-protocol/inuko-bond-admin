import React from "react";
import styled from "styled-components";
import { Modal, Text, LinkExternal, Flex, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import {
  tokenEarnedPerThousandDollarsCompounding,
  getRoi,
} from "utils/compoundApyHelpers";

interface ApyCalculatorModalProps {
  onDismiss?: () => void;
  tokenPrice: number;
  apr: number;
  linkLabel: string;
  linkHref: string;
  earningTokenSymbol?: string;
  roundingDecimals?: number;
  compoundFrequency?: number;
  performanceFee?: number;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`;

const GridItem = styled.div`
  margin-bottom: "10px";
`;

const ApyCalculatorModal: React.FC<ApyCalculatorModalProps> = ({
  onDismiss,
  tokenPrice,
  apr,
  linkLabel,
  linkHref,
  earningTokenSymbol = "BDS",
  roundingDecimals = 2,
  compoundFrequency = 1,
  performanceFee = 0,
}) => {
  const { t } = useTranslation();
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice;

  const tokenEarnedPerThousand1D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 1,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  });
  const tokenEarnedPerThousand7D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 7,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  });
  const tokenEarnedPerThousand30D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 30,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  });
  const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 365,
    farmApr: apr,
    tokenPrice,
    roundingDecimals,
    compoundFrequency,
    performanceFee,
  });

  return (
    <Modal title="ROI" onDismiss={onDismiss}>
      <Grid>
        <GridItem>
          <Text
            fontSize="12px"
            bold
            color="textSubtle"
            textTransform="uppercase"
            mb="20px"
          >
            {t("Timeframe")}
          </Text>
        </GridItem>
        <GridItem>
          <Text
            fontSize="12px"
            bold
            color="textSubtle"
            textTransform="uppercase"
            mb="20px"
          >
            {t("ROI")}
          </Text>
        </GridItem>
        <GridItem>
          <Text
            fontSize="12px"
            bold
            color="textSubtle"
            textTransform="uppercase"
            mb="20px"
          >
            {earningTokenSymbol} {t("per")} $1000
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text>1d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {getRoi({
              amountEarned: tokenEarnedPerThousand1D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{tokenEarnedPerThousand1D}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text>7d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {getRoi({
              amountEarned: tokenEarnedPerThousand7D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{tokenEarnedPerThousand7D}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text>30d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {getRoi({
              amountEarned: tokenEarnedPerThousand30D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{tokenEarnedPerThousand30D}</Text>
        </GridItem>
        {/* 365 day / APY row */}
        <GridItem>
          <Text>365d</Text>
        </GridItem>
        <GridItem>
          <Text>
            {getRoi({
              amountEarned: tokenEarnedPerThousand365D,
              amountInvested: oneThousandDollarsWorthOfToken,
            }).toFixed(roundingDecimals)}
            %
          </Text>
        </GridItem>
        <GridItem>
          <Text>{tokenEarnedPerThousand365D}</Text>
        </GridItem>
      </Grid>
      <Box mb="28px" maxWidth="280px">
        <Text fontSize="12px" color="textSubtle">
          {t(
            `Calculated based on current rates. Compounding %freq%x daily. Rates are estimates provided for your convenience only, and by no means represent guaranteed returns.`,
            { freq: compoundFrequency.toLocaleString() }
          )}
        </Text>
        {performanceFee > 0 && (
          <Text mt="14px" fontSize="12px" color="textSubtle">
            {t(
              `All estimated rates take into account this pool's %fee%% performance fee`,
              { fee: performanceFee }
            )}
          </Text>
        )}
      </Box>
      <Flex justifyContent="center">
        <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
      </Flex>
    </Modal>
  );
};

export default ApyCalculatorModal;
