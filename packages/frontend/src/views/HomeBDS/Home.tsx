import React from "react";
import styled from "styled-components";
import { BaseLayout, Box } from "@bds-libs/uikit";
import Page from "components/layout/Page";
import FirstIntroCard from "./components/FirstIntroCard";
import BondCard from "./components/BondCard";
import InverseBondCard from "./components/InverseBondCard";
import SecondIntroCard from "./components/SecondIntroCard";

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 24px;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
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

const Home: React.FC = () => {
  return (
    <div>
      <Page>
        <Box maxWidth="900px" mx="auto" mt="-18px">
          <FirstIntroCard />
          <SecondIntroCard />
          <Box mt="16px">
            <Cards>
              <InverseBondCard />
              <BondCard />
            </Cards>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default Home;
