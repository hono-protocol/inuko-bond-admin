import React, { useCallback, useState } from "react";
import { Currency, Token } from "@pancakeswap/sdk";
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBackButton,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  Button,
  darkColors,
} from "@bds-libs/uikit";
import styled from "styled-components";
import usePrevious from "hooks/usePreviousValue";
import { TokenList } from "@uniswap/token-lists";
import { useTranslation } from "contexts/Localization";
import CurrencySearch from "./CurrencySearch";
import ImportToken from "./ImportToken";
import Manage from "./Manage";
import ImportList from "./ImportList";
import { CurrencyModalView } from "./types";

const Footer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  text-align: center;
`;

const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.black};
`;

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`;

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  listToken?: Token[];
}

export default function CurrencySearchModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
  listToken,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.search
  );

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss();
      onCurrencySelect(currency);
    },
    [onDismiss, onCurrencySelect]
  );

  // for token import view
  const prevView = usePrevious(modalView);

  // used for import token flow
  const [importToken, setImportToken] = useState<Token | undefined>();

  // used for import list
  const [importList, setImportList] = useState<TokenList | undefined>();
  const [listURL, setListUrl] = useState<string | undefined>();

  const { t } = useTranslation();

  const config = {
    [CurrencyModalView.search]: {
      title: t("Select a Token"),
      onBack: undefined,
    },
    [CurrencyModalView.manage]: {
      title: t("Manage"),
      onBack: () => setModalView(CurrencyModalView.search),
    },
    [CurrencyModalView.importToken]: {
      title: t("Import Tokens"),
      onBack: () =>
        setModalView(
          prevView && prevView !== CurrencyModalView.importToken
            ? prevView
            : CurrencyModalView.search
        ),
    },
    [CurrencyModalView.importList]: {
      title: t("Import List"),
      onBack: () => setModalView(CurrencyModalView.search),
    },
  };

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          {config[modalView].onBack && (
            <ModalBackButton onBack={config[modalView].onBack} />
          )}
          <Heading color={darkColors.primary}>
            {config[modalView].title}
          </Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        {modalView === CurrencyModalView.search ? (
          <CurrencySearch
            onCurrencySelect={handleCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            showCommonBases={showCommonBases}
            showImportView={() => setModalView(CurrencyModalView.importToken)}
            setImportToken={setImportToken}
            listToken={listToken}
          />
        ) : modalView === CurrencyModalView.importToken && importToken ? (
          <ImportToken
            tokens={[importToken]}
            handleCurrencySelect={handleCurrencySelect}
          />
        ) : modalView === CurrencyModalView.importList &&
          importList &&
          listURL ? (
          <ImportList
            list={importList}
            listURL={listURL}
            onImport={() => setModalView(CurrencyModalView.manage)}
          />
        ) : modalView === CurrencyModalView.manage ? (
          <Manage
            setModalView={setModalView}
            setImportToken={setImportToken}
            setImportList={setImportList}
            setListUrl={setListUrl}
          />
        ) : (
          ""
        )}
        {modalView === CurrencyModalView.search && !listToken && (
          <Footer>
            <Button
              scale="sm"
              variant="text"
              onClick={() => setModalView(CurrencyModalView.manage)}
              className="list-token-manage-button"
            >
              {t("Manage Tokens")}
            </Button>
          </Footer>
        )}
      </StyledModalBody>
    </StyledModalContainer>
  );
}
