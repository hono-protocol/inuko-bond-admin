import { Currency, Percent, Price } from "@pancakeswap/sdk";
import React from "react";
import { Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { AutoColumn } from "../../components/layout/Column";
import { AutoRow } from "../../components/layout/Row";
import { ONE_BIPS } from "../../config/constants";
import { Field } from "../../state/mint/actions";

function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency };
  noLiquidity?: boolean;
  poolTokenPercentage?: Percent;
  price?: Price;
}) {
  const { t } = useTranslation();
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text>{price?.toSignificant(6) ?? "-"}</Text>
          <Text fontSize="14px" pt={1}>
            {t("%assetA% per %assetB%", {
              assetA: currencies[Field.CURRENCY_B]?.symbol ?? "",
              assetB: currencies[Field.CURRENCY_A]?.symbol ?? "",
            })}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>{price?.invert()?.toSignificant(6) ?? "-"}</Text>
          <Text fontSize="14px" pt={1}>
            {t("%assetA% per %assetB%", {
              assetA: currencies[Field.CURRENCY_A]?.symbol ?? "",
              assetB: currencies[Field.CURRENCY_B]?.symbol ?? "",
            })}
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>
            {noLiquidity && price
              ? "100"
              : (poolTokenPercentage?.lessThan(ONE_BIPS)
                  ? "<0.01"
                  : poolTokenPercentage?.toFixed(2)) ?? "0"}
            %
          </Text>
          <Text fontSize="14px" pt={1}>
            {t("Share of Pool")}
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  );
}

export default PoolPriceBar;
