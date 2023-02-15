import React from "react";
import { Box, Flex, Skeleton, Text } from "@bds-libs/uikit";
import { PublicIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import { Ifo, PoolIds } from "config/constants/types";
import { formatNumber, getBalanceNumber } from "utils/formatBalance";
import { SkeletonCardDetails } from "./Skeletons";

export interface IfoCardDetailsProps {
  poolId: PoolIds;
  ifo: Ifo;
  publicIfoData: PublicIfoData;
}

export interface FooterEntryProps {
  label: string;
  value: string | number;
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small color="#9BCABB">
        {label}
      </Text>
      {value ? (
        <Text fontWeight={900} color="#9BCABB" small textAlign="right">
          {typeof value === "number" ? formatNumber(value, 7) : value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  );
};

const IfoCardDetails: React.FC<IfoCardDetailsProps> = ({
  poolId,
  ifo,
  publicIfoData,
}) => {
  const { t } = useTranslation();
  const { status, currencyPriceInUSD } = publicIfoData;
  const poolCharacteristic = publicIfoData[poolId];

  /* Format start */
  const maxLpTokens = getBalanceNumber(
    poolCharacteristic.limitPerUserInLP,
    ifo.currency.decimals
  );
  const taxRate = `${poolCharacteristic.taxRate}%`;

  const totalCommittedPercent = poolCharacteristic.totalAmountPool
    .div(poolCharacteristic.raisingAmountPool)
    .times(100)
    .toFixed(2);
  const totalLPCommitted = getBalanceNumber(
    poolCharacteristic.totalAmountPool,
    ifo.currency.decimals
  );
  const totalLPCommittedInUSD = currencyPriceInUSD.times(totalLPCommitted);
  const totalCommitted = `${formatNumber(
    totalLPCommittedInUSD.toNumber(),
    5
  )} USDT (${totalCommittedPercent}%)`;

  /* Format end */

  const renderBasedOnIfoStatus = () => {
    if (status === "coming_soon") {
      return (
        <>
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={t("Max entry")}
              value={`${formatNumber(maxLpTokens, 7)} ${ifo.lpName} LP`}
            />
          )}
          <FooterEntry
            label={t("Funds to raise")}
            value={ifo[poolId].raiseAmount}
          />
          <FooterEntry
            label={t("BDS to burn (10%)")}
            value={ifo[poolId].cakeToBurn}
          />
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry label={t("Additional fee:")} value={taxRate} />
          )}
          {/*<FooterEntry*/}
          {/*  label={t("Price per %symbol%", { symbol: ifo.token.symbol })}*/}
          {/*  value={`${ifo.tokenOfferingPrice} USDT`}*/}
          {/*/>*/}
        </>
      );
    }

    if (status === "live") {
      return (
        <>
          <FooterEntry
            label={t("Total %symbol%", { symbol: ifo.token.symbol })}
            value={ifo[PoolIds[poolId]].saleAmount}
          />
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={t("Max entry")}
              value={`${formatNumber(maxLpTokens, 7)} ${ifo.lpName} LP`}
            />
          )}
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry label={t("Additional fee:")} value={taxRate} />
          )}
          <FooterEntry
            label={t("Total committed")}
            value={currencyPriceInUSD.gt(0) ? totalCommitted : null}
          />
        </>
      );
    }
    if (status === "finished") {
      return (
        <>
          {poolId === PoolIds.poolBasic && (
            <FooterEntry
              label={t("Max entry")}
              value={`${formatNumber(maxLpTokens, 7)} ${ifo.lpName} LP`}
            />
          )}
          {poolId === PoolIds.poolUnlimited && (
            <FooterEntry label={t("Additional fee:")} value={taxRate} />
          )}
          <FooterEntry
            label={t("Total committed")}
            value={currencyPriceInUSD.gt(0) ? totalCommitted : null}
          />
          <FooterEntry
            label={t("Funds to raise")}
            value={ifo[poolId].raiseAmount}
          />
          <FooterEntry
            label={t("BDS to burn (10%)")}
            value={ifo[poolId].cakeToBurn}
          />
          {/*<FooterEntry*/}
          {/*  label={t("Price per %symbol%", { symbol: ifo.token.symbol })}*/}
          {/*  value={`${*/}
          {/*    ifo.tokenOfferingPrice ? ifo.tokenOfferingPrice : "?"*/}
          {/*  } USDT`}*/}
          {/*/>*/}
        </>
      );
    }
    return <SkeletonCardDetails />;
  };

  return <Box paddingTop="24px">{renderBasedOnIfoStatus()}</Box>;
};

export default IfoCardDetails;
