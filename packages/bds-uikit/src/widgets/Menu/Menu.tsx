import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import throttle from "lodash/throttle";
import Overlay from "../../components/Overlay/Overlay";
import Flex from "../../components/Box/Flex";
import { useMatchBreakpoints } from "../../hooks";
import Logo from "./components/Logo";
import Panel from "./components/Panel";
import UserBlock from "./components/UserBlock";
import { NavProps } from "./types";

import {
  MENU_HEIGHT,
  SIDEBAR_WIDTH_REDUCED,
  SIDEBAR_WIDTH_FULL,
  MENU_MOBILE_HEIGHT,
} from "./config";
import { Box } from "../../components/Box";
import { LangSelector } from ".";
import BottomNav from "../../components/BottomNav";
import { darkColors } from "../../theme";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav<{ showMenu: boolean; isMobile: boolean }>`
  position: fixed;
  top: ${({ showMenu }) => (showMenu ? 0 : `-${MENU_HEIGHT}px`)};
  left: 0;
  transition: top 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  padding-right: 16px;
  width: 100%;
  height: ${({ showMenu, isMobile }) =>
    showMenu ? `${isMobile ? MENU_MOBILE_HEIGHT : MENU_HEIGHT}px` : 0};
  background-color: ${({ theme }) => theme.nav.background};
  border-bottom: solid 2px rgba(133, 133, 133, 0.1);
  box-shadow: 0px 0px 3px rgba(255, 255, 255, 0.4);
  z-index: 20;
  transform: translate3d(0, 0, 0);
`;

const BodyWrapper = styled.div`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{
  isPushed: boolean;
  showMenu: boolean;
  isMobile: boolean;
}>`
  flex-grow: 1;
  margin-top: ${({ showMenu, isMobile }) =>
    showMenu ? `${isMobile ? MENU_MOBILE_HEIGHT : MENU_HEIGHT}px` : 0};
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    margin-left: ${({ isPushed }) =>
      `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) =>
      `calc(100% - ${
        isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED
      }px)`};
  }
`;

const MobileOnlyOverlay = styled(Overlay)`
  position: fixed;
  height: 100%;

  ${({ theme }) => theme.mediaQueries.nav} {
    display: none;
  }
`;

const Menu: React.FC<NavProps> = ({
  account,
  login,
  logout,
  isDark,
  toggleTheme,
  langs,
  setLang,
  currentLang,
  cakePriceUsd,
  links,
  children,
  activeItem,
  activeSubItem,
}) => {
  const { isXl } = useMatchBreakpoints();
  const isMobile = isXl === false;
  const [isPushed, setIsPushed] = useState(!isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(window.pageYOffset);

  useEffect(() => {
    if (!isMobile) {
      const handleScroll = () => {
        const currentOffset = window.pageYOffset;
        const isBottomOfPage =
          window.document.body.clientHeight ===
          currentOffset + window.innerHeight;
        const isTopOfPage = currentOffset === 0;
        // Always show the menu when user reach the top
        if (isTopOfPage) {
          setShowMenu(true);
        }
        // Avoid triggering anything at the bottom because of layout shift
        else if (!isBottomOfPage) {
          if (currentOffset < refPrevOffset.current) {
            // Has scroll up
            setShowMenu(true);
          } else {
            // Has scroll down
            setShowMenu(false);
          }
        }
        refPrevOffset.current = currentOffset;
      };
      const throttledHandleScroll = throttle(handleScroll, 200);

      window.addEventListener("scroll", throttledHandleScroll);
      return () => {
        window.removeEventListener("scroll", throttledHandleScroll);
      };
    }
  }, []);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");

  return (
    <Wrapper>
      <StyledNav showMenu={showMenu} isMobile={isMobile}>
        <Logo
          isPushed={isPushed}
          togglePush={() => setIsPushed((prevState: boolean) => !prevState)}
          isDark={isDark}
          href={homeLink?.href ?? "/"}
        />
        <Flex alignItems="center">
          <Box mr="7px">
            <LangSelector
              onHeader
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color={darkColors.black}
            />
          </Box>
          <UserBlock
            isMobile={isMobile}
            account={account}
            login={login}
            logout={logout}
          />
        </Flex>
      </StyledNav>
      <BodyWrapper>
        <Panel
          isPushed={isPushed}
          isMobile={isMobile}
          showMenu={showMenu}
          isDark={isDark}
          toggleTheme={toggleTheme}
          langs={langs}
          setLang={setLang}
          currentLang={currentLang}
          cakePriceUsd={cakePriceUsd}
          pushNav={setIsPushed}
          links={links}
        />
        <Inner isMobile={isMobile} isPushed={isPushed} showMenu={showMenu}>
          {children}
        </Inner>
        <MobileOnlyOverlay
          show={isPushed}
          onClick={() => setIsPushed(false)}
          role="presentation"
        />
      </BodyWrapper>
      {/* {isMobile && (
        <BottomNav
          // @ts-ignore
          items={links}
          activeItem={activeItem}
          activeSubItem={activeSubItem}
        />
      )} */}
    </Wrapper>
  );
};

export default Menu;
