import React, { useEffect } from "react";
import VaultCard from "./components/VaultCard";
import { Heading, Box, Text } from "@bds-libs/uikit";
import { useSelector } from "react-redux";
import { State } from "../../state/types";
import styled from "styled-components";
import FlexLayout from "../../components/layout/Flex";
import Page from "components/layout/Page";
import { useAppDispatch } from "../../state";
import useRefresh from "../../hooks/useRefresh";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { fetchVaultUserDataAsync } from "../../state/vaults";
import { useTranslation } from "../../contexts/Localization";
import NavBar from "./components/NavBar";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 32px 16px 0 16px;
  text-align: center;
  color: #fff;
`;

function Vault({ isPool = false }) {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const vaults = useSelector((state: State) => {
    return state.vaults.data;
  });

  const userDataLoaded = useSelector((state: State) => {
    return state.vaults.userDataLoaded;
  });

  const dispatch = useAppDispatch();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      // @ts-ignore
      dispatch(fetchVaultUserDataAsync(account));
    }
  }, [account, dispatch, slowRefresh]);

  return (
    <div style={{ paddingBottom: "3rem" }}>
      <Hero>
        <Heading
          textAlign="center"
          as="h1"
          size="xl"
          fontWeight={900}
          color="#fff"
        >
          Vaults
        </Heading>
        <Box mt="10px" textAlign="center" maxWidth="550px">
          <Text fontSize="20px" color="primaryBright" fontWeight={900}>
            {t(
              "Deposit and Withdraw anytime! Rewards will be reinvested automatically to have attractive APY."
            )}
          </Text>
        </Box>
        <NavBar />
      </Hero>

      <Page>
        <FlexLayout>
          {vaults.map((v) => {
            return (
              <VaultCard
                userDataLoaded={userDataLoaded}
                key={v.id}
                isSingle={true}
                farm={v}
                earnPerDay="10"
                depositFee="0"
                totalValue="100,200"
              />
            );
          })}
        </FlexLayout>

        {!isPool && (
          <Box px="10px">
            <Box
              color="primaryBright"
              py="20px"
              px="20px"
              bg="#052E22"
              borderRadius="15px"
            >
              <Box fontSize="15px" lineHeight="24px" color="textSubtle">
                {t("Notice for LP Token:")}
              </Box>
              <Box mt="14px" as="ul">
                <Box as="li" fontSize="14px" lineHeight="20px">
                  {t(
                    `You will receive Tokens (starts with "farm XXX") as Receipt for staking Token LP.`
                  )}
                </Box>
                <Box as="li" fontSize="14px" lineHeight="20px">
                  {t(
                    `Token farm XXX will be used for unstaking your LP Token, so don't transfer that token to anyone.`
                  )}
                </Box>
                <Box as="li" fontSize="14px" lineHeight="20px">
                  {t(
                    `Unstaking action needs you to deposit Token farm XXX then you will receive your LP Token back.`
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Page>
    </div>
  );
}

export default Vault;
