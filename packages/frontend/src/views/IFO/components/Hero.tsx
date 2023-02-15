import React from "react";
import styled from "styled-components";
import { Box, Text } from "@bds-libs/uikit";
import Container from "components/layout/Container";
import { useTranslation } from "contexts/Localization";

const getGradient = (isDark: boolean) => {
  if (isDark) {
    return "repeating-linear-gradient(to right, #332453, #332453 40px, #281D44 40px, #281D44 80px)";
  }

  return "repeating-linear-gradient(to right, #21d4e2, #21d4e2 40px, #53dee9 40px, #53dee9 80px)";
};

const StyledHero = styled.div`
  // background: ${({ theme }) => getGradient(theme.isDark)};
  padding-top: 40px;
`;

const CurtainBottom = styled.div`
  height: 20px;
`;

const Hero = () => {
  const { t } = useTranslation();

  return (
    <Box mb={{ _: "25px", xl: "32px" }}>
      <StyledHero>
        <Container>
          <Box
            fontWeight={900}
            textAlign="center"
            color="text"
            as="h1"
            fontSize={{
              _: "30px",
              xl: "50px",
            }}
            lineHeight={{
              _: "35px",
              xl: "58px",
            }}
            mb="24px"
          >
            {t("IVO: Initial VIP Offerings")}
          </Box>
          <Box
            color="text"
            textAlign="center"
            fontWeight={900}
            fontSize={{
              _: "20px",
              xl: "25px",
            }}
            lineHeight={{
              _: "23px",
              xl: "29px",
            }}
          >
            {t("Event to sell Tokens for members who deposited in VIP Pools.")}
          </Box>
        </Container>
      </StyledHero>
      <CurtainBottom />
    </Box>
  );
};

export default Hero;
