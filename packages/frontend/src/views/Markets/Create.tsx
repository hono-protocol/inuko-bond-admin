import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import Page from "components/layout/Page";
import { useTranslation } from "contexts/Localization";
import { Heading } from "@becoswap-libs/uikit";
import { Box, Button, darkColors, Flex, Grid, Input } from "@bds-libs/uikit";
import { useTokenDetail } from "hooks";
import BigNumber from "bignumber.js";
import { formatNumber, getDecimalAmount } from "utils/formatBalance";
import {
  useERC20,
  useExpirySdaContract,
  useTermSdaContract,
} from "hooks/useContract";
import useToast from "hooks/useToast";
import { createToken2 } from "config/constants/tokens";
import { useGetAmount } from "hooks/useTotalSupply";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { EXPIRY_TELLER_ADDRESS, TERM_TELLER_ADDRESS } from "config/constants";
import UnlockButton from "components/UnlockButton";
import { hexParams } from "utils";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 16px 16px 0 16px;
  text-align: center;
  color: #fff;
`;

const Label = styled.label`
  margin-bottom: 0.25rem;
  display: block;
`;
const Description = styled.span`
  font-size: 0.625rem;
  text-decoration: italic;
`;

const Create: React.FC = () => {
  const { t } = useTranslation();
  const [payoutToken, setPayoutToken] = useState();
  const [quoteToken, setQuoteToken] = useState();

  const { data: payoutData, loading: payoutLoading } =
    useTokenDetail(payoutToken);
  const { data: quoteData, loading: quoteLoading } = useTokenDetail(quoteToken);
  const expirySdaContract = useExpirySdaContract();
  const termSdaContract = useTermSdaContract();

  const [payoutTokenPrice, setPayoutPrice] = useState<number>();
  const [quoteTokenPrice, setQuotePrice] = useState<number>();
  const [minRate, setMinRate] = useState<number>();
  const [cap, setCap] = useState<string>();
  const [capToken, setCapToken] = useState<"payout" | "quote">("payout");
  const [endDate, setEndDate] = useState();
  const [type, setType] = useState<"expiry" | "term">("expiry");
  const [vestDate, setVestDate] = useState();
  const [vestPeriod, setVestPeriod] = useState(14);
  const [bondDelay, setBondDelay] = useState(24 * 60 * 60); // 1 day
  const [rate, setRate] = useState(new BigNumber(0));
  const [callback, setCallback] = useState(
    "0x0000000000000000000000000000000000000000"
  );
  const { toastError, toastSuccess } = useToast();
  const { account } = useActiveWeb3React();
  const approved = useGetAmount(
    payoutData &&
      createToken2({
        symbol: payoutData?.symbol,
        decimals: payoutData?.decimals,
        address: payoutToken,
      }),
    "allowance",
    [account, type === "expiry" ? EXPIRY_TELLER_ADDRESS : TERM_TELLER_ADDRESS]
  );
  const payoutTokenContract = useERC20(payoutToken);
  const maxMarketAmount = useMemo(() => {
    if (!cap || !rate) {
      return undefined;
    }
    if (capToken === "payout") {
      return cap;
    }
    return new BigNumber(cap).multipliedBy(rate).toNumber();
  }, [cap, rate]);

  const handleInput = (key: string) => (e) => {
    let func;
    switch (key) {
      case "payout-token-input":
        func = setPayoutToken;
        break;
      case "quote-token-input":
        func = setQuoteToken;
        break;
      case "payout-price-input":
        func = setPayoutPrice;
        break;
      case "quote-price-input":
        func = setQuotePrice;
        break;
      case "min-rate-input":
        func = setMinRate;
        break;
      case "cap-input":
        func = setCap;
        break;
      case "market-end-input":
        func = setEndDate;
        break;
      case "bond-vesting-date":
        func = setVestDate;
        break;
      case "bond-delay":
        func = setBondDelay;
        break;
      case "bond-vesting-period":
        func = setVestPeriod;
        break;
      case "callback":
        func = setCallback;
        break;
    }

    func?.(e.target.value);
  };

  const isValid = useMemo(() => {
    if (!payoutData) {
      return false;
    }
    if (!quoteData) {
      return false;
    }
    if (!rate) {
      return false;
    }
    if (!minRate) {
      return false;
    }
    if (!cap) {
      return false;
    }
    if (!endDate) {
      return false;
    }
    if (type === "expiry") {
      if (!vestDate) {
        return false;
      }
    } else {
      if (vestPeriod === undefined) {
        return false;
      }
    }
    if (!endDate) {
      return false;
    }
    if (bondDelay === undefined) {
      return false;
    }
    if (!callback) {
      return false;
    }
    return true;
  }, [
    payoutData,
    quoteData,
    rate,
    minRate,
    cap,
    endDate,
    type,
    vestDate,
    vestPeriod,
    endDate,
    bondDelay,
  ]);

  const handleCreateBond = async () => {
    try {
      if (!isValid) {
        return toastError(t("Invalid data!"));
      }
      const pDec = payoutData.decimals;
      const qDec = quoteData.decimals;
      const scaleAdj = pDec - qDec - (pDec - qDec) / 2;
      const price = new BigNumber(payoutTokenPrice)
        .dividedBy(quoteTokenPrice)
        .multipliedBy(new BigNumber(10).pow(36 + scaleAdj));
      const minPrice =
        minRate === 0
          ? 0
          : new BigNumber(minRate).multipliedBy(
              new BigNumber(10).pow(36 + scaleAdj)
            );
      const vesting =
        type === "expiry"
          ? new Date(vestDate).getTime() / 1000
          : vestPeriod * 24 * 60 * 60;

      const params = hexParams(
        [
          "function createMarket(address payoutToken, address quoteToken, address callbackAddr, bool capacityInQuote, uint256 capacity, uint256 formattedInitialPrice, uint256 formattedMinimumPrice, uint32 debtBuffer, uint48 vesting, uint48 conclusion, uint32 depositInterval, int8 scaleAdjustment;)",
        ],
        "createMarket",
        [
          payoutToken,
          quoteToken,
          callback,
          capToken === "quote",
          getDecimalAmount(
            new BigNumber(cap),
            capToken === "payout" ? payoutData.decimals : quoteData.decimals
          )?.toFixed(0),
          price?.toFixed(0),
          minPrice?.toFixed(0),
          95000,
          vesting,
          new Date(endDate).getTime() / 1000,
          bondDelay,
          scaleAdj,
        ]
      );
      console.log("params", params);
      let tx;
      if (type === "expiry") {
        tx = await expirySdaContract.createMarket(params);
      } else {
        tx = await termSdaContract.createMarket(params);
      }
      await tx.wait();
      toastSuccess("Done!!!");
    } catch (err) {
      console.log("err", err);
      toastError("Execution revert!");
    }
  };

  const handleApprove = async () => {
    if (!cap) {
      return toastError(t("Please enter max capacity"));
    }
    try {
      const tx = await payoutTokenContract.approve(
        type === "expiry" ? EXPIRY_TELLER_ADDRESS : TERM_TELLER_ADDRESS,
        getDecimalAmount(new BigNumber(maxMarketAmount), payoutData.decimals)
      );
      await tx.wait();
    } catch (err) {
      toastError(err?.toString());
    }
  };

  const renderConfirmButton = () => {
    if (!account) {
      return <UnlockButton variant="danger" style={{ width: "100%" }} />;
    }
    const approvedAmountBN = new BigNumber(
      approved?.toFixed(payoutData?.decimals || 0)
    );
    if (!approved || approvedAmountBN.isLessThan(maxMarketAmount || 0)) {
      return (
        <Button
          style={{ width: "100%" }}
          variant="danger"
          onClick={handleApprove}
        >
          {t("Approve")}
        </Button>
      );
    }

    if (true) {
      return (
        <Button
          style={{ width: "100%" }}
          variant="danger"
          onClick={handleCreateBond}
        >
          {t("Create Bond")}
        </Button>
      );
    }
  };

  useEffect(() => {
    if (payoutData?.price) {
      setPayoutPrice(payoutData?.price);
    }
  }, [payoutData]);

  useEffect(() => {
    if (quoteTokenPrice && payoutTokenPrice) {
      setRate(
        new BigNumber(payoutTokenPrice).dividedBy(
          new BigNumber(quoteTokenPrice)
        )
      );
    }
  }, [quoteTokenPrice, payoutTokenPrice]);

  useEffect(() => {
    if (quoteData?.price) {
      setQuotePrice(quoteData?.price);
    }
  }, [quoteData]);

  return (
    <div>
      <Page>
        <Hero>
          <Heading
            textAlign="center"
            as="h1"
            size="xl"
            fontWeight={900}
            color={darkColors.primary}
            mb="1rem"
          >
            {t("Deploy Market")}
          </Heading>
        </Hero>

        <Box
          boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="16px"
          background={darkColors.white}
        >
          <Box py="32px" px="22px" color={darkColors.black}>
            <Box
              textAlign="center"
              fontWeight={900}
              color="textSubtle"
              size="lg"
            >
              {t("1. Set Up Market")}
            </Box>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Payout Token")}</Label>
                <Input
                  id="payout-token-input"
                  scale="lg"
                  value={payoutToken}
                  autoComplete="off"
                  // isWarning={!isAddressValid}
                  onChange={handleInput("payout-token-input")}
                />
                <Description>
                  {t("Enter the contract address of the payout token")}
                </Description>
              </Box>
              <Box width="1rem" />
              <Box flex="1">
                <Label>{t("Quote Token")}</Label>
                <Input
                  id="quote-token-input"
                  scale="lg"
                  value={quoteToken}
                  autoComplete="off"
                  // isWarning={!isAddressValid}
                  onChange={handleInput("quote-token-input")}
                />
                <Description>
                  {t("Enter the contract address of the quote token")}
                </Description>
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1" p="1rem" backgroundColor={darkColors.primary}>
                {!!payoutData ? (
                  <>
                    <Box>{payoutData.symbol}</Box>
                    <Box my="0.5rem">
                      {t("Price")}: {payoutData.price}
                    </Box>
                    <Box>
                      {t("Token Decimals")}: {payoutData.decimals}
                    </Box>
                  </>
                ) : (
                  t(payoutLoading ? "Loading" : "Enter Token Address")
                )}
              </Box>
              <Box width="1rem" />
              <Box flex="1" p="1rem" backgroundColor={darkColors.primary}>
                {!!quoteData ? (
                  <>
                    <Box>{quoteData.symbol}</Box>
                    <Box my="0.5rem">
                      {t("Price")}: {quoteData.price}
                    </Box>
                    <Box>
                      {t("Token Decimals")}: {quoteData.decimals}
                    </Box>
                  </>
                ) : (
                  t(quoteLoading ? "Loading" : "Enter Token Address")
                )}
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Payout Token Price")}</Label>
                <Input
                  id="payout-price-input"
                  scale="lg"
                  value={payoutTokenPrice}
                  autoComplete="off"
                  isWarning={!payoutTokenPrice}
                  onChange={handleInput("payout-price-input")}
                />
              </Box>
              <Box width="1rem" />
              <Box flex="1">
                <Label>{t("Quote Token Price")}</Label>
                <Input
                  id="quote-price-input"
                  scale="lg"
                  value={quoteTokenPrice}
                  autoComplete="off"
                  isWarning={!quoteTokenPrice}
                  onChange={handleInput("quote-price-input")}
                />
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Current Exchange Rate")}</Label>
                <Box py="0.5rem" fontSize="1.5rem">
                  ~ {formatNumber(rate?.toString())} {quoteData?.symbol || ""}{" "}
                  per {payoutData?.symbol || ""}
                </Box>
              </Box>
              <Box width="1rem" />
              <Box flex="1">
                <Label>{t("Minimum Exchange Rate")}</Label>
                <Input
                  id="min-rate-input"
                  scale="lg"
                  value={minRate}
                  autoComplete="off"
                  isWarning={!minRate}
                  onChange={handleInput("min-rate-input")}
                />
                <Description>
                  {t("Minimum rate for buyers")}: ~{minRate}{" "}
                  {quoteData?.symbol || ""} per {payoutData?.symbol || ""}
                </Description>
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Market Capacity")}</Label>
                <Input
                  id="cap-input"
                  scale="lg"
                  value={cap}
                  autoComplete="off"
                  isWarning={!cap}
                  onChange={handleInput("cap-input")}
                />
              </Box>
              <Box width="1rem" />
              <Box flex="1">
                <Label>{t("Capacity Token")}</Label>
                <Grid gridTemplateColumns="1fr 1fr" gridGap="8px">
                  <Button
                    onClick={() => {
                      setCapToken("payout");
                    }}
                    variant={capToken === "payout" ? "primary" : "secondary"}
                  >
                    {t("Payout")}
                  </Button>
                  <Button
                    onClick={() => {
                      setCapToken("quote");
                    }}
                    variant={capToken === "quote" ? "primary" : "secondary"}
                  >
                    {t("Quote")}
                  </Button>
                </Grid>
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box
          boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="16px"
          background={darkColors.white}
          mt="2rem"
        >
          <Box py="32px" px="22px" color={darkColors.black}>
            <Box
              textAlign="center"
              fontWeight={900}
              color="textSubtle"
              size="lg"
            >
              {t("2. Set Up Vesting Terms")}
            </Box>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Market End Date")}</Label>
                <Input
                  id="market-end-input"
                  scale="lg"
                  value={endDate}
                  autoComplete="off"
                  isWarning={!endDate}
                  onChange={handleInput("market-end-input")}
                  type="date"
                />
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Vesting Type")}</Label>
                <Grid gridTemplateColumns="1fr 1fr" gridGap="8px">
                  <Button
                    onClick={() => {
                      setType("expiry");
                    }}
                    variant={type === "expiry" ? "primary" : "secondary"}
                  >
                    {t("Fixed Expiry")}
                  </Button>
                  <Button
                    onClick={() => {
                      setType("term");
                    }}
                    variant={type === "term" ? "primary" : "secondary"}
                  >
                    {t("Fixed Term")}
                  </Button>
                </Grid>
              </Box>
            </Flex>
            <Flex py="1rem">
              {type === "expiry" ? (
                <Box flex="1">
                  <Label>{t("Bond Vesting Date")}</Label>
                  <Input
                    id="bond-vesting-date"
                    scale="lg"
                    value={vestDate}
                    autoComplete="off"
                    isWarning={!vestDate}
                    onChange={handleInput("bond-vesting-date")}
                    type="date"
                  />
                  <Description>
                    {t(
                      "NOTE: Vesting Date must be at least 1 day after Market End Date"
                    )}
                  </Description>
                </Box>
              ) : (
                <Box flex="1">
                  <Label>{t("Bond Vesting Period (days)")}</Label>
                  <Input
                    id="bond-vesting-period"
                    scale="lg"
                    value={vestPeriod}
                    autoComplete="off"
                    isWarning={!vestPeriod}
                    onChange={handleInput("bond-vesting-period")}
                    type="number"
                  />
                </Box>
              )}
            </Flex>
          </Box>
        </Box>

        <Box
          boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="16px"
          background={darkColors.white}
          mt="2rem"
        >
          <Box py="32px" px="22px" color={darkColors.black}>
            <Box
              textAlign="center"
              fontWeight={900}
              color="textSubtle"
              size="lg"
            >
              {t("Advanced Setup")}
            </Box>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Bond Delay (in second)")}</Label>
                <Input
                  id="bond-delay"
                  scale="lg"
                  value={bondDelay}
                  autoComplete="off"
                  // isWarning={!isAddressValid}
                  onChange={handleInput("bond-delay")}
                  type="number"
                />
              </Box>
            </Flex>
            <Flex py="1rem">
              <Box flex="1">
                <Label>{t("Callback")}</Label>
                <Input
                  id="callback"
                  scale="lg"
                  value={callback}
                  autoComplete="off"
                  isWarning={!callback}
                  onChange={handleInput("callback")}
                />
              </Box>
            </Flex>
          </Box>
        </Box>

        <Box py="2rem" width="100%">
          {renderConfirmButton()}
        </Box>
      </Page>
    </div>
  );
};

export default Create;
