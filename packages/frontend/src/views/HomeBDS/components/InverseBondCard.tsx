import { Box, darkColors, Flex } from "@bds-libs/uikit";
import { INVERSE_BOND_ADDRESS } from "config/constants";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import { useBalance } from "hooks/useTokenBalance";
import {
  useGetInverseBondAmountFunc,
  useGetInverseBondFunc,
} from "hooks/useTotalSupply";
import React from "react";
import { formatNumber } from "utils/formatBalance";

const InverseBondCard = () => {
  const { t } = useTranslation();
  const isActive = useGetInverseBondFunc("_isActive");
  const upperCap = useGetInverseBondAmountFunc(
    createToken(tokens.usdt),
    "upperCap"
  );
  const lowerCap = useGetInverseBondAmountFunc(
    createToken(tokens.usdt),
    "lowerCap"
  );
  const balanceOf = useBalance(
    createToken(tokens.usdt),
    [INVERSE_BOND_ADDRESS],
    true
  );
  const profit = useGetInverseBondFunc("profit");

  return (
    <Box
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
      borderRadius="16px"
      background={darkColors.white}
      height="280px"
    >
      <Box
        py="32px"
        px="22px"
        backgroundPosition="right top"
        backgroundSize="initial"
        backgroundRepeat="no-repeat"
        color={darkColors.black}
      >
        <Box textAlign="center" fontWeight={900} color="textSubtle" size="lg">
          {t("Inverse Bond status")}
        </Box>
        <Box
          mt="5px"
          mb="10px"
          textAlign="center"
          fontWeight={900}
          className="fade-in"
        >
          {isActive ? t("Open") : t("Closed")}
        </Box>
        <Flex mb="10px">
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" fontWeight="bold">
              {t("Opens at")}
            </Box>
            <Box mt="5px" className="fade-in">
              {tokens.usdt.symbol} {formatNumber(upperCap?.toFixed(2))}
            </Box>
          </Box>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" fontWeight="bold">
              {t("Closes at")}
            </Box>
            <Box mt="5px" className="fade-in">
              {tokens.usdt.symbol} {formatNumber(lowerCap?.toFixed(2))}
            </Box>
          </Box>
        </Flex>
        <Box flex="1" textAlign="center" mb="10px">
          <Box color="textSubtle" fontWeight="bold">
            {t("Inverse Bond pool")}
          </Box>
          <Box mt="5px" className="fade-in">
            {tokens.usdt.symbol} {formatNumber(balanceOf?.toFixed(2))}
          </Box>
        </Box>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" fontWeight="bold">
            {t("Inverse Bond premium")}
          </Box>
          <Box mt="5px" className="fade-in">
            {profit?.toNumber() / 100 - 100}%
          </Box>
        </Box>
        <Box flex="1" textAlign="center" mt="2rem">
          <Box
            style={{ textDecoration: "underline" }}
            fontSize="0.8rem"
            as="a"
            href="https://docs.inuko.finance/tokenomics/bonds/inverse-bonding"
            target="_blank"
          >
            {t("Learn more about inverse bond")}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InverseBondCard;
