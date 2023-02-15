import React from "react";
import Heading from "../../components/Heading/Heading";
import { darkColors } from "../../theme";
import {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalContainer,
  ModalCloseButton,
  ModalBackButton,
} from "./styles";
import { ModalProps } from "./types";

const Modal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = "24px",
  headerBackground = "transparent",
  minWidth = "320px",
  ...props
}) => (
  <ModalContainer minWidth={minWidth} {...props}>
    <ModalHeader background={headerBackground}>
      <ModalTitle>
        {onBack && <ModalBackButton onBack={onBack} />}
        <Heading color={darkColors.primary}>{title}</Heading>
      </ModalTitle>
      {!hideCloseButton && <ModalCloseButton onDismiss={onDismiss} />}
    </ModalHeader>
    <ModalBody p={bodyPadding}>{children}</ModalBody>
  </ModalContainer>
);

export default Modal;
