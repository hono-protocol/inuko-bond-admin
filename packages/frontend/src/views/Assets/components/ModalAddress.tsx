import React from "react";
import {
  Box,
  ModalContainer,
  Button,
  CopyIcon,
  InjectedModalProps,
} from "@bds-libs/uikit";
import { useTranslation } from "../../../contexts/Localization";
import useCopy from "../../../hooks/useCopy";
import styled from "styled-components";

export interface ModalAddressProps extends InjectedModalProps {
  account: string;
}

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) =>
    isTooltipDisplayed ? "block" : "none"};
  position: absolute;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  width: 200px;
  top: 10px;
  height: 20px;
  right: 50px;
`;

function ModalAddress(props: ModalAddressProps) {
  const { account, onDismiss } = props;
  const { t } = useTranslation();
  const { isCopied, copy } = useCopy(account);
  return (
    <ModalContainer
      px="20px"
      pt="20px"
      pb="100px"
      borderRadius="15px!important"
      maxWidth="90%!important"
      width="600px!important"
      minWidth="360px"
    >
      <Box
        textAlign="center"
        fontSize="17px"
        lineHeight="22px"
        color="textSubtle"
        fontWeight="700"
      >
        {t("Receive")}
      </Box>
      <Box
        mt="15px"
        display="block"
        mx="auto"
        width="180px"
        height="180px"
        as="img"
        src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=ethereum:${account}C&choe=UTF-8`}
      />
      <Box mt="14px" color="primaryBright" textAlign="center">
        {t("Scan address to receive payment")}
      </Box>
      <Box
        position="relative"
        mt="13px"
        borderRadius="19px"
        border="1px solid #FFAE58"
        height="40px"
        display="flex"
        alignItems="center"
        px="20px"
        py="8px"
        color="primaryBright"
        onClick={copy}
      >
        {account.slice(0, 4)}...{account.slice(account.length - 4)}
        <Box ml="auto">
          <CopyIcon color="primaryBright" />
        </Box>
        <Tooltip isTooltipDisplayed={isCopied}>Copied</Tooltip>
      </Box>

      <Box mt="10px" display="flex" justifyContent="center" alignItems="center">
        <Button width="100%" variant="action" onClick={onDismiss}>
          {t("Close")}
        </Button>
      </Box>
    </ModalContainer>
  );
}

export default ModalAddress;
