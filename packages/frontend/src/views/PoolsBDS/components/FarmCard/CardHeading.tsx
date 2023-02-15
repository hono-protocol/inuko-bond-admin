import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image, Box, FarmHouseIcon } from "@bds-libs/uikit";
import { CommunityTag, CoreTag } from "components/Tags";
import { Token } from "../../../../config/constants/types";
import { getAddress } from "../../../../utils/addressHelpers";

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  isCommunityFarm?: boolean;
  farmImage?: string;
  tokenSymbol?: string;
  token?: Token;
  quoteToken?: Token;
}

const Wrapper = styled(Flex)`
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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
}) => {
  const tokenAddress = token ? getAddress(token.address) : "";
  const quoteTokenAddress = quoteToken ? getAddress(quoteToken.address) : "";

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="flex-start">
        <Heading size="lg" fontWeight={900} color="textSubtle" mb="4px">
          {lpLabel.split(" ")[0]}
        </Heading>
        <Flex mt="10px" justifyContent="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="primary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
      <Box>
        <LogoTop
          position="relative"
          right="-44px"
          width="30px"
          height="30px"
          as="img"
          src="/images/tokens/0x72b7181bd4a0B67Ca7dF2c7778D8f70455DC735b.png"
        />
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
            <FarmHouseIcon color="primary" width="50px" />
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default CardHeading;
