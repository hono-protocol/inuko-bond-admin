import React from "react";
import { useTranslation } from "contexts/Localization";
import styled from "styled-components";
import { Text, Flex, LinkExternal, Box } from "@bds-libs/uikit";

export interface ExpandableSectionProps {
  bscScanAddress?: string;
  infoAddress?: string;
  removed?: boolean;
  totalValueFormatted?: string;
  lpLabel?: string;
  addLiquidityUrl?: string;
}

const Wrapper = styled.div`
  margin-top: 5px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textSubtle};

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle}!important;
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Box>
        <Box
          textAlign="center"
          color="text"
          fontSize="18px"
          fontWeight={900}
          lineHeight="24px"
        >
          {t("Total Liquidity")}:
        </Box>
        <Box
          mt="10px"
          textAlign="center"
          color="text"
          fontSize="19px"
          fontWeight={900}
          lineHeight="24px"
        >
          {totalValueFormatted}
        </Box>
      </Box>
      <Box mt="20px" display="flex" justifyContent="center" alignItems="center">
        {!removed && (
          <StyledLinkExternal href={addLiquidityUrl}>
            {t(`Get ${lpLabel}`, { name: lpLabel })}
          </StyledLinkExternal>
        )}
      </Box>
      <Box mt="4px" display="flex" alignItems="center">
        <StyledLinkExternal href={bscScanAddress}>
          {t("View Contract")}
        </StyledLinkExternal>
        <Box ml="auto">
          <StyledLinkExternal href={infoAddress}>
            {t("See Pair Info")}
          </StyledLinkExternal>
        </Box>
      </Box>
    </Wrapper>
  );
};

export default DetailsSection;
