import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
  useRef,
} from "react";
import { Route, useRouteMatch, useLocation } from "react-router-dom";
import { useAppDispatch } from "state";
import BigNumber from "bignumber.js";
import { Heading, Box } from "@bds-libs/uikit";
import styled from "styled-components";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import { useFarms, usePriceCakeBusd, useGetApiPrices } from "state/hooks";
import useRefresh from "hooks/useRefresh";
import { fetchFarmUserDataAsync } from "state/actions";
import { Farm } from "state/types";
import { useTranslation } from "contexts/Localization";
import { getFarmApr } from "utils/apr";
import { orderBy } from "lodash";
import { getAddress, getMasterChefAddress } from "utils/addressHelpers";
import isArchivedPid from "utils/farmHelpers";
import { latinise } from "utils/latinise";
import {
  fetchFarmsPublicDataAsync,
  setLoadArchivedFarmsData,
} from "state/farms";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import NavBar from "./components/NavBar";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto auto;
  padding: 32px 16px;
  text-align: center;
  color: #fff;
`;

const NUMBER_OF_FARMS_VISIBLE = 12;

const Farms: React.FC<{ isPool?: boolean }> = ({ isPool }) => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { data: farmsLP } = useFarms();
  const cakePrice = usePriceCakeBusd();
  const [query] = useState("");
  const { account } = useActiveWeb3React();
  const [sortOption] = useState("hot");
  const prices = useGetApiPrices();
  const dispatch = useAppDispatch();

  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      // @ts-ignore
      dispatch(fetchFarmUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const isArchived = pathname.includes("archived");
  const isInactive = pathname.includes("history");
  const isActive = !isInactive && !isArchived;
  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  useEffect(() => {
    // Makes the main scheduled fetching to request archived farms data
    dispatch(setLoadArchivedFarmsData(isArchived));
    // Immediately request data for archived farms so users don't have to wait
    // 60 seconds for public data and 10 seconds for user data
    if (isArchived) {
      // @ts-ignore
      dispatch(fetchFarmsPublicDataAsync());
      if (account) {
        // @ts-ignore
        dispatch(fetchFarmUserDataAsync(account));
      }
    }
  }, [isArchived, dispatch, account]);

  const activeFarms = farmsLP.filter((farm) => !isArchivedPid(farm.pid));
  const inactiveFarms = farmsLP.filter((farm) => !isArchivedPid(farm.pid));
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid));

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay
        .filter((f) => {
          if (isPool) {
            return (
              getAddress(f.token.address) === getAddress(f.quoteToken.address)
            );
          } else {
            return (
              getAddress(f.token.address) !== getAddress(f.quoteToken.address)
            );
          }
        })
        .map((farm) => {
          if (!farm.lpTotalInQuoteToken || !prices) {
            return farm;
          }

          const quoteTokenPriceUsd =
            prices[getAddress(farm.quoteToken.address).toLowerCase()];

          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
            quoteTokenPriceUsd
          );

          const earnTokenPrice =
            prices[getAddress(farm.earnToken.address).toLowerCase()];

          const apr = isActive
            ? getFarmApr(
                farm.poolWeight,
                new BigNumber(earnTokenPrice || 0),
                totalLiquidity,
                farm.perBlock
              )
            : 0;

          return { ...farm, apr, liquidity: totalLiquidity };
        });

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase());
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter(
          (farm: FarmWithStakedValue) => {
            return latinise(farm.lpSymbol.toLowerCase()).includes(
              lowercaseQuery
            );
          }
        );
      }
      return farmsToDisplayWithAPR;
    },
    [cakePrice, prices, query, isActive, isPool]
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(
    NUMBER_OF_FARMS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case "apr":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => farm.apr,
            "desc"
          );
        case "multiplier":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0,
            "desc"
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            "desc"
          );
        case "liquidity":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => Number(farm.liquidity),
            "desc"
          );
        default:
          return farms;
      }
    };

    if (isActive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedOnlyFarms)
        : farmsList(activeFarms);
    }
    if (isInactive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedInactiveFarms)
        : farmsList(inactiveFarms);
    }
    if (isArchived) {
      farmsStaked = stakedOnly
        ? farmsList(stakedArchivedFarms)
        : farmsList(archivedFarms);
    }

    return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    numberOfFarmsVisible,
  ]);

  useEffect(() => {
    const showMoreFarms = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfFarmsVisible(
          (farmsCurrentlyVisible) =>
            farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        );
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMoreFarms, {
        rootMargin: "0px",
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [farmsStakedMemoized, observerIsSet]);

  const renderContent = (): JSX.Element => {
    return (
      <div>
        <FlexLayout>
          <Route exact path={`${path}`}>
            {farmsStakedMemoized.map((farm) => {
              const earnPrice =
                prices[getAddress(farm.earnToken.address).toLowerCase()];
              return (
                <FarmCard
                  isPool={isPool}
                  key={farm.pid + getMasterChefAddress(farm.masterChefContract)}
                  farm={farm}
                  earnPrice={earnPrice}
                  account={account}
                  removed={false}
                />
              );
            })}
          </Route>
        </FlexLayout>
      </div>
    );
  };

  return (
    <>
      <Hero>
        <>
          <Heading
            textAlign="center"
            as="h1"
            size="xl"
            fontWeight={900}
            color="#fff"
            textTransform="uppercase"
          >
            {t("STAKING")}
          </Heading>
          <Box mt="25px" mb="0.25rem" textAlign="center">
            <Box
              fontSize={{ _: "16px", lg: "25px" }}
              lineHeight={{ _: "20px", lg: "29px" }}
              color="#9BCABB"
              fontWeight={900}
            >
              {t(
                "Stake LP Tokens in Farms or stake Tokens in Pools to earn Tokens."
              )}
            </Box>
          </Box>
          <Box textAlign="center" mb="1rem">
            <Box
              fontSize={{ _: "16px", lg: "25px" }}
              lineHeight={{ _: "20px", lg: "29px" }}
              color="#9BCABB"
              fontWeight={900}
            >
              {t(
                "Deposit and withdraw at any time. Reward is updated for APR fascinating!"
              )}
            </Box>
          </Box>
          <NavBar />
        </>
      </Hero>
      <Page>
        {renderContent()}
        <div ref={loadMoreRef} />
      </Page>
    </>
  );
};

export default Farms;
