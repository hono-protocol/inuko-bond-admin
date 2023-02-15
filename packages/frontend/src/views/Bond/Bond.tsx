import { Box, darkColors, Flex, Spinner, useModal } from "@bds-libs/uikit";
import React, { useEffect, useState } from "react";

import Page from "components/layout/Page";
import { useTranslation } from "contexts/Localization";
import { useGetSigTokenFunc } from "hooks/useTotalSupply";
import tokens, { createToken, getLpName } from "config/constants/tokens";
import { BOND_ADDRESS } from "config/constants";
import { formatNumber } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import { useGetApiPrice } from "state/hooks";
import { getAddress } from "utils/addressHelpers";
import BondActionContainer from "./BondActionContainer";
import BondModal from "./BondModal";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import BondListModal from "./BondListModal";
import { getTokenContract, useBondContract } from "hooks/useContract";

const Bond = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const balanceOf = useGetSigTokenFunc(createToken(tokens.sig), "balanceOf", [
    BOND_ADDRESS,
  ]);
  const price = new BigNumber(useGetApiPrice(getAddress(tokens.sig.address)));
  const { account } = useActiveWeb3React();
  const bondContract = useBondContract();
  const [modalData, setModalData] = useState<any>(false);

  const [onPresentListModal] = useModal(<BondListModal />);

  const fetchData = async () => {
    try {
      setLoading(true);
      const bondLengthRes = (await bondContract.bondListLength()).toNumber();
      const result = [];

      for (let i = 0; i < bondLengthRes; i++) {
        const bondRes = await bondContract.bondList(i);
        const tokenName = getLpName(bondRes.lpToken);
        const tokenContract = getTokenContract(bondRes.lpToken);
        let maxCanTrade = i === 1 ? "0" : await bondContract.maxCanTrade(i);
        maxCanTrade = new BigNumber(maxCanTrade.toString()).div(
          new BigNumber(10).pow(18)
        );
        const balance = account
          ? new BigNumber(
              (await tokenContract.balanceOf(account)).toString()
            ).div(new BigNumber(10).pow(18))
          : new BigNumber(0);
        const maxBN = !account
          ? maxCanTrade
          : // @ts-ignore
          balance?.gt(maxCanTrade)
          ? maxCanTrade
          : balance;
        const amountSigGet = maxBN.gt(0)
          ? new BigNumber(
              (
                await bondContract.LpToSig(
                  bondRes.lpToken,
                  new BigNumber(maxBN?.toFixed(18) || "0")
                    .multipliedBy(new BigNumber(10).pow(18))
                    .toFixed(0)
                )
              ).toString()
            ).div(new BigNumber(10).pow(tokens.sig.decimals))
          : new BigNumber(0);
        const profit = bondRes?.premiumPercentage;
        const discountedPrice = price.minus(
          price.multipliedBy(profit?.toNumber() / 10000 - 1)
        );

        result.push({
          id: i,
          ...bondRes,
          tokenName,
          maxCanTrade,
          amountSigGet,
          balance,
          discountedPrice,
          profit,
        });
      }
      setData(result);
    } catch (err) {
      console.log("err", err, account);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [account]);

  return (
    <div>
      <Page>
        {!!modalData && (
          <BondModal
            discountedPrice={modalData?.discountedPrice}
            onDismiss={() => setModalData(undefined)}
            price={price}
            profit={modalData?.profit}
            data={modalData}
          />
        )}
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
                {t("BOND")}
              </Box>
              <Flex my="20px">
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("Bond treasury balance")}
                  </Box>
                  <Box className="fade-in">
                    INUKO {formatNumber(balanceOf?.toFixed(2))}
                  </Box>
                </Box>
                <Box flex="1" textAlign="center">
                  <Box color="textSubtle" mb="5px" fontWeight="bold">
                    {t("INUKO Price")}
                  </Box>
                  <Box className="fade-in">
                    ${formatNumber(price.toFixed(18), 6)}
                  </Box>
                </Box>
              </Flex>
              {loading ? (
                <Box textAlign="center">
                  <Spinner />
                </Box>
              ) : (
                data.map((o) => {
                  const { discountedPrice, profit, amountSigGet } = o;
                  return (
                    <Box
                      key={o.id}
                      mt="1rem"
                      pb="0.5rem"
                      borderBottom="1px dashed #666"
                      className="fade-in"
                    >
                      <Flex mb="10px">
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" mb="5px" fontWeight="bold">
                            {t("Name")}
                          </Box>
                          <Box>{o.name}</Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" mb="5px" fontWeight="bold">
                            {t("Token")}
                          </Box>
                          <Box>{o.tokenName}</Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" mb="5px" fontWeight="bold">
                            {t("Payout Asset")}
                          </Box>
                          <Box>{tokens.sig.symbol}</Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" mb="5px" fontWeight="bold">
                            {t("Price")}
                          </Box>
                          <Box>
                            ${formatNumber(discountedPrice.toFixed(6), 6)}
                          </Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" fontWeight="bold">
                            {t("Discount")}
                          </Box>
                          <Box mt="5px">{profit?.toNumber() / 100 - 100}%</Box>
                        </Box>
                        <Box flex="1" textAlign="center">
                          <Box color="textSubtle" fontWeight="bold">
                            {t("Max payout")}
                          </Box>
                          <Box mt="5px">
                            {formatNumber(amountSigGet?.toFixed(2))}{" "}
                            {tokens.sig.symbol}
                          </Box>
                        </Box>
                      </Flex>

                      <Box flex="1" py="10px" textAlign="center">
                        <BondActionContainer
                          onBuy={() => {
                            setModalData(o);
                          }}
                          onList={onPresentListModal}
                          disabledBuy={
                            amountSigGet.toString() === "0" || !o.isActive
                          }
                        />
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default Bond;
