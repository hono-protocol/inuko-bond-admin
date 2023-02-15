import React from "react";
import styled from "styled-components";
import PageHeader from "../../components/PageHeader";
import { Box, Heading, Text } from "@bds-libs/uikit";
import { useTranslation } from "../../contexts/Localization";
import ITOCardP from "./components/ITOCard";

const Hero = styled(PageHeader)`
  color: #fff;
  background: none;
`;

const Cards = styled(Box)`
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 28px;
  grid-row-gap: 0px;
`;

const Card = styled(Box)`
  display: flex;
  align-items: baseline;
`;

function Ito() {
  const { t } = useTranslation();

  return (
    <Box paddingBottom="50px">
      <Hero>
        <Heading
          textAlign="center"
          as="h1"
          size="xl"
          fontWeight={900}
          color="#fff"
        >
          {t("ITO")}
        </Heading>
        <Box mt="25px" textAlign="center">
          <Text fontSize="25px" color="#fff" fontWeight={900}>
            {t("Buy new tokens with BDS-LP.")}
          </Text>
        </Box>
      </Hero>
      <Cards mt="20px">
        <Card>
          <Box width="100%">
            <ITOCardP />
          </Box>
        </Card>
        <Card>
          <Box width="100%">
            <ITOCardP />
          </Box>
        </Card>
      </Cards>
    </Box>
  );
}

export default Ito;
