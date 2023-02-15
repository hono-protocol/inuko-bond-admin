import React from "react";
// import { Menu as UikitMenu } from "@bds-libs/uikit";
// import { Menu as UikitMenu } from "@bds-libs/uikit";
import { Menu as UikitMenu } from "@bds-libs/uikit";
import { languageList } from "config/localization/languages";
import { useTranslation } from "contexts/Localization";
import useTheme from "hooks/useTheme";
import useAuth from "hooks/useAuth";
import { usePriceCakeBusd, useProfile } from "state/hooks";
import config from "./config";
import useActiveWeb3React from "hooks/useActiveWeb3React";

const Menu = (props) => {
  const { account } = useActiveWeb3React();
  const { login, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const cakePriceUsd = usePriceCakeBusd();
  const { profile } = useProfile();
  const { currentLanguage, setLanguage, t } = useTranslation();

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config(t)}
      profile={{
        username: profile?.username,
        image: profile?.nft
          ? `/images/nfts/${profile.nft?.images.sm}`
          : undefined,
        profileLink: "/profile",
        noProfileLink: "/profile",
        showPip: !profile?.username,
      }}
      {...props}
    />
  );
};

export default Menu;
