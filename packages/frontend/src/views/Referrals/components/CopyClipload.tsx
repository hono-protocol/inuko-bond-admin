import { Box, Button, CopyIcon, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  toCopy: string;
}

const StyleButton = styled(Text).attrs({ role: "button" })`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`;

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) =>
    isTooltipDisplayed ? "block" : "none"};
  position: absolute;
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
`;

const CopyToClipboard: React.FC<Props> = ({ toCopy, children, ...props }) => {
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);
  const { t } = useTranslation();
  const copyToClipboardWithCommand = (content: string) => {
    const el = document.createElement("textarea");
    el.value = content;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  function displayTooltip() {
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 1000);
  }

  return (
    <>
      <StyleButton
        small
        bold
        onClick={() => {
          if (navigator.clipboard && navigator.permissions) {
            navigator.clipboard.writeText(toCopy).then(() => displayTooltip());
          } else if (document.queryCommandSupported("copy")) {
            copyToClipboardWithCommand(toCopy);
            displayTooltip();
          }
        }}
        {...props}
      >
        <Box
          position="relative"
          mt="13px"
          mb="12px"
          borderRadius="19px"
          border="1px solid white"
          height="40px"
          display="flex"
          alignItems="center"
          px="20px"
          py="8px"
          color="primaryBright"
          overflow="hidden"
          style={{ whiteSpace: "pre" }}
        >
          {children}
        </Box>
        <Tooltip isTooltipDisplayed={isTooltipDisplayed}>Copied</Tooltip>
      </StyleButton>
      <Button
        width="100%"
        style={{ borderRadius: 19 }}
        variant="action"
        onClick={() => {
          if (navigator.clipboard && navigator.permissions) {
            navigator.clipboard.writeText(toCopy).then(() => displayTooltip());
          } else if (document.queryCommandSupported("copy")) {
            copyToClipboardWithCommand(toCopy);
            displayTooltip();
          }
        }}
      >
        {t("Copy")}
      </Button>
    </>
  );
};

export default CopyToClipboard;
