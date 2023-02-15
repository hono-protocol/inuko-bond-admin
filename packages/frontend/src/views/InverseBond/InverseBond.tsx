import { Box, darkColors, Flex, useModal } from "@bds-libs/uikit";
import React from "react";

import Page from "components/layout/Page";
import { useTranslation } from "contexts/Localization";
import {
  useGetInverseBondAmountFunc,
  useGetInverseBondFunc,
} from "hooks/useTotalSupply";
import tokens, { createToken } from "config/constants/tokens";
import { INVERSE_BOND_ADDRESS } from "config/constants";
import { formatNumber } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import { useGetApiPrice } from "state/hooks";
import { getAddress } from "utils/addressHelpers";
import InverseBondActionContainer from "./InverseBondActionContainer";
import InverseBondModal from "./InverseBondModal";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBalance } from "hooks/useTokenBalance";

const InverseBond = () => {
  const { t } = useTranslation();
  const balanceOf = useBalance(createToken(tokens.usdt), [
    INVERSE_BOND_ADDRESS,
  ]);
  const price = new BigNumber(useGetApiPrice(getAddress(tokens.sig.address)));
  const profit = useGetInverseBondFunc("profit");
  // const profit = new BigNumber(1);
  const discountedPrice = price.multipliedBy(profit?.toNumber() / 10000);
  // const discountedPrice = new BigNumber(0);
  const { account } = useActiveWeb3React();
  const balance = useBalance(createToken(tokens.sig), [account], true);
  const maxCanTrade = useGetInverseBondAmountFunc(
    createToken(tokens.sig),
    "maxCanTrade"
  );
  // const maxCanTrade = new BigNumber(0);

  const maxBN = !account
    ? maxCanTrade
    : maxCanTrade && balance?.greaterThan(0)
    ? maxCanTrade
    : balance;
  // const maxBN = new BigNumber(0);
  const amountSigGet = useGetInverseBondAmountFunc(
    createToken(tokens.usdt),
    "getCurrentPrice",
    [
      new BigNumber(maxBN?.toFixed(9) || "0")
        .multipliedBy(new BigNumber(10).pow(tokens.sig.decimals))
        .toFixed(0),
    ]
  );

  const [onPresentBuyModal] = useModal(
    <InverseBondModal
      discountedPrice={discountedPrice}
      price={price}
      profit={profit}
    />
  );

  return (
    <div>
      <Page>
        <Box maxWidth="800px" mx="auto" mt="-18px">
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            color={darkColors.black}
          >
            <Box
              py="32px"
              px="22px"
              backgroundPosition="right top"
              backgroundSize="initial"
              backgroundRepeat="no-repeat"
            >
              <Box
                lineHeight="30px"
                fontWeight={900}
                color="textSubtle"
                size="lg"
              >
                {t("INVERSE BOND")}
              </Box>
              <Flex my="20px">
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("Inverse Bond treasury balance")}
                  </Box>
                  <Box className="fade-in">
                    {tokens.usdt.symbol} {formatNumber(balanceOf?.toFixed(2))}
                  </Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("INUKO Price")}
                  </Box>
                  <Box className="fade-in">
                    ${formatNumber(price.toFixed(18), 8)}
                  </Box>
                </Box>
              </Flex>

              <Flex>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("Token")}
                  </Box>
                  <Box>{tokens.sig.symbol}</Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("Payout Asset")}
                  </Box>
                  <Box>{tokens.usdt.symbol}</Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("Price")}
                  </Box>
                  <Box>${formatNumber(discountedPrice.toFixed(8), 8)}</Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" fontWeight="bold">
                    {t("Premium")}
                  </Box>
                  <Box mt="5px">{profit?.toNumber() / 100 - 100}%</Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" fontWeight="bold">
                    {t("Max payout")}
                  </Box>
                  <Box mt="5px" className="fade-in">
                    {formatNumber(amountSigGet?.toFixed(6), 6)}{" "}
                    {tokens.usdt.symbol}
                  </Box>
                </Box>
              </Flex>

              <Box flex="1" mt="20px" textAlign="center">
                <InverseBondActionContainer
                  disabledBuy={amountSigGet?.toString() === "0"}
                  onBuy={onPresentBuyModal}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default InverseBond;
