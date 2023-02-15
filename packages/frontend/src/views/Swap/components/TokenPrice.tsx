import React from "react";
import { Box, Flex, Grid } from "@bds-libs/uikit";
import CurrencyLogo from "../../../components/Logo/CurrencyLogo";
import { useGetApiPrices, usePriceCakeBusd } from "../../../state/hooks";
import { formatNumber } from "../../../utils/formatBalance";
import { getAddress } from "utils/addressHelpers";
import tokens from "config/constants/tokens";

export interface TokenPriceProps {
  token: {
    symbol: string;
    address: {
      56: string;
      97: string;
    };
    decimals: number;
  };
}

function TokenPrice({ token }: TokenPriceProps) {
  const prices = useGetApiPrices();
  const tokenPrice = prices?.[getAddress(token.address).toLowerCase()];
  const bdsPrice = usePriceCakeBusd();
  const usdtPrice = prices?.[getAddress(tokens.usdt.address).toLowerCase()];

  return (
    <Box
      py="10px"
      px="24px"
      mt="10px"
      bg="#052D22"
      borderRadius="15px"
      display="flex"
      alignItems="center"
    >
      <Grid gridTemplateColumns="1fr 1fr 1fr" width="100%">
        <Flex alignItems="center">
          <Box position="relative" display="flex">
            <CurrencyLogo
              style={{
                zIndex: 2,
                position: "relative",
              }}
              size="32px"
              currency={token}
            />
          </Box>
          <Box
            as="p"
            ml="11px"
            fontSize="18px"
            lineHeight="24px"
            fontWeight="700"
            color="secondary"
            minWidth="60px"
          >
            {token.symbol}
          </Box>
        </Flex>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box textAlign="center">
            <Box
              display="block"
              as="strong"
              fontSize="18px"
              lineHeight="20px"
              fontWeight="700"
              color="#fff"
            >
              {formatNumber((tokenPrice * 1.0) / bdsPrice.toNumber(), 3)}
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="center">
          <Box textAlign="right">
            <Box
              display="block"
              as="strong"
              fontSize="18px"
              lineHeight="20px"
              fontWeight="700"
              color="#fff"
            >
              {formatNumber((tokenPrice * 1.0) / usdtPrice, 3)}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}

export default TokenPrice;
