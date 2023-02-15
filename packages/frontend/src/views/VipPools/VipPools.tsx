import React from "react";
import { Box, Heading, VipIcon } from "@bds-libs/uikit";
import styled from "styled-components";

import { useTranslation } from "contexts/Localization";
import configs from "config/constants/vipPools";
import VipPoolCard from "./components/VIpPoolCard";

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

const VipPools = () => {
  const { t } = useTranslation();

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
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Box
                ml={{ _: "0.15rem", lg: "1rem" }}
                mb={{ _: "-0.5rem", lg: "-1rem" }}
              >
                <VipIcon width="3rem" />
              </Box>
              {t("VIP POOLS")}
            </Box>
          </Heading>
          <Box mt="25px" mb="0.25rem" textAlign="center">
            <Box
              fontSize={{ _: "16px", lg: "25px" }}
              lineHeight={{ _: "24px", lg: "32px" }}
              color="#9BCABB"
              fontWeight={900}
            >
              {t("Special pool locking by time and receiving competitive APR")}
              <br />
              {t("You will only have one chance to deposit in each VIP POOL")}
              <br />
              {t(
                "When depositing VIP POOL, you will become VIP Member and able to join IFO to have our tokens"
              )}
            </Box>
          </Box>
        </>
      </Hero>
      <Box maxWidth="1600px" mx="auto" px="20px" pb="100px">
        <Box display="flex" justifyContent="center" flexWrap="wrap" mx="-20px">
          {configs.map((o) => {
            return <VipPoolCard key={o.pid} data={o} />;
          })}
        </Box>
      </Box>
    </>
  );
};

export default VipPools;
