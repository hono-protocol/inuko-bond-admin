import React from "react";
import styled from "styled-components";
import {
  Text,
  Flex,
  Heading,
  IconButton,
  ArrowBackIcon,
  darkColors,
} from "@bds-libs/uikit";
import { Link } from "react-router-dom";
import Settings from "./Settings";
import QuestionHelper from "../QuestionHelper";

interface Props {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  helper?: string;
  backTo?: string;
  noConfig?: boolean;
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AppHeader: React.FC<Props> = ({
  title,
  subtitle,
  helper,
  backTo,
  noConfig = false,
}) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : "16px"}>
        {backTo && (
          <IconButton as={Link} to={backTo}>
            <ArrowBackIcon color={darkColors.black} width="32px" />
          </IconButton>
        )}
        <Flex flexDirection="column">
          <Heading fontSize="20px" color="textSubtle" as="h2" mb="8px">
            {title}
          </Heading>
          <Flex alignItems="center">
            {helper && <QuestionHelper text={helper} mr="4px" />}
            <Text fontWeight="bold" color="primaryBright" fontSize="17px">
              {subtitle}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      {!noConfig && (
        <Flex>
          <Settings />
        </Flex>
      )}
    </AppHeaderContainer>
  );
};

export default AppHeader;
