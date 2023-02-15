import React from "react";
import {
  CardHeader,
  Text,
  Flex,
  Image,
  Box,
  VaultIcon,
  AutoIcon,
} from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import { Token } from "config/constants/types";
import { getAddress } from "../../../utils/addressHelpers";

const Wrapper = styled(CardHeader)<{
  isFinished?: boolean;
  background?: string;
}>`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 15px 15px 0px 0px;
  padding: 16px 24px 8px 16px;
`;

const WrapperSvg = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  & svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
  }
`;

const StyledCardHeader: React.FC<{
  earningToken: Token;
  stakingToken: Token;
  isAutoVault?: boolean;
  isFinished?: boolean;
  multiplier: string;
}> = ({ multiplier, earningToken, stakingToken, isFinished = false }) => {
  const { t } = useTranslation();

  return (
    <Wrapper isFinished={isFinished}>
      <Flex alignItems="flex-start">
        <Flex flexDirection="column">
          <Text
            textAlign="left"
            fontWeight={900}
            fontSize="20px"
            color="background"
            lineHeight="23px"
          >
            {t("Auto")}
          </Text>
          <Box
            display="flex"
            alignItems="center"
            textAlign="left"
            fontWeight={900}
            fontSize="25px"
            color="background"
            lineHeight="30px"
          >
            {stakingToken.symbol}
            <WrapperSvg height="18px" fontSize="18px" ml="4px">
              <AutoIcon />
            </WrapperSvg>
          </Box>
          <Box
            mt="5px"
            textAlign="left"
            fontWeight={900}
            fontSize="14px"
            color="background"
            lineHeight="16px"
          >
            {t("Automatic restaking")}
          </Box>
        </Flex>
        <Box ml="auto" position="relative" pt="15px">
          <Box width="32px" position="absolute" top="-10px" right="-15px">
            <Image
              width={32}
              height={32}
              src={`/images/tokens/${getAddress(
                earningToken.address
              ).toLowerCase()}.png`}
              alt={earningToken.symbol}
            />
          </Box>
          <Box position="relative" display="flex" alignItems="flex-end">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              right="-12px"
              width="40px"
              height="40px"
              background="#fff"
              borderRadius="50%"
            >
              <Image
                width={32}
                height={32}
                src={`/images/tokens/${getAddress(
                  stakingToken.address
                ).toLowerCase()}.png`}
                alt={stakingToken.symbol}
              />
            </Box>
            <Box>
              <VaultIcon width="45px" color="primary" />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
};

export default StyledCardHeader;
