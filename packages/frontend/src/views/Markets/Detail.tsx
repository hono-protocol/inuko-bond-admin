import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { MaxUint256 } from "@ethersproject/constants";
import {
  BaseLayout,
  Box,
  Button,
  darkColors,
  Flex,
  Heading,
} from "@bds-libs/uikit";
import format from "date-fns/format";
import isAfter from "date-fns/isAfter";

import Page from "components/layout/Page";
import { useTranslation } from "contexts/Localization";
import { createToken2 } from "config/constants/tokens";
import {
  formatNumber,
  getBalance,
  getBalanceNumber,
  getDecimalAmount,
} from "utils/formatBalance";
import CurrencyInputPanel from "components/CurrencyInputPanel";
import BigNumber from "bignumber.js";
import { Table } from ".";
import { useGetAmount } from "hooks/useTotalSupply";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { EXPIRY_TELLER_ADDRESS, TERM_TELLER_ADDRESS } from "config/constants";
import { getBep20Contract } from "utils/contractHelpers";
import { getProviderOrSigner } from "utils";
import UnlockButton from "components/UnlockButton";
import { RouteComponentProps } from "react-router-dom";
import {
  useFetchBondId,
  useGetBondPrice,
  useGetExpiryBonded,
  useGetMarketDetail,
  useGetTermBonded,
  useTokenDetail,
} from "hooks";
import useToast from "hooks/useToast";
import {
  useExpiryTellerContract,
  useTermTellerContract,
} from "hooks/useContract";
import { useFetchBondedEvents, useGetChartData } from "hooks/chart";
import TermBondedLine from "./components/TermBondedLine";
import Chart from "./components/Chart";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 16px 16px 0 16px;
  text-align: center;
  color: #fff;
`;

const Negative = styled.div`
  color: red;
  text-align: center;
`;
const Positive = styled.span`
  color: green;
`;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 24px;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
  & > div {
    grid-column: span 4;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }
`;

const Rows = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
`;

const Height = "120px";

function Detail({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) {
  const { data } = useFetchBondId(id);
  if (!data) {
    return <div>Loading...</div>;
  }

  return <WrappedDetail data={data} />;
}

function WrappedDetail({ data }: { data: any }) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("0");
  const { data: quoteTokenDetail } = useTokenDetail(data.quoteToken.address);
  const { data: payoutTokenDetail } = useTokenDetail(data.payoutToken.address);
  const capToken = data?.capacityInQuote ? data?.quoteToken : data?.payoutToken;
  const { bondPrice, rate } = useGetBondPrice(
    data?.id,
    quoteTokenDetail,
    payoutTokenDetail
  );
  const { toastError, toastSuccess } = useToast();
  const exchangeRate = rate;
  const willReceive =
    inputValue && new BigNumber(inputValue).multipliedBy(exchangeRate);
  const bondPriceNumber = bondPrice?.toNumber();
  const capacityFormatted = getBalanceNumber(
    new BigNumber(data?.cap),
    capToken.decimals
  );
  const discount =
    bondPriceNumber &&
    payoutTokenDetail &&
    ((payoutTokenDetail?.price - bondPriceNumber) * 100.0) /
      payoutTokenDetail?.price;
  const { account, library } = useActiveWeb3React();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const approved = useGetAmount(
    createToken2(data.quoteToken),
    "allowance",
    [
      account,
      data.type === "expiry" ? EXPIRY_TELLER_ADDRESS : TERM_TELLER_ADDRESS,
    ],
    true
  )?.greaterThan(0);
  const balance = useGetAmount(
    createToken2(data.quoteToken),
    "balanceOf",
    [account],
    true
  );
  const [loading, setLoading] = useState(false);
  const { marketDetail } = useGetMarketDetail(data.id, data.type);
  const maxPayoutNumber = new BigNumber(marketDetail?.maxPayout?.toString())
    .dividedBy(
      new BigNumber(10).pow(
        data.capacityInQuote
          ? data?.quoteToken?.decimals
          : data?.payoutToken?.decimals
      )
    )
    .toNumber();
  const expiryTellerContract = useExpiryTellerContract();
  const termTellerContract = useTermTellerContract();
  const expired = isAfter(new Date(), new Date(data.conclusion * 1000));
  const {
    amount,
    bondTk,
    fetchData: refetchExpiryBonded,
  } = useGetExpiryBonded(data.id, account, library, data.type);
  const { data: termBonded, fetchData: refetchTermBonded } = useGetTermBonded(
    data.id,
    account,
    data.type
  );
  const { data: bondedEvents, fetchData: refetchBondedEvents } =
    useFetchBondedEvents(data.id, data.type);
  const {
    data: chartData,
    // fetchData: refetchChartData,
    // loading: loadingChartData,
  } = useGetChartData(data.quoteToken, data.payoutToken, bondedEvents);

  const hasError = () => {
    if (expired) {
      return t("Expired!");
    }
    if (!inputValue || !+inputValue) {
      return t("Please input amount!");
    }
    if (
      new BigNumber(balance?.toFixed(data?.quoteToken?.decimals)).lt(
        new BigNumber(inputValue)
      )
    ) {
      return t("Not enought balance!");
    }

    if (data.capacityInQuote) {
      if (new BigNumber(maxPayoutNumber).lt(new BigNumber(inputValue))) {
        return t("Exceed max payout!");
      }
    } else {
      if (willReceive?.isGreaterThanOrEqualTo(new BigNumber(maxPayoutNumber))) {
        return t("Exceed max payout!");
      }
    }

    return null;
  };

  function handleChangeAmount(e: any) {
    if (!e || isNaN(e)) {
      return setInputValue("0");
    }

    if (!isNaN(e)) {
      if (e.includes(".")) {
        setInputValue(e);
      } else {
        setInputValue((+e).toString());
      }
    }
  }

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const contract = getBep20Contract(
        data?.quoteToken?.address,
        getProviderOrSigner(library, account)
      );
      const tx = await contract?.approve(
        data.type === "expiry" ? EXPIRY_TELLER_ADDRESS : TERM_TELLER_ADDRESS,
        MaxUint256,
        {
          gasLimit: 300000,
        }
      );

      await tx.wait();
      setRequestedApproval(false);
      toastSuccess(t("Approved!"));
    } catch (e) {
      console.error(e);
      // @ts-ignore
      toastError("Error!", e.message);
    }
  }, [library, account, data]);

  const handleBuyBond = async () => {
    try {
      if (hasError()) {
        return;
      }
      setLoading(true);

      const contract =
        data.type === "expiry" ? expiryTellerContract : termTellerContract;

      const tx = await contract.purchase(
        account,
        "0x0000000000000000000000000000000000000000",
        data.id,
        getDecimalAmount(
          new BigNumber(inputValue),
          data.quoteToken.decimals
        ).toFixed(0),
        getDecimalAmount(
          new BigNumber(inputValue)
            .multipliedBy(exchangeRate)
            .multipliedBy(0.9),
          data.quoteToken.decimals
        ).toFixed(0)
      );
      await tx.wait();
      refetchExpiryBonded?.();
      refetchTermBonded?.();
      setTimeout(() => refetchTermBonded?.(), 15 * 1000);
      setTimeout(() => refetchBondedEvents?.(), 15 * 1000);
      toastSuccess(t("Bonded successfully!"));
      setInputValue("0");
    } catch (err) {
      console.log(err);
      toastError(t("Execution reverted!"));
    } finally {
      setLoading(false);
    }
  };

  const handleClaimExpiry = async () => {
    try {
      setLoading(true);
      const tx = await expiryTellerContract.redeem(
        bondTk?.address,
        getDecimalAmount(amount, bondTk.decimals).toFixed(0)
      );
      await tx.wait();
      refetchExpiryBonded?.();
      toastSuccess(t("Claimed successfully!"));
    } catch (err) {
      console.log(err);
      // @ts-ignore
      toastError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const generateActions = () => {
    if (expired) {
      return (
        <Button width="100%" variant="action" disabled>
          {t("Expired")}
        </Button>
      );
    }
    if (!account) {
      return <UnlockButton width="100%" />;
    }
    if (!approved) {
      return (
        <Button
          variant="action"
          width="100%"
          disabled={requestedApproval}
          onClick={handleApprove}
        >
          {t("Approve Contract")}
        </Button>
      );
    }

    return (
      <>
        {!!hasError() && <Negative>{hasError()}</Negative>}
        <Button
          width="100%"
          variant="action"
          onClick={handleBuyBond}
          isLoading={loading}
          disabled={loading || !!hasError()}
        >
          {t("Buy inverse bond")}
        </Button>
      </>
    );
  };

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
            {data.quoteToken.symbol}-{data.payoutToken.symbol} BOND
          </Heading>
        </Hero>
        <Cards>
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            height={Height}
          >
            <Box py="32px" px="22px" color={darkColors.black}>
              <Box
                textAlign="center"
                fontWeight={900}
                color="textSubtle"
                size="lg"
              >
                {t("Max Payout")}
              </Box>
              <Box
                textAlign="center"
                fontWeight={900}
                pt="0.5rem"
                fontSize="2rem"
              >
                {formatNumber(capacityFormatted)} {capToken.symbol}
              </Box>
            </Box>
          </Box>
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            height={Height}
          >
            <Box
              py="32px"
              px="22px"
              backgroundPosition="right top"
              backgroundSize="initial"
              backgroundRepeat="no-repeat"
              color={darkColors.black}
            >
              <Box
                textAlign="center"
                fontWeight={900}
                color="textSubtle"
                size="lg"
              >
                {t("Current Discount")}
              </Box>
              <Box
                textAlign="center"
                fontWeight={900}
                pt="0.5rem"
                fontSize="2rem"
              >
                {discount >= 0 ? (
                  <Positive>{formatNumber(discount)}%</Positive>
                ) : (
                  <Negative>{formatNumber(discount)}%</Negative>
                )}
              </Box>
            </Box>
          </Box>
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            height={Height}
          >
            <Box
              py="32px"
              px="22px"
              backgroundPosition="right top"
              backgroundSize="initial"
              backgroundRepeat="no-repeat"
              color={darkColors.black}
            >
              <Box
                textAlign="center"
                fontWeight={900}
                color="textSubtle"
                size="lg"
              >
                {t(data.type === "expiry" ? "Vesting Date" : "Vesting Term")}
              </Box>
              <Box
                textAlign="center"
                fontWeight={900}
                pt="0.5rem"
                fontSize="2rem"
              >
                {data.type === "expiry"
                  ? format(new Date(data.vesting * 1000), "yyyy.MM.dd")
                  : `${data.vesting / (24 * 60 * 60)} days`}
              </Box>
            </Box>
          </Box>
        </Cards>

        <Box
          boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="16px"
          background={darkColors.white}
        >
          <Flex py="32px" px="22px" maxHeight="500px">
            <Box flex="1">
              <Chart data={chartData} />
            </Box>
            <Box flex="1">
              <CurrencyInputPanel
                disableAddToken
                label={`${t("Balance")}: ${formatNumber(
                  new BigNumber(
                    balance?.toFixed(data?.quoteToken?.decimals)
                  )?.toNumber()
                )} ${data?.quoteToken?.symbol}`}
                value={inputValue}
                currency={data.quoteToken}
                onUserInput={handleChangeAmount}
                disableCurrencySelect
                //   onMax={handleMaxInput}
                onCurrencySelect={() => {
                  console.log("ahihi");
                }}
                //   otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
                showMaxButton={false}
              />
              <Box height="1rem" />
              <Rows>
                <span>{t("You will get")}</span>
                <span>
                  {willReceive ? formatNumber(willReceive.toNumber(), 8) : 0}{" "}
                  {data.payoutToken.symbol}
                </span>
              </Rows>
              <Rows>
                <span>{t("Max Bondable")}</span>
                <span>
                  {formatNumber(maxPayoutNumber)}{" "}
                  {data.capacityInQuote
                    ? data.quoteToken.symbol
                    : data.payoutToken.symbol}
                </span>
              </Rows>
              <Rows>
                <span>{t("Bond Contract")}</span>
                <a
                  href={`https://bscscan.com/address/${
                    data.type === "expiry"
                      ? EXPIRY_TELLER_ADDRESS
                      : TERM_TELLER_ADDRESS
                  }`}
                >
                  View
                </a>
              </Rows>
              <Box py="1rem">{generateActions()}</Box>
            </Box>
          </Flex>
        </Box>

        {!!account && (
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            py="32px"
            px="22px"
            mt="2rem"
          >
            <Box fontWeight={900} color="textSubtle" size="lg" mb="1rem">
              {t("Your bonded")}
            </Box>
            <Table>
              <tr>
                <th>{t("Payout Amount")}</th>
                <th>{t("Vesting Date")}</th>
                <th>{t("Claimable")}</th>
              </tr>
              {amount.gt(0) && (
                <tr>
                  <td>
                    {formatNumber(amount.toNumber())} {data.payoutToken.symbol}
                  </td>
                  <td>{format(new Date(data.vesting * 1000), "yyyy.MM.dd")}</td>
                  <td>
                    <Button
                      width="100%"
                      variant="action"
                      onClick={handleClaimExpiry}
                      disabled={isAfter(
                        new Date(data.vesting * 1000),
                        new Date()
                      )}
                    >
                      {t("Claim")}
                    </Button>
                  </td>
                </tr>
              )}
              {termBonded.map((o) => {
                return (
                  <TermBondedLine key={o.renderId} id={o.tokenId} data={data} />
                );
              })}
            </Table>
          </Box>
        )}

        <Box
          boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
          borderRadius="16px"
          background={darkColors.white}
          py="32px"
          px="22px"
          mt="2rem"
        >
          <Box fontWeight={900} color="textSubtle" size="lg" mb="1rem">
            {t("Transaction History")}
          </Box>
          <Table>
            <tr>
              <th>{t("Time")}</th>
              {/* <th>{t("Total Value")}</th> */}
              <th style={{ textAlign: "right" }}>{t("Bond Amount")}</th>
              <th style={{ textAlign: "right" }}>{t("Payout Amount")}</th>
              {/* <th>{t("Address")}</th> */}
              <th>{t("Tx Hash")}</th>
            </tr>
            {bondedEvents?.map((o) => {
              return (
                <tr key={o.transactionHash}>
                  <td>
                    {format(
                      new Date((o.timestamp || o.timeStamp) * 1000),
                      "yyyy.MM.dd HH:mm:ss"
                    )}
                  </td>
                  <td>
                    {formatNumber(
                      getBalance(
                        new BigNumber(o.amount),
                        data.quoteToken.decimals
                      ).toNumber()
                    )}{" "}
                    {data.quoteToken.symbol}
                  </td>
                  <td>
                    {formatNumber(
                      getBalance(
                        new BigNumber(o.payout),
                        data.payoutToken.decimals
                      ).toNumber()
                    )}{" "}
                    {data.payoutToken.symbol}
                  </td>
                  <td>
                    <a href={`https://bscscan.com/tx/${o.transactionHash}`}>
                      {o.transactionHash}
                    </a>
                  </td>
                </tr>
              );
            })}
          </Table>
        </Box>
      </Page>
    </div>
  );
}

export default Detail;
