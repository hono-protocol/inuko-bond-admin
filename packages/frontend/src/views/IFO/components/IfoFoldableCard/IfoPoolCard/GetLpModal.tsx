import React from "react";
import {
  Modal,
  ModalBody,
  Text,
  Image,
  Button,
  Link,
  OpenNewIcon,
} from "@bds-libs/uikit";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import { Token } from "config/constants/types";
import { useTranslation } from "contexts/Localization";
import { getAddress } from "../../../../../utils/addressHelpers";

interface Props {
  currency: Token;
  onDismiss?: () => void;
  isLP?: boolean;
  lpName?: string;
}

const GetLpModal: React.FC<Partial<Props>> = ({
  currency,
  onDismiss,
  isLP,
  lpName,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      title={isLP ? t("LP Tokens required") : t("Tokens required")}
      onDismiss={onDismiss}
    >
      <ModalBody maxWidth="288px">
        <Text mb="16px">
          {isLP &&
            t("You’ll need %symbol% LP tokens to participate in the IFO!", {
              symbol: lpName,
            })}
          {!isLP &&
            t("You’ll need %symbol% tokens to participate in the IFO!", {
              symbol: currency.symbol,
            })}
        </Text>
        {isLP && (
          <Text mb="24px">
            {t(
              "Get LP tokens, or make sure your tokens aren’t staked somewhere else."
            )}
          </Text>
        )}
        {!isLP && (
          <Button
            minWidth="100%"
            as={Link}
            external
            href={`/swap?outputCurrency=${getAddress(currency.address)}`}
            endIcon={<OpenNewIcon color="white" />}
            mt="16px"
          >
            {t("Get tokens")}
          </Button>
        )}
        {isLP && (
          <Button
            minWidth="100%"
            as={Link}
            external
            href={`/add`}
            endIcon={<OpenNewIcon color="white" />}
            mt="16px"
          >
            {t("Get LP tokens")}
          </Button>
        )}
      </ModalBody>
    </Modal>
  );
};

export default GetLpModal;
