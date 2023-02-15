import React from "react";
import { Currency, Pair } from "@pancakeswap/sdk";
import {
  Button,
  ChevronDownIcon,
  Text,
  useModal,
  Flex,
  Box,
  darkColors,
} from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import CurrencySearchModal, {
  CurrencySearchModalProps,
} from "../SearchModal/CurrencySearchModal";
import { CurrencyLogo, DoubleCurrencyLogo } from "../Logo";

import { RowBetween } from "../layout/Row";
import { Input as NumericalInput } from "./NumericalInput";

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 2px 12px;
  border: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: 27.5px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px 12px;
  }
`;
const CurrencySelectButton = styled(Button).attrs({
  variant: "text",
  scale: "sm",
})`
  padding: 0 4px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 12px;
  }
`;
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 20px;
`;
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`;
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  // background-color: ${({ theme }) => theme.colors.input};
  // box-shadow: ${({ theme }) => theme.shadows.inset};
`;
const MaxButton = styled(Button)`
  font-size: 14px;
  line-height: 20px;
  font-weight: 300;
  text-transform: none;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ButtonAdd = styled(Button)`
  padding-left: 12px;
  padding-right: 12px;
  height: 38px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.yellow};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 16px;
    padding-right: 16px;
    height: 55px;
    font-size: 15px;
  }
`;
interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
  modalCurrencyProps?: Partial<CurrencySearchModalProps>;
  disableAddToken?: boolean;
}

const logos = {
  BDS: "/images/tokens/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b.png",
  BTN: "/images/tokens/0x280f1638a642fa379e7cb8094411fc7fac919d70.png",
  BIG: "/images/tokens/0xa7e4a0c5272f2c892b58c1352ee041d31606f0f9.png",
  USDT: "/images/tokens/0x55d398326f99059fF775485246999027B3197955.png",
  WBNB: "/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png",
};

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  modalCurrencyProps,
  disableAddToken,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React();
  const isMobile = sessionStorage.getItem("mobile");

  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );

  const { t } = useTranslation();
  const translatedLabel = label || t("Input");

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      {...modalCurrencyProps}
    />
  );

  async function handleAddToken() {
    const provider = (window as any).ethereum;
    const token = currency as any;
    if (currency && provider && token.address) {
      try {
        let logo = token?.tokenInfo?.logoURI;

        if (logos[token.symbol]) {
          logo = logos[token.symbol];
        }

        if (logo?.indexOf("/") === 0) {
          logo = `${window.origin}${logo}`;
        }

        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await provider.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: token.address, // The address that the token is at.
              symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: token.decimals, // The number of decimals in the token
              image: logo, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.log(error, token);
      }
    }
  }

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontWeight="700" color="primaryBright" fontSize="14px">
                {translatedLabel}
              </Text>
              {account && (
                <Text
                  onClick={onMax}
                  fontSize="14px"
                  fontWeight={300}
                  style={{ display: "inline", cursor: "pointer" }}
                  color={darkColors.black}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? t("Balance: %amount%", {
                        amount: selectedCurrencyBalance?.toSignificant(6) ?? "",
                      })
                    : " -"}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <Box display="flex" alignItems="center" mt="6px">
          <Box flex="1">
            <InputRow
              style={hideInput ? { padding: "0", borderRadius: "8px" } : {}}
              selected={disableCurrencySelect}
            >
              {!hideInput && (
                <>
                  <NumericalInput
                    className="token-amount-input"
                    value={value}
                    onUserInput={(val) => {
                      onUserInput(val);
                    }}
                  />
                  {account && currency && showMaxButton && label !== "To" && (
                    <MaxButton onClick={onMax} scale="sm" variant="text">
                      Max
                    </MaxButton>
                  )}
                </>
              )}
              <CurrencySelectButton
                selected={!!currency}
                className="open-currency-select-button"
                onClick={() => {
                  if (!disableCurrencySelect) {
                    onPresentCurrencyModal();
                  }
                }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  {pair ? (
                    <DoubleCurrencyLogo
                      currency0={pair.token0}
                      currency1={pair.token1}
                      size={16}
                      margin
                    />
                  ) : currency ? (
                    <CurrencyLogo
                      currency={currency}
                      size="24px"
                      style={{ marginRight: "8px" }}
                    />
                  ) : null}
                  {pair ? (
                    <Text id="pair">
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </Text>
                  ) : (
                    <Text
                      id="pair"
                      color={darkColors.black}
                      fontSize="14px"
                      lineHeight="16px"
                      fontWeight={300}
                    >
                      {(currency &&
                      currency.symbol &&
                      currency.symbol.length > 20
                        ? `${currency.symbol.slice(
                            0,
                            4
                          )}...${currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length
                          )}`
                        : currency?.symbol) || t("Select a currency")}
                    </Text>
                  )}
                  {!disableCurrencySelect && (
                    <ChevronDownIcon color={darkColors.black} />
                  )}
                </Flex>
              </CurrencySelectButton>
            </InputRow>
          </Box>
          {!disableAddToken && !isMobile && (
            <Box ml="8px">
              <ButtonAdd disabled={!currency} onClick={handleAddToken}>
                {t("Add")}
              </ButtonAdd>
            </Box>
          )}
        </Box>
      </Container>
    </InputPanel>
  );
}
