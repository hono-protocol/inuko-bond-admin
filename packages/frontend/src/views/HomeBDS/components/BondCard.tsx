import { Box, darkColors, Flex, Spinner } from "@bds-libs/uikit";
import BigNumber from "bignumber.js";

import tokens from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import { useBondContract } from "hooks/useContract";
import React, { useEffect, useState } from "react";
import { formatNumber } from "utils/formatBalance";

const BondCard = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const bondContract = useBondContract();

  const fetchData = async () => {
    try {
      setLoading(true);
      const bondLengthRes = (await bondContract.bondListLength()).toNumber();
      const result = [];

      for (let i = 0; i < bondLengthRes; i++) {
        const bondRes = await bondContract.bondList(i);

        result.push({
          id: i,
          ...bondRes,
        });
      }

      setData(result);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      >
        {loading ? (
          <Box textAlign="center">
            <Spinner />
          </Box>
        ) : (
          data?.map((o) => {
            return (
              <Box className="fade-in">
                <Box fontWeight={900} color="textSubtle" size="lg" mb="10px">
                  {o.name}
                </Box>
                <Box
                  textAlign="center"
                  fontWeight={900}
                  color="textSubtle"
                  size="lg"
                >
                  {t("Bond status")}
                </Box>
                <Box mt="5px" mb="10px" textAlign="center" fontWeight={900}>
                  {o.isActive ? t("Open") : t("Closed")}
                </Box>
                <Flex mb="10px">
                  <Box flex="1" textAlign="center">
                    <Box color="textSubtle" fontWeight="bold">
                      {t("Opens at")}
                    </Box>
                    <Box mt="5px">
                      INUKO{" "}
                      {formatNumber(
                        new BigNumber(o.sigBalanceUpperCap.toString())
                          .div(new BigNumber(10).pow(tokens.sig.decimals))
                          ?.toFixed(2)
                      )}
                    </Box>
                  </Box>
                  <Box flex="1" textAlign="center">
                    <Box color="textSubtle" fontWeight="bold">
                      {t("Closes at")}
                    </Box>
                    <Box mt="5px">
                      INUKO{" "}
                      {formatNumber(
                        new BigNumber(o.sigBalanceLowerCap.toString())
                          .div(new BigNumber(10).pow(tokens.sig.decimals))
                          ?.toFixed(2)
                      )}
                    </Box>
                  </Box>
                </Flex>
                <Box flex="1" textAlign="center" mb="10px">
                  <Box color="textSubtle" fontWeight="bold">
                    {t("Bond pool")}
                  </Box>
                  <Box mt="5px">
                    {tokens.sig.symbol}{" "}
                    {formatNumber(
                      new BigNumber(o.sigBalance.toString())
                        .div(new BigNumber(10).pow(tokens.sig.decimals))
                        ?.toFixed(2)
                    )}
                  </Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" fontWeight="bold">
                    {t("Bond premium")}
                  </Box>
                  <Box mt="5px">
                    {o.premiumPercentage?.toNumber() / 100 - 100}%
                  </Box>
                </Box>
                <Box
                  my="1rem"
                  opacity="0.2"
                  borderBottom={`1px solid ${darkColors.black}`}
                />
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default BondCard;
