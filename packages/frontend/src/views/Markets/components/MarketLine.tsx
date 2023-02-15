import { Flex } from "@bds-libs/uikit";
import React from "react";
import styled from "styled-components";
import addSeconds from "date-fns/addSeconds";
import format from "date-fns/format";
import differenceInDays from "date-fns/differenceInDays";
import BigNumber from "bignumber.js";
import isAfter from "date-fns/isAfter";

import { formatNumber, getBalanceNumber } from "utils/formatBalance";
import { CurrencyLogo } from "components/Logo";
import { useGetBondPrice, useTokenDetail } from "hooks";
import { useTranslation } from "contexts/Localization";

const Negative = styled.span`
  color: red;
`;
const Positive = styled.span`
  color: green;
`;
const Small = styled.span`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.5;
`;

export interface MarketLineProps {
  data: any;
  onClick: () => void;
}

const MarketLine = ({ data, onClick }: MarketLineProps) => {
  const { t } = useTranslation();
  const vestingDate =
    data?.type === "expiry"
      ? new Date(data?.vesting * 1000)
      : addSeconds(new Date(), data?.vesting);
  const vestingCd =
    data?.type === "expiry"
      ? differenceInDays(new Date(data?.vesting * 1000), new Date())
      : data.vesting / (24 * 60 * 60);
  const { data: quoteTokenDetail } = useTokenDetail(data.quoteToken.address);
  const { data: payoutTokenDetail } = useTokenDetail(data.payoutToken.address);
  const capToken = data?.capacityInQuote ? data?.quoteToken : data?.payoutToken;
  const { bondPrice } = useGetBondPrice(
    data?.id,
    quoteTokenDetail,
    payoutTokenDetail
  );
  const capTokenDetail = data?.capacityInQuote
    ? quoteTokenDetail
    : payoutTokenDetail;
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

  const generateDiscount = () => {
    if (!discount) {
      return "";
    }
    if (discount >= 0) {
      return <Positive>{formatNumber(discount)}%</Positive>;
    }
    return <Negative>{formatNumber(discount)}%</Negative>;
  };

  const generateVesting = () => {
    const conclusionDate = new Date(data?.conclusion * 1000);
    if (isAfter(new Date(), conclusionDate)) {
      return t("Ended");
    }
    if (data?.type === "expiry") {
      return `${t("Unlocked on")}: ${format(
        new Date(data?.vesting * 1000),
        "yyyy.MM.dd"
      )}`;
    }
    if (data?.type === "term") {
      return `${t("Locking period")}: ${data.vesting / (24 * 60 * 60)} ${t(
        "day(s)"
      )}`;
    }
  };

  return (
    <tr key={data?.id} onClick={onClick}>
      <td>{data.id}</td>
      <td>
        <Flex alignItems="center">
          <CurrencyLogo size="2rem" currency={data?.quoteToken} />
          <span>{data?.quoteToken.symbol}</span>
        </Flex>
      </td>
      <td>
        <Flex alignItems="center">
          <CurrencyLogo size="2rem" currency={data?.payoutToken} />
          <Flex flexDirection="column">
            {!!bondPrice?.toNumber() && (
              <span>${formatNumber(bondPrice?.toNumber() || 0)}</span>
            )}
            {!!payoutTokenDetail && (
              <Small>${formatNumber(payoutTokenDetail?.price)}</Small>
            )}
          </Flex>
        </Flex>
      </td>
      <td style={{ textAlign: "right" }}>{generateDiscount()}</td>
      <td>
        <Flex flexDirection="column" alignItems="self-end">
          {formatNumber(capacityFormatted)} {capToken?.symbol}
          {!!capTokenDetail && (
            <Small>
              ${formatNumber(capacityFormatted * capTokenDetail?.price)}
            </Small>
          )}
        </Flex>
      </td>
      <td>
        <Flex flexDirection="column">{generateVesting()}</Flex>
      </td>
      <td>${formatNumber(capacityFormatted * capTokenDetail?.price)}</td>
    </tr>
  );
};

export default MarketLine;
