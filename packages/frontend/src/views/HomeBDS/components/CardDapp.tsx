import React from "react";
import {
  Box,
  MoreIcon,
  NewsIcon,
  ProjectInfoIcon,
  ProjectsIcon,
  VipIcon,
} from "@bds-libs/uikit";
import {
  FarmHouseIcon,
  BridgeIcon,
  ReferralIcon,
  InfoHouseIcon,
  DocsIcon,
  TimeLockIcon,
  Grid,
  AppleIcon,
  PlayStoreIcon,
  WebIcon,
  MediumIcon,
  IfoIcon,
  VaultIcon,
  Dropdown,
  TradeAllIcon,
  AssetsIcon,
  AdvisorIcon,
  PoolHouseIcon,
} from "@bds-libs/uikit";
import { useTranslation } from "../../../contexts/Localization";
import useTheme from "../../../hooks/useTheme";
import styled from "styled-components";
import { Link } from "@becoswap-libs/uikit";

interface Menu {
  icon: any;
  title: string;
  url?: string;
  isExternal?: boolean;
  isNew?: boolean;
  isComing?: boolean;
  t?: (r: string) => string;
  nested?: {
    title: string;
    url: string;
    isExternal?: boolean;
  }[];
}

const menus: Menu[] = [
  {
    url: "/assets",
    title: "Assets",
    icon: AssetsIcon,
  },
  {
    url: "/swap",
    title: "Trade",
    icon: TradeAllIcon,
  },
  {
    url: "/vip-pools",
    title: "VIP Pools",
    icon: VipIcon,
    isNew: true,
  },
  {
    url: "/pools",
    title: "PRO Pools",
    icon: PoolHouseIcon,
    isNew: true,
  },
  {
    url: "/farms",
    title: "Farms",
    icon: FarmHouseIcon,
    isNew: true,
  },
  {
    url: "/vaults",
    title: "Vaults",
    icon: VaultIcon,
    isNew: true,
  },
  {
    url: "/timelock",
    title: "Private",
    icon: TimeLockIcon,
  },
  {
    url: "/ivo",
    title: "IVO",
    icon: IfoIcon,
    isNew: true,
  },
  // {
  //   url: "/referrals",
  //   title: "Referrals",
  //   icon: ReferralIcon,
  // },
];

const menuLast: Menu[] = [
  {
    url: "/referrals",
    title: "Referral",
    icon: ReferralIcon,
  },
  {
    url: "/info",
    title: "Info",
    icon: InfoHouseIcon,
  },

  {
    title: "Web",
    url: "https://bigbds.io/",
    isExternal: true,
    icon: WebIcon,
  },
  {
    url: "/bridge",
    title: "Bridge",
    icon: BridgeIcon,
  },
  {
    url: "https://bigbds.io/du-an.html",
    title: "Projects Info",
    icon: ProjectInfoIcon,
    isExternal: true,
  },
  {
    url: "https://bigbds.io/ban-co-van.html",
    title: "Advisors",
    icon: AdvisorIcon,
    isExternal: true,
  },
  {
    url: "https://blog.bigbds.io",
    title: "News",
    icon: NewsIcon,
    isExternal: true,
  },
  {
    isExternal: true,
    title: "Docs",
    url: "https://docs.bigbds.io/",
    icon: DocsIcon,
  },
  // {
  //   url: "/",
  //   title: "More",
  //   icon: MoreIcon,
  // },
];

const IconMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    fill: ${({ theme }) => theme.colors.primaryBright};
    width: 30px;
  }
`;

const IconSocial = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    fill: ${({ theme }) => theme.colors.text};
    height: 45px;
    width: auto;
  }
`;

function renderMenu(menus: Menu[], t: (r: string) => string) {
  return (
    <>
      {menus.map((s) => {
        if (s.nested) {
          return (
            <Dropdown
              key={s.title}
              position="top"
              target={<MenuButton key={s.title} {...s} />}
            >
              {s.nested.map((item) => (
                <Link
                  external
                  key={item.title}
                  href={item.url}
                  aria-label={item.title}
                  color="textSubtle"
                >
                  {t(item.title)}
                </Link>
              ))}
            </Dropdown>
          );
        }
        return (
          <Box position="relative">
            {s.isNew && (
              <Box
                textAlign="center"
                minWidth="40px"
                p="5px"
                fontSize="11px"
                borderRadius="17px"
                zIndex={1}
                backgroundColor="secondary"
                color="background"
                position="absolute"
                top="-10px"
                right="-10px"
              >
                New
              </Box>
            )}
            {s.isComing && (
              <Box
                textAlign="center"
                minWidth="40px"
                p="5px"
                fontSize="11px"
                borderRadius="17px"
                zIndex={1}
                backgroundColor="#115945"
                color="#fff"
                position="absolute"
                top="-10px"
                right="-10px"
              >
                Coming
              </Box>
            )}
            <MenuButton t={t} key={s.title} {...s} />
          </Box>
        );
      })}
    </>
  );
}

function MenuButton(props: Menu) {
  const { icon: Icon, url, title, isExternal, isComing, t } = props;
  return (
    <Box
      as={Link}
      href={url}
      external={isExternal}
      rel={isExternal ? "noreferrer noopener" : undefined}
      style={{
        textDecoration: "none",
      }}
    >
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box
          width="62px"
          height="62px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          py="12px"
          px="14px"
          borderRadius="14px"
          backgroundColor="#0A4635"
        >
          <IconMenu>
            <Icon width="30px" fill="inherit" />
          </IconMenu>
        </Box>
        <Box
          mt="3px"
          textAlign="center"
          fontWeight="900"
          fontSize="14px"
          lineHeight="16px"
          color="primaryBright"
        >
          {t(title)}
        </Box>
      </Box>
    </Box>
  );
}

function CardDapp({ isInfo }: { isInfo?: boolean }) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
      borderRadius="16px"
      background={
        theme.isDark
          ? "#052E22"
          : "linear-gradient(108.87deg, #FFFFFF 29.51%, rgba(255, 255, 255, 0.6) 101.68%)"
      }
    >
      <Box
        py="32px"
        px="22px"
        backgroundPosition="right top"
        backgroundSize="initial"
        backgroundRepeat="no-repeat"
      >
        <Box
          textAlign="center"
          as="h2"
          fontSize="25px"
          lineHeight="30px"
          fontWeight={900}
          color="textSubtle"
          size="lg"
        >
          {t(isInfo ? "Information" : `Dapps`)}
        </Box>
        <Box pt="40px" pb="20px">
          {!isInfo && (
            <Grid
              display="grid"
              gridRowGap="26px"
              gridTemplateColumns="repeat(4, 1fr)"
              justifyItems="center"
            >
              {renderMenu(menus, t)}
            </Grid>
          )}
          {isInfo && (
            <>
              <Grid
                display="grid"
                gridRowGap="26px"
                gridTemplateColumns="repeat(4, 1fr)"
                justifyItems="center"
              >
                {renderMenu(menuLast, t)}
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default CardDapp;
