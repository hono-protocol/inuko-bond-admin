import React from "react";
import styled from "styled-components";
import { Heading, Box, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

const Hero = styled.div`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: auto auto 25px;
  padding: 32px 16px;
  text-align: center;
`;

const Projects: React.FC = () => {
  const { t } = useTranslation();
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
          Projects
        </Heading>
        <Box m="0 auto" mt="10px" textAlign="center" maxWidth="550px">
          <Text fontSize="20px" color="primaryBright" fontWeight={900}>
            {t("Manage IFO Real Estate projects for holders.")}
          </Text>
        </Box>
      </Hero>

      <Heading
        textAlign="center"
        as="h1"
        size="xl"
        fontWeight={900}
        color="#fff"
        mt="3rem"
      >
        {t("Coming Soon")}...
      </Heading>
    </Box>
  );
};

export default Projects;
