import { BaseLayout, Heading, Box, Text } from "@bds-libs/uikit";
import Page from "components/layout/Page";
import PageHeader from "components/PageHeader";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import React, { useEffect } from "react";
import { useAppDispatch } from "state";
import { fetchReferralInfoAsync } from "state/referrals";
import styled from "styled-components";
import InputReferral from "./components/InputReferral";
import MyReferralLinkCard from "./components/MyReferralLinkCard";
import TotalCommissionCard from "./components/TotalCommissionCard";
import TotalReferralCard from "./components/TotalReferralCard";
import UnlockWalletCard from "./components/UnlockWalletCard";

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const Referrals: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (account) {
      // @ts-ignore
      dispatch(fetchReferralInfoAsync(account));
    }
  }, [dispatch, account]);

  return (
    <>
      <Box>
        <Heading
          textAlign="center"
          as="h1"
          size="lg"
          fontWeight={900}
          color="#fff"
          style={{ textTransform: "uppercase" }}
          mt="2rem"
        >
          {t("Referrals")}
        </Heading>
      </Box>
      <Page>
        {!account ? (
          <UnlockWalletCard />
        ) : (
          <Box maxWidth="760px" mx="auto" pb="4rem">
            <InputReferral />
            <Box textAlign="center" maxWidth="600px" my="16px" mx="auto">
              <Heading
                textAlign="center"
                as="h1"
                size="lg"
                fontWeight={900}
                color="#fff"
                style={{ textTransform: "uppercase", fontSize: 14 }}
              >
                {t("Share and guide your friends")}
              </Heading>
            </Box>
            <Box mb="8px">
              <MyReferralLinkCard />
            </Box>
            <Heading
              textAlign="center"
              as="h1"
              fontWeight={900}
              color="#fff"
              style={{
                textTransform: "uppercase",
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              {t("Receive 1% on reward of friends forever when ref")}
            </Heading>
            <Box mb="16px">
              <TotalReferralCard />
            </Box>
            <TotalCommissionCard />
          </Box>
        )}
      </Page>
    </>
  );
};

export default Referrals;
