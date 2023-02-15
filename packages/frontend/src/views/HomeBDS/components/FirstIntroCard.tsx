import { Box, darkColors, Flex } from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
import { BURN_ADDRESS, LOCKED_LP_WALLET } from "config/constants";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import { useBalance } from "hooks/useTokenBalance";
import {
  useGetAmount,
  useGetDistributorFunc,
  useGetSigTokenFunc,
} from "hooks/useTotalSupply";
import React from "react";
import { useGetApiPrice } from "state/hooks";
import { getAddress } from "utils/addressHelpers";
import { formatNumber } from "utils/formatBalance";

const taxRates = [
  {
    label: "Reflections",
    value: 6,
  },
  {
    label: "Liquidity",
    value: 1,
  },
  {
    label: "Buy back",
    value: 1,
  },
  {
    label: "Bonds",
    value: 1.5,
  },
  {
    label: "Treasury",
    value: 1.5,
  },
  {
    label: "Marketing",
    value: 1,
  },
];

const FirstIntroCard = () => {
  const { t } = useTranslation();
  const circulatingSupply = useGetAmount(
    createToken(tokens.sig),
    "totalSupply"
  );
  const actualSupply = useGetAmount(
    createToken(tokens.sig),
    "getCirculatingSupply"
  );
  const totalDistributed = useGetDistributorFunc(
    createToken(tokens.usdt),
    "totalDistributed"
  );
  const burned = useGetSigTokenFunc(createToken(tokens.sig), "balanceOf", [
    BURN_ADDRESS,
  ]);
  const lockedLP = useBalance(createToken(tokens.lpSigBusd), [
    LOCKED_LP_WALLET,
  ]);
  const maxTxAmount = useGetAmount(createToken(tokens.sig), "_maxTxAmount");
  const price = new BigNumber(useGetApiPrice(getAddress(tokens.sig.address)));

  return (
    <Box
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
      borderRadius="16px"
      background={darkColors.white}
    >
      <Box
        py="32px"
        px="22px"
        backgroundPosition="right top"
        backgroundSize="initial"
        backgroundRepeat="no-repeat"
        color={darkColors.black}
        className="fade-in"
      >
        <Box
          textAlign="center"
          lineHeight="30px"
          fontWeight={900}
          color="yellow"
          size="lg"
        >
          {t("Amount of reflection paid out to date")}
        </Box>
        <Box
          fontSize="25px"
          lineHeight="30px"
          textAlign="center"
          fontWeight={900}
          size="lg"
        >
          {tokens.usdt.symbol} {formatNumber(totalDistributed?.toFixed(2))}
        </Box>
        <Flex marginY="20px">
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("INUKO market cap")}
            </Box>
            <Box>
              $
              {formatNumber(
                new BigNumber(
                  new BigNumber(circulatingSupply?.toFixed(8))
                    .minus(new BigNumber(burned?.toFixed(8)))
                    .toFixed(8)
                )
                  .multipliedBy(price)
                  .toFixed(0),
                0
              )}
            </Box>
          </Box>
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("INUKO Price")}
            </Box>
            <Box>${formatNumber(price.toFixed(18), 6)}</Box>
          </Box>
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("INUKO circulating supply")}
            </Box>
            <Box>
              {formatNumber(actualSupply?.toFixed(2))} /{" "}
              {formatNumber(circulatingSupply?.toFixed(2) || 0)}
            </Box>
          </Box>
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("Locked LP")}
            </Box>
            <Box>{formatNumber(lockedLP?.toFixed(18), 4)} LP</Box>
          </Box>
        </Flex>
        <Box marginBottom="20px">
          <Box color="textSubtle" fontWeight={900} marginBottom="5px">
            {t("Tax rates")}
          </Box>
          <Flex flexWrap="wrap">
            {taxRates.map((o) => {
              return (
                <Box marginRight="30px" mb="5px">
                  {o.value}% {t(o.label)}
                </Box>
              );
            })}
          </Flex>
        </Box>
        <Box marginBottom="20px">
          <Box color="textSubtle" fontWeight={900} marginBottom="5px">
            {t("Maximum amount of INUKO allowed per transaction")}
          </Box>
          <Box>{formatNumber(maxTxAmount?.toFixed(4), 4)}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FirstIntroCard;
