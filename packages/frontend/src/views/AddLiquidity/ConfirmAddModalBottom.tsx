import { Currency, CurrencyAmount, Fraction, Percent } from "@pancakeswap/sdk";
import React, { useState } from "react";
import { Button, darkColors, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { RowBetween, RowFixed } from "../../components/layout/Row";
import { CurrencyLogo } from "../../components/Logo";
import { Field } from "../../state/mint/actions";

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
  onDismiss,
}: {
  noLiquidity?: boolean;
  price?: Fraction;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  poolTokenPercentage?: Percent;
  onAdd: () => void;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <RowBetween>
        <Text color={darkColors.black}>
          {t("%asset% Deposited", {
            asset: currencies[Field.CURRENCY_A]?.symbol,
          })}
        </Text>
        <RowFixed>
          <CurrencyLogo
            currency={currencies[Field.CURRENCY_A]}
            style={{ marginRight: "8px" }}
          />
          <Text color={darkColors.black}>
            {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text color={darkColors.black}>
          {t("%asset% Deposited", {
            asset: currencies[Field.CURRENCY_B]?.symbol,
          })}
        </Text>
        <RowFixed>
          <CurrencyLogo
            currency={currencies[Field.CURRENCY_B]}
            style={{ marginRight: "8px" }}
          />
          <Text color={darkColors.black}>
            {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <Text color={darkColors.black}>{t("Rates")}</Text>
        <Text color={darkColors.black}>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(
            4
          )} ${currencies[Field.CURRENCY_B]?.symbol}`}
        </Text>
      </RowBetween>
      <RowBetween style={{ justifyContent: "flex-end" }}>
        <Text color={darkColors.black}>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price
            ?.invert()
            .toSignificant(4)} ${currencies[Field.CURRENCY_A]?.symbol}`}
        </Text>
      </RowBetween>
      <RowBetween>
        <Text color={darkColors.black}>{t("Share of Pool")}:</Text>
        <Text color={darkColors.black}>
          {noLiquidity ? "100" : poolTokenPercentage?.toSignificant(4)}%
        </Text>
      </RowBetween>
      <Button
        onClick={async () => {
          try {
            setLoading(true);
            await onAdd();
            onDismiss?.();
          } catch (err) {
            throw err;
          } finally {
            setLoading(false);
          }
        }}
        mt="20px"
        isLoading={loading}
        disabled={loading}
      >
        {noLiquidity ? t("Create Pool & Supply") : t("Confirm Supply")}
      </Button>
    </>
  );
}

export default ConfirmAddModalBottom;
