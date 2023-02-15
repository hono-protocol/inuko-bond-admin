import React from "react";
import { Box } from "@bds-libs/uikit";
import InfoCard from "./InfoCard";
import { useGetApiPrices } from "../../../state/hooks";
import { getAddress } from "../../../utils/addressHelpers";
import tokens from "../../../config/constants/tokens";
import { formatNumber } from "../../../utils/formatBalance";
import { useStatistics } from "../../../state/statistics/hooks";

function InfoCardPrice() {
  const prices = useGetApiPrices();

  const { usersBep20 } = useStatistics();

  const bdsPrice = prices?.[getAddress(tokens.sig.address).toLowerCase()] || 0;

  const bnbPrice = prices?.[getAddress(tokens.wbnb.address).toLowerCase()] || 0;

  const priceBDSBNB = Number(bdsPrice / bnbPrice).toFixed(3);

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
        BDS/USDT
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
        {formatNumber(bdsPrice, 3)}
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
        BDS/BNB
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
        {priceBDSBNB}
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
        HOLDERS
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
        {usersBep20}
      </Box>
    </InfoCard>
  );
}

export default InfoCardPrice;
