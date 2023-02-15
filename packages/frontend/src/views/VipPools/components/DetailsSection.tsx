import React from "react";
import { useTranslation } from "contexts/Localization";
import styled from "styled-components";
import { LinkExternal, Box } from "@bds-libs/uikit";

export interface ExpandableSectionProps {
  bscScanAddress?: string;
  infoAddress?: string;
  removed?: boolean;
  totalFormatted?: string;
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
  totalFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Box>
        <Box
          textAlign="center"
          fontSize="15px"
          fontWeight={900}
          lineHeight="24px"
          color="#ffae58"
        >
          {t("Total")} {lpLabel} {t("Staked").toLowerCase()}
        </Box>
        <Box
          mt="6px"
          textAlign="center"
          color="text"
          fontSize="17px"
          fontWeight={900}
          lineHeight="24px"
        >
          {totalFormatted}
          <Box
            fontWeight={100}
            display="inline-block"
            fontSize="17px"
            color="#ffae58"
            ml="10px"
          >
            (~ {totalValueFormatted} USDT)
          </Box>
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
