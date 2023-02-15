import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { AutoIcon, Box, ButtonMenu, ButtonMenuItem } from "@bds-libs/uikit";

const StyledNav = styled.nav`
  padding: 6px 8px;
  border-radius: 25px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledButtonMenuItem = styled(ButtonMenuItem)`
  align-items: center;
  border: 0;
  border-radius: 25px;
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 17px;
  font-weight: 900;
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  opacity: 1;
  outline: 0;
  transition: background-color 0.2s, opacity 0.2s;
  text-transform: none;
  height: auto;
  padding: 10px 32px;
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.secondary : "none"};
  color: ${({ theme, isActive }) =>
    isActive ? "#052E22" : theme.colors.primaryBright};
  white-space: nowrap;
`;

const Wrap = styled(ButtonMenu)`
  background-color: transparent;
`;

const WrapperSvg = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;

const getActiveIndex = (pathname: string): number => {
  if (pathname.includes("/pools")) {
    return 1;
  }

  if (pathname.includes("/vaults")) {
    return 2;
  }

  return 0;
};

const Nav = () => {
  const location = useLocation();

  return (
    <StyledNav>
      <Wrap activeIndex={getActiveIndex(location.pathname)} scale="sm">
        <StyledButtonMenuItem id="swap-nav-link" to="/farms" as={Link}>
          Farms
        </StyledButtonMenuItem>
        <StyledButtonMenuItem id="pool-nav-link" to="/pools" as={Link}>
          Pools
        </StyledButtonMenuItem>
        <StyledButtonMenuItem id="vaults-nav-link" to="/vaults" as={Link}>
          Vaults
          <WrapperSvg height="18px" fontSize="18px" ml="4px">
            <AutoIcon />
          </WrapperSvg>
        </StyledButtonMenuItem>
      </Wrap>
    </StyledNav>
  );
};

export default Nav;
