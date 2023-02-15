import React from "react";
import "./styles.css";
import { useTranslation } from "contexts/Localization";
import { Route, useRouteMatch, Link } from "react-router-dom";
import { ButtonMenu, ButtonMenuItem, Box } from "@bds-libs/uikit";
import Container from "components/layout/Container";
import Hero from "./components/Hero";
import CurrentIfo from "./CurrentIfo";
import PastIfo from "./PastIfo";
import styled from "styled-components";

const StyledButtonMenu = styled(Box)`
  display: inline-flex;
  padding: 6px;
  background: #052e22;
  border-radius: 25px;

  & > div {
    background: #052e22;
  }
`;

const MenuItem = styled(ButtonMenuItem)`
  padding: 10px 15px;
  min-height: 38px;
  border-radius: 17px;
  color: #9bcabb;
  background: transparent;
  font-weight: 900;

  &[data-active="true"] {
    background: #ffae58;
    color: #052e22;
  }
`;

const StyledContainer = styled(Container)`
  padding-bottom: 500px;
`;

const WrapContainer = styled(Box)`
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  width: 100%;
  height: 700px;
  background: url("/images/itos/banner.png");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
`;

const Ifos = () => {
  const { t } = useTranslation();
  const { path, url, isExact } = useRouteMatch();
  const activeIndex = !isExact ? 1 : 0;
  return (
    <Box position="relative" minHeight="200vh">
      <WrapContainer />
      <Hero />
      <StyledContainer>
        <Box justifyContent="center" display="flex">
          <StyledButtonMenu
            justifyContent="center"
            alignItems="center"
            mb="32px"
          >
            <ButtonMenu
              activeIndex={!isExact ? 1 : 0}
              scale="sm"
              variant="subtle"
            >
              <MenuItem data-active={activeIndex === 0} as={Link} to={`/ivo`}>
                {t("Next IFO")}
              </MenuItem>
              <MenuItem
                data-active={activeIndex === 1}
                as={Link}
                to={`${url}/history`}
              >
                {t("Past IFOs")}
              </MenuItem>
            </ButtonMenu>
          </StyledButtonMenu>
        </Box>
        <Route exact path={`${path}`}>
          <CurrentIfo />
        </Route>
        <Route path={`${path}/history`}>
          <PastIfo />
        </Route>
      </StyledContainer>
    </Box>
  );
};

export default Ifos;
