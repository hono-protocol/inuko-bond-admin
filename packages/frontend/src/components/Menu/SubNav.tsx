import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { ButtonMenu, ButtonMenuItem } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

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

const getActiveIndex = (pathname: string): number => {
  if (
    pathname.includes("/pool") ||
    pathname.includes("/create") ||
    pathname.includes("/add") ||
    pathname.includes("/remove") ||
    pathname.includes("/find") ||
    pathname.includes("/liquidity")
  ) {
    return 1;
  }
  return 0;
};

const Nav = () => {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <StyledNav>
      <Wrap activeIndex={getActiveIndex(location.pathname)} scale="sm">
        <StyledButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
          Swap
        </StyledButtonMenuItem>
        <StyledButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
          Liquidity
        </StyledButtonMenuItem>
      </Wrap>
    </StyledNav>
  );
};

export default Nav;
