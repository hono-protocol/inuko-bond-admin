import React, {
  KeyboardEvent,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { Currency, ETHER, Token } from "@pancakeswap/sdk";
import { Text, Input, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { FixedSizeList } from "react-window";
import { useAudioModeManager } from "state/user/hooks";
import useDebounce from "hooks/useDebounce";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import {
  useAllTokens,
  useToken,
  useIsUserAddedToken,
  useFoundOnInactiveList,
} from "../../hooks/Tokens";
import { isAddress } from "../../utils";
import Column, { AutoColumn } from "../layout/Column";
import Row from "../layout/Row";
import CommonBases from "./CommonBases";
import CurrencyList from "./CurrencyList";
import { filterTokens, useSortedTokensByQuery } from "./filtering";
import useTokenComparator from "./sorting";

import ImportRow from "./ImportRow";

interface CurrencySearchProps {
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showImportView: () => void;
  setImportToken: (token: Token) => void;
  listToken?: Token[];
}

const swapSound = new Audio("swap.mp3");

function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showImportView,
  setImportToken,
  listToken,
}: CurrencySearchProps) {
  const { t } = useTranslation();
  const { chainId } = useActiveWeb3React();

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedQuery = useDebounce(searchQuery, 200);

  const [invertSearchOrder] = useState<boolean>(false);

  const allTokens = useAllTokens();

  // if they input an address, use it
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);

  const [audioPlay] = useAudioModeManager();

  const tokenComparator = useTokenComparator(invertSearchOrder);

  const filteredTokens: Token[] = useMemo(() => {
    if (listToken) {
      return listToken.map((s) => s);
    }

    return filterTokens(Object.values(allTokens), debouncedQuery);
  }, [allTokens, debouncedQuery]);

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator).sort((t, t2) => {
      const match = ["USDT", "INUKO", "BTC", "BTCB", "BUSD", "WBNB"];
      if (match.indexOf(t.symbol) >= 0 && match.indexOf(t2.symbol) >= 0) {
        if (match.indexOf(t.symbol) > match.indexOf(t2.symbol)) {
          return 1;
        }
        return -1;
      }
      if (match.indexOf(t.symbol) >= 0 && match.indexOf(t2.symbol) === -1) {
        return 1;
      }
      if (match.indexOf(t2.symbol) >= 0 && match.indexOf(t.symbol) === -1) {
        return 1;
      }
      return -1;
    });
  }, [filteredTokens, tokenComparator]);

  const filteredSortedTokens = useSortedTokensByQuery(
    sortedTokens,
    debouncedQuery
  ).sort(tokenComparator);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      if (audioPlay) {
        // swapSound.play();
      }
    },
    [audioPlay, onCurrencySelect]
  );

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>();

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  const handleInput = useCallback((event) => {
    const input = event.target.value;
    const checksummedInput = isAddress(input);
    setSearchQuery(checksummedInput || input);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === "bnb") {
          handleCurrencySelect(ETHER);
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0]);
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  );

  // if no results on main list, show option to expand into inactive
  const inactiveTokens = useFoundOnInactiveList(debouncedQuery);
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(
    inactiveTokens,
    debouncedQuery
  );

  let finalList = filteredSortedTokens.sort((t, t2) => {
    const match = ["USDT", "INUKO", "BTC", "BTCB", "BUSD", "WBNB"];
    if (match.indexOf(t.symbol) >= 0 && match.indexOf(t2.symbol) >= 0) {
      if (match.indexOf(t.symbol) > match.indexOf(t2.symbol)) {
        return 1;
      }
      return -1;
    }
    if (match.indexOf(t.symbol) >= 0 && match.indexOf(t2.symbol) === -1) {
      return -1;
    }
    if (match.indexOf(t2.symbol) >= 0 && match.indexOf(t.symbol) === -1) {
      return 1;
    }
    return -1;
  });

  if (!listToken) {
    finalList = [Currency.ETHER as any, ...finalList];
  }

  return (
    <>
      <div>
        <AutoColumn gap="16px">
          <Box display={listToken ? "none" : undefined}>
            <Row>
              <Input
                id="token-search-input"
                placeholder={t("Search name or paste address")}
                scale="lg"
                autoComplete="off"
                value={searchQuery}
                ref={inputRef as RefObject<HTMLInputElement>}
                onChange={handleInput}
                onKeyDown={handleEnter}
              />
            </Row>
          </Box>
          {showCommonBases && (
            <CommonBases
              chainId={chainId}
              onSelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
            />
          )}
        </AutoColumn>
        {searchToken && !searchTokenIsAdded ? (
          <Column style={{ padding: "20px 0", height: "100%" }}>
            <ImportRow
              token={searchToken}
              showImportView={showImportView}
              setImportToken={setImportToken}
            />
          </Column>
        ) : filteredSortedTokens?.length > 0 ||
          filteredInactiveTokens?.length > 0 ? (
          <Box margin="24px -24px">
            <CurrencyList
              height={390}
              showETH={false}
              currencies={
                filteredInactiveTokens
                  ? finalList.concat(filteredInactiveTokens)
                  : finalList
              }
              breakIndex={
                !listToken
                  ? inactiveTokens && finalList
                    ? finalList.length
                    : undefined
                  : undefined
              }
              onCurrencySelect={handleCurrencySelect}
              otherCurrency={otherSelectedCurrency}
              selectedCurrency={selectedCurrency}
              fixedListRef={fixedList}
              showImportView={!listToken ? showImportView : undefined}
              setImportToken={setImportToken}
            />
          </Box>
        ) : (
          <Column style={{ padding: "20px", height: "100%" }}>
            <Text color="textSubtle" textAlign="center" mb="20px">
              {t("No results found.")}
            </Text>
          </Column>
        )}
      </div>
    </>
  );
}

export default CurrencySearch;
