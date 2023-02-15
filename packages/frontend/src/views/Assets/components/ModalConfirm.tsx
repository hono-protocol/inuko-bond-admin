import React from "react";
import {
  Box,
  ModalContainer,
  Button,
  InjectedModalProps,
  LinkExternal,
} from "@bds-libs/uikit";
import { useTranslation } from "../../../contexts/Localization";
import format from "date-fns/format";
import styled from "styled-components";

export interface ModalConfirmProps extends InjectedModalProps {
  tx?: any;
  account: string;
  recipient: string;
  symbol: string;
  amount: string;
  gas: string;
  total: string | number;
}

const StyledLink = styled(LinkExternal)`
  text-align: center;
  color: #ffae58;
  justify-content: center;
  width: 100%;

  svg {
    width: 20px;
    height: 20px;
    fill: #ffae58;
  }
`;

function ModalConfirm(props: ModalConfirmProps) {
  const { onDismiss, account, recipient, symbol, amount, gas, total, tx } =
    props;
  const { t } = useTranslation();
  const [date] = React.useState(new Date());

  return (
    <ModalContainer
      px="20px"
      pt="20px"
      pb="20px"
      borderRadius="15px!important"
      maxWidth="90%!important"
      width="500px!important"
      minWidth="360px"
    >
      <Box
        textAlign="center"
        fontSize="17px"
        lineHeight="22px"
        color="textSubtle"
        fontWeight="700"
      >
        {t("Sent %symbol%", {
          symbol,
        })}
      </Box>

      <Box mt="20px" color="text" display="flex">
        <Box as="p" fontSize="16px">
          <Box color="textSubtle">{t("Status")}</Box>
          <Box mt="16px" color="#008409" fontWeight={900}>
            {t("Confirm")}
          </Box>
        </Box>
        <Box ml="auto" as="p" fontSize="16px">
          <Box textAlign="right" color="textSubtle">
            {t("Date")}
          </Box>
          <Box mt="16px">{format(date, "dd/MM/yyy - hh:mm")}</Box>
        </Box>
      </Box>

      <Box
        borderTop="1px solid"
        borderColor="textSubtle"
        mt="20px"
        pt="20px"
        color="text"
        display="flex"
      >
        <Box as="p" fontSize="16px">
          <Box color="textSubtle">{t("From")}</Box>
          <Box mt="16px">
            {account.slice(0, 4)}...
            {account.slice(recipient.length - 4)}
          </Box>
        </Box>
        <Box ml="auto" as="p" fontSize="16px">
          <Box textAlign="right" color="textSubtle">
            {t("To")}
          </Box>
          <Box mt="16px">
            {recipient.slice(0, 4)}...
            {recipient.slice(recipient.length - 4)}
          </Box>
        </Box>
      </Box>

      <Box
        py="16px"
        px="16px"
        borderRadius="20px"
        border="1px solid"
        borderColor="textSubtle"
        mt="40px"
        color="text"
      >
        <Box display="flex" as="p" fontSize="16px">
          <Box as="span" color="textSubtle">
            {t("Amount")}
          </Box>
          <Box ml="auto" as="div">
            {amount} {symbol}
          </Box>
        </Box>
        <Box mt="20px" display="flex" as="p" fontSize="16px">
          <Box as="span" color="textSubtle">
            {t("Estimated gas fee")}
          </Box>
          <Box ml="auto" as="div">
            {gas} BNB
          </Box>
        </Box>
        <Box
          pt="20px"
          borderTop="1px solid"
          borderColor="textSubtle"
          mt="40px"
          display="flex"
          as="p"
          fontSize="16px"
        >
          <Box as="span" color="textSubtle">
            {t("Total")}
          </Box>
          <Box ml="auto" as="div">
            {total} USDT
          </Box>
        </Box>
      </Box>
      <Box mt="20px" textAlign="center">
        <StyledLink href={`https://bscscan.com/tx/${tx?.hash}`} external={true}>
          {t("View on BscScan")}
        </StyledLink>
      </Box>
      <Box mt="40px" display="flex" justifyContent="center" alignItems="center">
        <Button width="100%" variant="action" onClick={onDismiss}>
          {t("Close")}
        </Button>
      </Box>
    </ModalContainer>
  );
}

export default ModalConfirm;
