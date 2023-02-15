import { Box, darkColors } from "@bds-libs/uikit";
import { TREASURY_WALLET } from "config/constants";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import {
  //   useGetAmount,
  //   useGetDistributorFunc,
  useGetSigTokenFunc,
} from "hooks/useTotalSupply";
import React from "react";
import { formatNumber } from "utils/formatBalance";

const DOCUMENT_LINK = "https://docs.inuko.finance";
// const STATUS = "Good";

const FirstIntroCard = () => {
  const { t } = useTranslation();
  //   const circulatingSupply = useGetAmount(
  //     createToken(tokens.sig),
  //     "totalSupply"
  //   );
  //   const totalDistributed = useGetDistributorFunc(
  //     createToken(tokens.usdt),
  //     "totalDistributed"
  //   );
  const usdtTreasury = useGetSigTokenFunc(
    createToken(tokens.usdt),
    "balanceOf",
    [TREASURY_WALLET]
  );

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
        mt="1rem"
      >
        <Box
          textAlign="center"
          lineHeight="30px"
          fontWeight={900}
          color="yellow"
          size="lg"
        >
          {t("Treasury Backing INUKO circulating supply")}
        </Box>
        <Box
          fontSize="25px"
          lineHeight="30px"
          textAlign="center"
          fontWeight={900}
          size="lg"
        >
          {tokens.usdt.symbol} {formatNumber(usdtTreasury?.toFixed(2))}
        </Box>
        {/* <Flex marginY="20px">
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("INUKO backing price")}
            </Box>
            <Box>
              $
              {formatNumber(
                new BigNumber(
                  new BigNumber(usdtTreasury?.toFixed(tokens.usdt.decimals))
                )
                  .dividedBy(
                    new BigNumber(
                      circulatingSupply?.toFixed(tokens.sig.decimals)
                    )
                  )
                  .toFixed(4),
                4
              )}
            </Box>
          </Box>
          <Box flex={1}>
            <Box color="textSubtle" fontWeight={900} marginBottom="5px">
              {t("Status")}
            </Box>
            <Box>{t(STATUS)}</Box>
          </Box>
        </Flex> */}
        <Box marginTop="3rem" textAlign="center">
          <Box
            color="black"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            marginBottom="5px"
          >
            <a href={DOCUMENT_LINK} rel="noreferrer noopener" target="_blank">
              {t("Learn more about our treasury")}
            </a>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FirstIntroCard;
