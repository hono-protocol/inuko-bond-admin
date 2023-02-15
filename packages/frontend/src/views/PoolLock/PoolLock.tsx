import React from "react";
import styled from "styled-components";
import PageHeader from "../../components/PageHeader";
import { Heading, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import TimeLockCard from "./components/TimeLockCard";
import { BDS, BIG } from "../../config/constants/tokens";
import { ChainId } from "@pancakeswap/sdk";

const Hero = styled(PageHeader)`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  paddingtop: 32px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  color: #fff;
`;

function PoolLock() {
  const { t } = useTranslation();

  const { account } = useActiveWeb3React();

  return (
    <Box minHeight="100vh">
      <Hero>
        <Heading
          textAlign="center"
          as="h1"
          size="xl"
          fontWeight={900}
          color="#fff"
        >
          {t("Pool lock")}
        </Heading>
      </Hero>
      <Box maxWidth="800px" mx="auto" px="20px" pb="100px">
        <Box display="flex" justifyContent="center" flexWrap="wrap" mx="-20px">
          <TimeLockCard
            tokenDecimal={BIG[ChainId.MAINNET].decimals}
            tokenSymbol={BIG[ChainId.MAINNET].symbol}
            tokenAddress={BIG[ChainId.MAINNET].address}
            pooId={0}
            address={"0xc678caab6BCBbea071D9B7079F60e7181bf9EF1c"}
          />
          <TimeLockCard
            tokenDecimal={BDS[ChainId.MAINNET].decimals}
            tokenSymbol={BDS[ChainId.MAINNET].symbol}
            tokenAddress={BDS[ChainId.MAINNET].address}
            pooId={1}
            address={"0xc678caab6BCBbea071D9B7079F60e7181bf9EF1c"}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PoolLock;
