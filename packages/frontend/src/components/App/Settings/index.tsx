import React from "react";
import { Button, TuneIcon, NotificationDot, useModal } from "@bds-libs/uikit";
import { useExpertModeManager } from "state/user/hooks";
import SettingsModal from "./SettingsModal";

export default function SettingsTab() {
  const [onPresentSettingsModal] = useModal(<SettingsModal />);
  const [expertMode] = useExpertModeManager();

  return (
    <NotificationDot show={expertMode}>
      <Button
        variant="text"
        p={0}
        onClick={onPresentSettingsModal}
        id="open-settings-dialog-button"
      >
        <TuneIcon color="primaryBright" width="24px" />
      </Button>
    </NotificationDot>
  );
}
