import { MenuEntry } from "@bds-libs/uikit";

const config = (t: (r: string) => string) => {
  const result: MenuEntry[] = [
    {
      label: t("Deploy Market"),
      icon: "DashboardIcon",
      showOnMobile: true,
      href: "/",
    },
  ];

  return result;
};

export default config;
