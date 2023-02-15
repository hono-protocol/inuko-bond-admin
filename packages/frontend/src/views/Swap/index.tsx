import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CurrencyAmount, JSBI, Token, Trade } from "@pancakeswap/sdk";
import {
  Button,
  Text,
  DownIcon,
  Box,
  useModal,
  Grid,
  darkColors,
} from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
import { RouteComponentProps } from "react-router-dom";

import { useIsTransactionUnsupported } from "hooks/Trades";
import UnsupportedCurrencyFooter from "components/UnsupportedCurrencyFooter";
import { useTranslation } from "contexts/Localization";
import SwapWarningTokens from "config/constants/swapWarningTokens";
import { getAddress } from "utils/addressHelpers";
import AddressInputPanel from "./components/AddressInputPanel";
import { GreyCard } from "../../components/Card";
import Column, { AutoColumn } from "../../components/layout/Column";
import ConfirmSwapModal from "./components/ConfirmSwapModal";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import { AutoRow, RowBetween } from "../../components/layout/Row";
import AdvancedSwapDetailsDropdown from "./components/AdvancedSwapDetailsDropdown";
import confirmPriceImpactWithoutFee from "./components/confirmPriceImpactWithoutFee";
import { ArrowWrapper, SwapCallbackError, Wrapper } from "./components/styleds";
import TradePrice from "./components/TradePrice";
import ImportTokenWarningModal from "./components/ImportTokenWarningModal";
import ProgressSteps from "./components/ProgressSteps";
import { AppHeader, AppBody } from "../../components/App";
import ConnectWalletButton from "../../components/UnlockButton";

import { INITIAL_ALLOWED_SLIPPAGE, INUKO_TAX } from "../../config/constants";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { useCurrency, useAllTokens } from "../../hooks/Tokens";
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from "../../hooks/useApproveCallback";
import { useSwapCallback } from "../../hooks/useSwapCallback";
import useWrapCallback, { WrapType } from "../../hooks/useWrapCallback";
import { Field } from "../../state/swap/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/swap/hooks";
import {
  useExpertModeManager,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from "../../state/user/hooks";
import { maxAmountSpend } from "../../utils/maxAmountSpend";
import {
  computeTradePriceBreakdown,
  warningSeverity,
} from "../../utils/prices";
import CircleLoader from "../../components/Loader/CircleLoader";
import Page from "../../components/layout/Page";
import SwapWarningModal from "./components/SwapWarningModal";
import ButtonAmount from "../../components/ButtonAmount";
import tokens, { createToken } from "config/constants/tokens";
import { useGetAmount } from "hooks/useTotalSupply";

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

const WrapperStyled = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 128px);
  padding-bottom: 50px;
`;

export default function Swap({ history }: RouteComponentProps) {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const maxLimit = useGetAmount(createToken(tokens.sig), "_maxTxAmount");

  const { t } = useTranslation();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );

  // dismiss warning if all imported tokens are in active lists
  const defaultTokens = useAllTokens();
  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens);
    });

  const { account } = useActiveWeb3React();

  // for expert mode
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );

  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const [singleHopOnly] = useUserSingleHopOnly();

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee)
    ) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    });
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message || error,
          txHash: undefined,
        });
      });
  }, [priceImpactWithoutFee, swapCallback, tradeToConfirm, t, setSwapState]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
    });
  }, [attemptingTxn, swapErrorMessage, trade, txHash]);

  // swap warning state
  const [swapWarningCurrency, setSwapWarningCurrency] = useState(null);
  const [onPresentSwapWarningModal] = useModal(
    <SwapWarningModal swapCurrency={swapWarningCurrency} />
  );

  const shouldShowSwapWarning = (swapCurrency) => {
    const isWarningToken = Object.entries(SwapWarningTokens).find(
      (warningTokenConfig) => {
        const warningTokenData = warningTokenConfig[1];
        const warningTokenAddress = getAddress(warningTokenData.address);
        return swapCurrency.address === warningTokenAddress;
      }
    );
    return Boolean(isWarningToken);
  };

  useEffect(() => {
    if (swapWarningCurrency) {
      onPresentSwapWarningModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapWarningCurrency]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
      const showSwapWarning = shouldShowSwapWarning(inputCurrency);
      if (showSwapWarning) {
        setSwapWarningCurrency(inputCurrency);
      } else {
        setSwapWarningCurrency(null);
      }
    },
    [onCurrencySelection]
  );

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);

  const handleInputAmount = (amount: number) => {
    return () => {
      if (maxAmountInput) {
        onUserInput(
          Field.INPUT,
          new BigNumber(maxAmountInput.toExact())
            .multipliedBy(amount)
            .toFixed(5)
            .toString()
        );
      }
    };
  };

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
      const showSwapWarning = shouldShowSwapWarning(outputCurrency);
      if (showSwapWarning) {
        setSwapWarningCurrency(outputCurrency);
      } else {
        setSwapWarningCurrency(null);
      }
    },

    [onCurrencySelection]
  );

  const swapIsUnsupported = useIsTransactionUnsupported(
    currencies?.INPUT,
    currencies?.OUTPUT
  );

  const [onPresentImportTokenWarningModal] = useModal(
    <ImportTokenWarningModal
      tokens={importTokensNotInDefault}
      onCancel={() => history.push("/swap/")}
    />
  );

  useEffect(() => {
    if (importTokensNotInDefault.length > 0) {
      onPresentImportTokenWarningModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importTokensNotInDefault.length]);

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      trade={trade}
      originalTrade={tradeToConfirm}
      onAcceptChanges={handleAcceptChanges}
      attemptingTxn={attemptingTxn}
      txHash={txHash}
      recipient={recipient}
      allowedSlippage={allowedSlippage}
      onConfirm={handleSwap}
      swapErrorMessage={swapErrorMessage}
      customOnDismiss={handleConfirmDismiss}
    />,
    true,
    true,
    "confirmSwapModal"
  );
  const maxLimitBn = new BigNumber(
    maxLimit?.toFixed(tokens.sig.decimals) || "0"
  );

  const isValidInuko = useMemo(() => {
    if (
      currencies.INPUT?.symbol !== tokens.sig.symbol &&
      currencies.OUTPUT?.symbol !== tokens.sig.symbol
    ) {
      return true;
    }
    if (currencies.INPUT?.symbol === tokens.sig.symbol) {
      return new BigNumber(formattedAmounts.INPUT || "0").isLessThan(
        new BigNumber(maxLimitBn)
      );
    }

    if (currencies.OUTPUT?.symbol === tokens.sig.symbol) {
      return new BigNumber(formattedAmounts.OUTPUT || "0").isLessThan(
        new BigNumber(maxLimitBn)
      );
    }

    return true;
  }, [currencies, maxLimitBn]);

  const swapToInuko = currencies.OUTPUT?.symbol === tokens.sig.symbol;
  const inukoAfterTax =
    swapToInuko &&
    new BigNumber(formattedAmounts.OUTPUT || "0").multipliedBy(INUKO_TAX);

  return (
    <div>
      <Page>
        <WrapperStyled>
          <AppBody>
            <AppHeader
              title={
                <Box fontSize="20px" color="textSubtle">
                  {t("Exchange")}
                </Box>
              }
              subtitle={
                <Box color="primaryBright" fontSize="17px">
                  {t("Trade tokens in an instant")}
                </Box>
              }
            />
            <Wrapper id="swap-page">
              <AutoColumn gap="md">
                <CurrencyInputPanel
                  label={
                    independentField === Field.OUTPUT && !showWrap && trade
                      ? t("From (estimated)")
                      : t("From")
                  }
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  onUserInput={handleTypeInput}
                  onMax={handleMaxInput}
                  onCurrencySelect={handleInputSelect}
                  otherCurrency={currencies[Field.OUTPUT]}
                  id="swap-currency-input"
                />
                <Grid gridTemplateColumns="1fr 1fr 1fr 1fr" gridGap="8px">
                  <ButtonAmount onClick={handleInputAmount(0.25)}>
                    25%
                  </ButtonAmount>
                  <ButtonAmount onClick={handleInputAmount(0.5)}>
                    50%
                  </ButtonAmount>
                  <ButtonAmount onClick={handleInputAmount(0.75)}>
                    75%
                  </ButtonAmount>
                  <ButtonAmount onClick={handleMaxInput}>100%</ButtonAmount>
                </Grid>
                <AutoColumn justify="space-between">
                  <AutoRow
                    justify={isExpertMode ? "space-between" : "center"}
                    style={{ padding: "0 1rem" }}
                  >
                    <ArrowWrapper clickable>
                      <DownIcon
                        width="16px"
                        onClick={() => {
                          setApprovalSubmitted(false); // reset 2 step UI for approvals
                          onSwitchTokens();
                        }}
                        color={
                          currencies[Field.INPUT] && currencies[Field.OUTPUT]
                            ? darkColors.black
                            : darkColors.black
                        }
                      />
                    </ArrowWrapper>
                    {recipient === null && !showWrap && isExpertMode ? (
                      <Button
                        variant="text"
                        id="add-recipient-button"
                        onClick={() => onChangeRecipient("")}
                      >
                        {t("+ Add a send (optional)")}
                      </Button>
                    ) : null}
                  </AutoRow>
                </AutoColumn>
                <CurrencyInputPanel
                  value={formattedAmounts[Field.OUTPUT]}
                  onUserInput={handleTypeOutput}
                  label={
                    independentField === Field.INPUT && !showWrap && trade
                      ? t("To (estimated)")
                      : t("To")
                  }
                  showMaxButton={false}
                  currency={currencies[Field.OUTPUT]}
                  onCurrencySelect={handleOutputSelect}
                  otherCurrency={currencies[Field.INPUT]}
                  id="swap-currency-output"
                />

                {isExpertMode && recipient !== null && !showWrap ? (
                  <>
                    <AutoRow
                      justify="space-between"
                      style={{ padding: "0 1rem" }}
                    >
                      <ArrowWrapper clickable={false}>
                        <DownIcon width="16px" />
                      </ArrowWrapper>
                      <Button
                        variant="text"
                        id="remove-recipient-button"
                        onClick={() => onChangeRecipient(null)}
                      >
                        {t("- Remove send")}
                      </Button>
                    </AutoRow>
                    <AddressInputPanel
                      id="recipient"
                      value={recipient}
                      onChange={onChangeRecipient}
                    />
                  </>
                ) : null}

                {showWrap ? null : (
                  <AutoColumn gap="8px" style={{ padding: "0 16px" }}>
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Label>{t("Price")}</Label>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <Label>{t("Slippage Tolerance")}</Label>
                        <Text bold color="primary">
                          {allowedSlippage / 100}%
                        </Text>
                      </RowBetween>
                    )}
                  </AutoColumn>
                )}
              </AutoColumn>
              <Box mt="1rem">
                {swapIsUnsupported ? (
                  <Button width="100%" disabled mb="4px">
                    {t("Unsupported Asset")}
                  </Button>
                ) : !account ? (
                  <ConnectWalletButton width="100%" />
                ) : showWrap ? (
                  <Button
                    width="100%"
                    disabled={Boolean(wrapInputError)}
                    onClick={onWrap}
                  >
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP
                        ? "Wrap"
                        : wrapType === WrapType.UNWRAP
                        ? "Unwrap"
                        : null)}
                  </Button>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: "center" }}>
                    <Text color="textSubtle" mb="4px">
                      {t("Insufficient liquidity for this trade.")}
                    </Text>
                    {singleHopOnly && (
                      <Text color="textSubtle" mb="4px">
                        {t("Try enabling multi-hop trades.")}
                      </Text>
                    )}
                  </GreyCard>
                ) : showApproveFlow ? (
                  <RowBetween>
                    <Button
                      variant={
                        approval === ApprovalState.APPROVED
                          ? "success"
                          : "primary"
                      }
                      onClick={approveCallback}
                      disabled={
                        approval !== ApprovalState.NOT_APPROVED ||
                        approvalSubmitted
                      }
                      width="48%"
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          {t("Enabling")} <CircleLoader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted &&
                        approval === ApprovalState.APPROVED ? (
                        t("Enabled")
                      ) : (
                        t("Enable %asset%", {
                          asset: currencies[Field.INPUT]?.symbol ?? "",
                        })
                      )}
                    </Button>
                    <Button
                      variant={
                        isValid && priceImpactSeverity > 2
                          ? "danger"
                          : "primary"
                      }
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap();
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            txHash: undefined,
                          });
                          onPresentConfirmModal();
                        }
                      }}
                      width="48%"
                      id="swap-button"
                      disabled={
                        !isValid ||
                        approval !== ApprovalState.APPROVED ||
                        (priceImpactSeverity > 3 && !isExpertMode)
                      }
                    >
                      {priceImpactSeverity > 3 && !isExpertMode
                        ? t("Price Impact High")
                        : priceImpactSeverity > 2
                        ? t("Swap Anyway")
                        : t("Swap")}
                    </Button>
                  </RowBetween>
                ) : (
                  <Button
                    variant={
                      isValid && priceImpactSeverity > 2 && !swapCallbackError
                        ? "danger"
                        : "primary"
                    }
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap();
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          txHash: undefined,
                        });
                        onPresentConfirmModal();
                      }
                    }}
                    id="swap-button"
                    width="100%"
                    disabled={
                      !isValid ||
                      (priceImpactSeverity > 3 && !isExpertMode) ||
                      !!swapCallbackError ||
                      !isValidInuko
                    }
                  >
                    {swapInputError ||
                      (!isValidInuko && `Exceed INUKO Max Amount`) ||
                      (priceImpactSeverity > 3 && !isExpertMode
                        ? `Price Impact Too High`
                        : priceImpactSeverity > 2
                        ? t("Swap Anyway")
                        : t("Swap"))}
                  </Button>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: "1rem" }}>
                    <ProgressSteps
                      steps={[approval === ApprovalState.APPROVED]}
                    />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? (
                  <SwapCallbackError error={swapErrorMessage} />
                ) : null}
                <Text
                  mt="10px"
                  fontSize="12px"
                  lineHeight="11px"
                  textAlign="center"
                  color="textSubtle"
                >
                  {t(
                    "Estimated amount shown is before tax. Tax will be deducted upon transaction"
                  )}
                </Text>
              </Box>
            </Wrapper>
          </AppBody>
          {!swapIsUnsupported ? (
            <AdvancedSwapDetailsDropdown
              trade={trade}
              inukoAfterTax={inukoAfterTax}
            />
          ) : (
            <UnsupportedCurrencyFooter
              currencies={[currencies.INPUT, currencies.OUTPUT]}
            />
          )}
        </WrapperStyled>
      </Page>
    </div>
  );
}
