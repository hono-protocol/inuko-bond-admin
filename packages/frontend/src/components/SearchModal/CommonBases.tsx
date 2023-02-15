import React from "react";
import {
  ChainId,
  Currency,
  currencyEquals,
  ETHER,
  Token,
} from "@pancakeswap/sdk";
import { darkColors, Text } from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";

import { SUGGESTED_BASES } from "../../config/constants";
import { AutoColumn } from "../layout/Column";
import QuestionHelper from "../QuestionHelper";
import { AutoRow } from "../layout/Row";
import { CurrencyLogo } from "../Logo";

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid
    ${({ theme, disable }) => (disable ? "transparent" : theme.colors.black)};
  border-radius: 10px;
  display: flex;
  padding: 6px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && "pointer"};
    background-color: ${({ theme, disable }) =>
      !disable && theme.colors.background};
  }

  background-color: ${({ theme, disable }) => disable && theme.colors.primary};
  opacity: ${({ disable }) => disable && "0.4"};
`;

const logos = {
  BDS: "/images/tokens/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b.png",
  BTN: "/images/tokens/0x280f1638a642fa379e7cb8094411fc7fac919d70.png",
  BIG: "/images/tokens/0xa7e4a0c5272f2c892b58c1352ee041d31606f0f9.png",
};

export default function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: ChainId;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const { t } = useTranslation();

  return (
    <AutoColumn gap="md">
      <AutoRow>
        <Text fontSize="14px" color={darkColors.black}>
          {t("Common bases")}
        </Text>
        <QuestionHelper
          text={t("These tokens are commonly paired with other tokens.")}
          ml="4px"
        />
      </AutoRow>
      <AutoRow gap="4px">
        {(chainId ? SUGGESTED_BASES[chainId] : []).map((token: Token) => {
          const selected =
            selectedCurrency instanceof Token &&
            selectedCurrency.address === token.address;
          return (
            <BaseWrapper
              onClick={() => !selected && onSelect(token)}
              disable={selected}
              key={token.address}
            >
              <CurrencyLogo
                logo={logos[token.symbol] || undefined}
                currency={token}
                style={{ marginRight: 8 }}
              />
              <Text color={darkColors.black}>{token.symbol}</Text>
            </BaseWrapper>
          );
        })}
        <BaseWrapper
          onClick={() => {
            if (!selectedCurrency || !currencyEquals(selectedCurrency, ETHER)) {
              onSelect(ETHER);
            }
          }}
          disable={selectedCurrency === ETHER}
        >
          <CurrencyLogo currency={ETHER} style={{ marginRight: 8 }} />
          <Text color={darkColors.black}>BNB</Text>
        </BaseWrapper>
      </AutoRow>
    </AutoColumn>
  );
}
