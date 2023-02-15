import React from "react";
import styled from "styled-components";
import {
  AppleIcon,
  CogIcon,
  GeckoIcon,
  MediumIcon,
  PlayStoreIcon,
} from "../../../components/Svg";
import IconButton from "../../../components/Button/IconButton";
import { MENU_ENTRY_HEIGHT } from "../config";
import { PanelProps, PushedProps } from "../types";
import CakePrice from "./BecoPrice";
import SocialLinks from "./SocialLinks";
import LangSelector from "./LangSelector";
import { Box } from "../../../components/Box";
import { darkColors } from "../../../theme";

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  padding: 8px 4px;
  background-color: ${({ theme }) => theme.nav.background};
`;

const SettingsEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 16px;
`;

const SocialEntry = styled.div`
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: 0 24px;
`;

function AppleStore() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="33"
        height="33"
        rx="9.5"
        fill="black"
        stroke="#6B6B6B"
      />
      <path
        d="M22.2808 17.1566C22.3103 20.3346 25.0687 21.3922 25.0992 21.4056C25.0759 21.4802 24.6585 22.9128 23.646 24.3925C22.7707 25.6717 21.8623 26.9463 20.4313 26.9727C19.0251 26.9986 18.573 26.1389 16.9654 26.1389C15.3583 26.1389 14.8559 26.9463 13.5249 26.9986C12.1436 27.0509 11.0917 25.6153 10.2092 24.3407C8.40579 21.7335 7.02764 16.9733 8.87815 13.7601C9.79744 12.1645 11.4403 11.154 13.2235 11.1281C14.5799 11.1022 15.8601 12.0406 16.6893 12.0406C17.518 12.0406 19.0738 10.9121 20.7094 11.0779C21.3941 11.1064 23.3161 11.3544 24.5502 13.1609C24.4508 13.2226 22.2569 14.4997 22.2808 17.1566V17.1566ZM19.6381 9.35296C20.3714 8.46528 20.865 7.22955 20.7304 6C19.6733 6.04248 18.3951 6.70439 17.6369 7.59159C16.9574 8.37724 16.3623 9.63472 16.5229 10.8399C17.7011 10.9311 18.9047 10.2412 19.6381 9.35297"
        fill="white"
      />
    </svg>
  );
}

const PanelFooter: React.FC<Props> = ({
  isPushed,
  pushNav,
  toggleTheme,
  isDark,
  cakePriceUsd,
  currentLang,
  langs,
  setLang,
}) => {
  if (!isPushed) {
    return (
      <Container>
        <IconButton variant="text" onClick={() => pushNav(true)}>
          <CogIcon color={darkColors.black} />
        </IconButton>
      </Container>
    );
  }

  return (
    <Container>
      <Box borderTop={`1px solid ${darkColors.black}`} mb="10px" opacity="0.1">
        {/* <SettingsEntry> */}
        {/* <CakePrice cakePriceUsd={cakePriceUsd} /> */}
        {/*<ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />*/}
        {/* <Box mr="-24px">
            <LangSelector
              currentLang={currentLang}
              langs={langs}
              setLang={setLang}
              color={darkColors.black}
            />
          </Box> */}
        {/* </SettingsEntry> */}
      </Box>

      {/* <Box color="#9BCABB" fontSize="12px" px="24px" mt="0.5rem">
        <Box
          alignItems="center"
          display="flex"
          justifyContent="center"
          pb="12px"
        >
          <Box
            mr="13px"
            as="a"
            rel="noopener noreferrer"
            target="_blank"
            href="https://coinmarketcap.com/currencies/big-digital-shares/"
          >
            <MediumIcon height="25px" width="auto" />
          </Box>
          <Box
            mr="13px"
            as="a"
            rel="noopener noreferrer"
            target="_blank"
            href="https://apps.apple.com/vn/app/bds-wallet-invest-trade/id1560772917?l=vi"
          >
            <AppleIcon height="25px" width="auto" />
          </Box>
          <Box
            mr="13px"
            as="a"
            rel="noopener noreferrer"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.bdsinvest.app&hl=vi&gl=US"
          >
            <PlayStoreIcon height="25px" width="auto" />
          </Box>
        </Box>
      </Box> */}
      <SocialEntry>
        <SocialLinks />
      </SocialEntry>
    </Container>
  );
};

export default PanelFooter;
