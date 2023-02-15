import React from "react";
import {
  CardHeader,
  Heading,
  Text,
  Flex,
  Image,
  Box,
  PoolHouseIcon,
  Tag,
} from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import { Token } from "config/constants/types";
import { getAddress } from "../../../utils/addressHelpers";

const Wrapper = styled(CardHeader)<{
  isFinished?: boolean;
  background?: string;
}>`
  padding: 0;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  background: transparent;
`;

const StyledCardHeader: React.FC<{
  earningToken: Token;
  stakingToken: Token;
  isAutoVault?: boolean;
  isFinished?: boolean;
  multiplier?: string;
}> = ({
  multiplier,
  earningToken,
  stakingToken,
  isFinished = false,
  isAutoVault = false,
}) => {
  const { t } = useTranslation();

  //@todo handle beco
  const isCakePool =
    earningToken.symbol === "BECO" && stakingToken.symbol === "BECO";

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return `${t("Auto")}`;
    }
    if (isCakePool) {
      // manual cake
      return `${t("Manual")}`;
    }
    // all other pools
    return `${t("Earn")}`;
  };

  const getSubHeading = () => {
    if (isAutoVault) {
      return `${t("Automatic restaking")}`;
    }
    if (isCakePool) {
      return `${t("Earn BDS, stake BDS")}`;
    }
    return `${t("Stake")} ${stakingToken.symbol}`;
  };

  return (
    <Wrapper isFinished={isFinished}>
      <Flex alignItems="flex-end">
        <Flex flexDirection="column">
          <Text
            textAlign="left"
            fontWeight={900}
            fontSize="16px"
            color={isFinished ? "textDisabled" : "textSubtle"}
          >
            {getSubHeading()}
          </Text>
          <Box display="flex" flexDirection="column">
            <Heading
              fontWeight={900}
              fontSize="24px"
              color={isFinished ? "textDisabled" : "textSubtle"}
              size="lg"
            >
              {`${getHeadingPrefix()} ${earningToken.symbol}`}
            </Heading>
            <Box mt="8px" display="flex" justifyContent="flex-start">
              <Tag>{multiplier}</Tag>
            </Box>
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
              <PoolHouseIcon width="45px" color="primary" />
            </Box>
          </Box>
        </Box>
      </Flex>
    </Wrapper>
  );
};

export default StyledCardHeader;
