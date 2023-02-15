import React, { useContext } from "react";
import { Box, Button, Modal } from "@bds-libs/uikit";
import { ArrowUpCircle } from "react-feather";
import { ThemeContext } from "styled-components";

import { AutoColumn } from "./layout/Column";
import {
  Wrapper,
  Section,
  ConfirmedIcon,
} from "./TransactionConfirmationModal/helpers";

interface SubmittedModalProps {
  onDismiss: () => void;
  hideConfirmedIcon?: boolean;
  title?: string;
  content: React.ReactNode;
}

const TransactionSubmittedModal = ({
  onDismiss,
  hideConfirmedIcon,
  title,
  content,
}: SubmittedModalProps) => {
  const theme = useContext(ThemeContext);

  return (
    <Modal title={title || "Transaction submitted"} onDismiss={onDismiss}>
      <Wrapper>
        <Section>
          {!hideConfirmedIcon && (
            <ConfirmedIcon>
              <ArrowUpCircle
                strokeWidth={0.5}
                size={97}
                color={theme.colors.primary}
              />
            </ConfirmedIcon>
          )}
          <AutoColumn gap="8px" justify="center">
            <Box>{content}</Box>
            <Button onClick={onDismiss} mt="20px">
              Close
            </Button>
          </AutoColumn>
        </Section>
      </Wrapper>
    </Modal>
  );
};

export default TransactionSubmittedModal;
