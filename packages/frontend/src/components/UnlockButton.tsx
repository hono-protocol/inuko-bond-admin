import React from "react";
import { Button, useWalletModal } from "@bds-libs/uikit";
import useAuth from "hooks/useAuth";
import { useTranslation } from "contexts/Localization";

const UnlockButton = (props) => {
  const { t } = useTranslation();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  return (
    <Button variant="action" onClick={onPresentConnectModal} {...props}>
      {t("Unlock Wallet")}
    </Button>
  );
};

export default UnlockButton;
