import React from "react";
import { Box } from "@bds-libs/uikit";
import InfoCard from "./InfoCard";
import { useTranslation } from "../../../contexts/Localization";
import { useStatistics } from "../../../state/statistics/hooks";
import {
  useFarms,
  useGetApiPrices,
  usePriceCakeBusd,
} from "../../../state/hooks";
import { getAddress } from "../../../utils/addressHelpers";
import { BigNumber } from "bignumber.js";
import { formatNumber } from "../../../utils/formatBalance";

function InfoCardTVL() {
  const { t } = useTranslation();
  const { circulation } = useStatistics();
  const farms = useFarms();
  const prices = useGetApiPrices();
  let tvl = null;
  const price = usePriceCakeBusd();

  farms.data.forEach((farm) => {
    if (!farm.lpTotalInQuoteToken || !prices) {
      return;
    }

    const quoteTokenPriceUsd =
      prices[getAddress(farm.quoteToken.address).toLowerCase()];
    if (quoteTokenPriceUsd) {
      const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
        quoteTokenPriceUsd
      );
      if (totalLiquidity.toNumber()) {
        tvl += totalLiquidity.toNumber();
      }
    }
  });

  const tvlFormatted = tvl
    ? `${tvl.toLocaleString(undefined, { maximumFractionDigits: 3 })} USDT`
    : "-";

  return (
    <InfoCard>
      <Box
        fontWeight={700}
        textAlign="center"
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        {t("Total Value Locked")}
      </Box>
      <Box
        fontWeight={700}
        mt="10px"
        textAlign="center"
        as="p"
        color="primaryBright"
        fontSize="17px"
        lineHeight="22px"
      >
        {tvlFormatted}
      </Box>
      <Box
        fontWeight={700}
        mt="16px"
        textAlign="center"
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        CIRCULATING SUPPLY
      </Box>
      <Box
        fontWeight={700}
        mt="10px"
        textAlign="center"
        as="p"
        color="primaryBright"
        fontSize="17px"
        lineHeight="22px"
      >
        {formatNumber(circulation)} BDS
      </Box>
      <Box
        fontWeight={700}
        mt="16px"
        textAlign="center"
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        MARKET CAP
      </Box>
      <Box
        fontWeight={700}
        mt="10px"
        textAlign="center"
        as="p"
        color="primaryBright"
        fontSize="17px"
        lineHeight="22px"
      >
        {formatNumber(price.multipliedBy(circulation).toNumber())} USDT
      </Box>
    </InfoCard>
  );
}

export default InfoCardTVL;
