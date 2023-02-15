import React from "react";
import styled from "styled-components";
import {
  Tag,
  Flex,
  Heading,
  Image,
  Box,
  FarmHouseIcon,
  AutoIcon,
} from "@bds-libs/uikit";
import { CommunityTag, CoreTag } from "components/Tags";
import { Token } from "../../../../config/constants/types";
import { getAddress } from "../../../../utils/addressHelpers";
import { useTranslation } from "../../../../contexts/Localization";

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  isCommunityFarm?: boolean;
  farmImage?: string;
  tokenSymbol?: string;
  token?: Token;
  quoteToken?: Token;
  lpToken: Token[];
}

const Wrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 15px 15px 0px 0px;
  padding: 18px 24px 8px 16px;
  svg {
    margin-right: 4px;
  }
`;

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`;

const LogoTop = styled(Box)`
  transform: rotate(30deg);
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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  lpToken,
}) => {
  let tokenAddress = token ? getAddress(token.address) : "";
  let quoteTokenAddress = quoteToken ? getAddress(quoteToken.address) : "";

  if (lpToken) {
    tokenAddress = getAddress(lpToken[0].address);
    quoteTokenAddress = getAddress(lpToken[1].address);
  }

  const { t } = useTranslation();
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column">
        <Box
          textAlign="left"
          fontWeight={900}
          fontSize="20px"
          color="background"
          lineHeight="23px"
        >
          {t("Auto")}
        </Box>
        <Box
          display="flex"
          alignItems="center"
          textAlign="left"
          fontWeight={900}
          fontSize="25px"
          color="background"
          lineHeight="30px"
        >
          {lpLabel}
          <WrapperSvg height="18px" fontSize="18px" ml="4px">
            <AutoIcon />
          </WrapperSvg>
        </Box>
        <Box
          mt="5px"
          textAlign="left"
          fontWeight={300}
          fontSize="14px"
          color="background"
          lineHeight="16px"
        >
          {t("Automatic restaking")}
        </Box>
      </Flex>
      <Box position="relative" alignSelf="flex-end">
        <Box>
          <LogoTop
            position="absolute"
            top="-20px"
            right="-10px"
            width="32px"
            height="32px"
            as="img"
            src="/images/tokens/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b.png"
          />
        </Box>
        {token.address === quoteToken.address && (
          <Box display="flex" alignItems="flex-end">
            <Box width={32} height={32} position="relative" right="-20px">
              <Image
                src={`/images/tokens/${tokenAddress}.png`}
                alt={token.symbol}
                width={32}
                height={32}
              />
            </Box>
            <Box>
              <FarmHouseIcon color="background" width="50px" />
            </Box>
          </Box>
        )}
        {token.address !== quoteToken.address && (
          <Box display="flex" alignItems="flex-end">
            <Box width={32} height={32} position="relative" right="-28px">
              <Image
                src={`/images/tokens/${tokenAddress}.png`}
                alt={token.symbol}
                width={32}
                height={32}
              />
            </Box>
            <Box width={32} height={32} position="relative" right="-20px">
              <Image
                src={`/images/tokens/${quoteTokenAddress}.png`}
                alt={quoteToken.symbol}
                width={32}
                height={32}
              />
            </Box>
            <Box>
              <FarmHouseIcon color="background" width="50px" />
            </Box>
          </Box>
        )}
      </Box>
    </Wrapper>
  );
};

export default CardHeading;
