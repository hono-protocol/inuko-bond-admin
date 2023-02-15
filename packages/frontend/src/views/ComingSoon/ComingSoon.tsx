import React from "react";
import styled from "styled-components";
import { Heading, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

const Hero = styled.div`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto auto 25px;
  padding: 32px 16px;
  text-align: center;
`;

const ComingSoon: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Hero>
        <Box
          mb="24px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Heading
            textAlign="left"
            as="h1"
            size="xl"
            fontWeight={900}
            color="#fff"
          >
            {t("Coming Soon")}...
          </Heading>
        </Box>
      </Hero>
    </div>
  );
};

export default ComingSoon;
