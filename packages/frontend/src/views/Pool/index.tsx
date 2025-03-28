import React, { useMemo } from "react";
import styled from "styled-components";
import { Pair } from "@pancakeswap/sdk";
import {
  Heading,
  Text,
  Flex,
  CardBody,
  CardFooter,
  Button,
  AddIcon,
  Box,
  darkColors,
} from "@bds-libs/uikit";
import { Link } from "react-router-dom";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import FullPositionCard from "../../components/PositionCard";
import { useTokenBalancesWithLoadingIndicator } from "../../state/wallet/hooks";
import { usePairs } from "../../hooks/usePairs";
import {
  toV2LiquidityToken,
  useTrackedTokenPairs,
} from "../../state/user/hooks";
import Dots from "../../components/Loader/Dots";
import { AppHeader, AppBody } from "../../components/App";
import Page from "../../components/layout/Page";

const Body = styled(CardBody)`
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function Pool() {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  );
  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan("0")
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  const renderBody = () => {
    if (!account) {
      return (
        <Text color="textSubtle" textAlign="center">
          {t("Connect to a wallet to view and update your liquidity.")}
        </Text>
      );
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center">
          <Dots>{t("Loading")}</Dots>
        </Text>
      );
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? "16px" : 0}
        />
      ));
    }
    return (
      <Text color="textSubtle" textAlign="center">
        {t("No liquidity found.")}
      </Text>
    );
  };
  const Hero = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 16px 16px 0 16px;
    text-align: center;
    color: #fff;
  `;
  return (
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
          Liquidity
        </Heading>
      </Hero>
      <AppBody>
        <AppHeader
          title={t("Your Liquidity")}
          subtitle={t("Remove liquidity to receive tokens back")}
        />
        <Body>
          {renderBody()}
          {account && !v2IsLoading && (
            <Flex flexDirection="column" alignItems="center" mt="24px">
              <Text color="textSubtle" mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button
                id="import-pool-link"
                variant="secondary"
                scale="sm"
                as={Link}
                to="/find"
              >
                {t("Find other LP tokens")}
              </Button>
            </Flex>
          )}
        </Body>
        <CardFooter style={{ textAlign: "center" }}>
          {!!account && (
            <Button
              id="join-pool-button"
              as={Link}
              to="/add"
              width="100%"
              startIcon={<AddIcon color="white" />}
            >
              {t("Add Liquidity")}
            </Button>
          )}
        </CardFooter>
      </AppBody>
    </Page>
  );
}
