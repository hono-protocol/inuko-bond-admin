import React from "react";
import styled from "styled-components";
import { Modal, Text, LinkExternal, Flex } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

interface AprCalculatorModalProps {
  onDismiss?: () => void;
  tokenPrice: number;
  apr: number;
  linkLabel: string;
  linkHref: string;
  earningTokenSymbol?: string;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, auto);
  margin-bottom: 24px;
`;

const GridItem = styled.div`
  margin-bottom: "10px";
  padding-right: 16px;
`;

const AprCalculatorModal: React.FC<AprCalculatorModalProps> = ({
  onDismiss,
  tokenPrice,
  apr,
  linkLabel,
  linkHref,
  earningTokenSymbol = "BDS",
}) => {
  const { t } = useTranslation();

  const roi = {
    "1d": apr >= 0 ? apr / 365 : 0,
    "7d": apr >= 0 ? (apr / 365) * 7 : 0,
    "30d": apr >= 0 ? (apr / 365) * 30 : 0,
  };

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
            {earningTokenSymbol} {t("per")} 1000 USDT
          </Text>
        </GridItem>
        {/* 1 day row */}
        <GridItem>
          <Text>1d</Text>
        </GridItem>
        <GridItem>
          <Text>{roi["1d"].toFixed(2)}%</Text>
        </GridItem>
        <GridItem>
          <Text>{(((1000 / tokenPrice) * roi["1d"]) / 100).toFixed(2)}</Text>
        </GridItem>
        {/* 7 day row */}
        <GridItem>
          <Text>7d</Text>
        </GridItem>
        <GridItem>
          <Text>{roi["7d"].toFixed(2)}%</Text>
        </GridItem>
        <GridItem>
          <Text>{(((1000 / tokenPrice) * roi["7d"]) / 100).toFixed(2)}</Text>
        </GridItem>
        {/* 30 day row */}
        <GridItem>
          <Text>30d</Text>
        </GridItem>
        <GridItem>
          <Text>{roi["30d"].toFixed(2)}%</Text>
        </GridItem>
        <GridItem>
          <Text>{(((1000 / tokenPrice) * roi["30d"]) / 100).toFixed(2)}</Text>
        </GridItem>
        {/* 365 day / Apr row */}
        <GridItem>
          <Text>365d</Text>
        </GridItem>
        <GridItem>
          <Text>{apr.toFixed(2)}%</Text>
        </GridItem>
        <GridItem>
          <Text>{(((1000 / tokenPrice) * apr) / 100).toFixed(2)}</Text>
        </GridItem>
      </Grid>
      {!!linkHref && (
        <Flex justifyContent="center">
          <LinkExternal href={linkHref}>{linkLabel}</LinkExternal>
        </Flex>
      )}
    </Modal>
  );
};

export default AprCalculatorModal;
