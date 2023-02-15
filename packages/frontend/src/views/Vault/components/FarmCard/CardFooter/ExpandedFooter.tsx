import React from "react";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import { Flex, Text, LinkExternal, Skeleton, Box } from "@bds-libs/uikit";
import { BASE_BSC_SCAN_URL } from "config";

interface ExpandedFooterProps {
  totalValue: string;
  projectLink?: string;
  stakingTokenSymbol: string;
  contractAddress?: string;
  performanceFee: string;
  depositFee?: number;
  lpLabel: string;
  addLiquidityUrl: string;
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`;
const StyledLink = styled(LinkExternal)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 13px;
  font-weight: 700;
  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({
  totalValue,
  projectLink,
  stakingTokenSymbol,
  contractAddress,
  performanceFee,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex justifyContent="space-between" alignItems="center">
        <Box
          fontSize="14px"
          lineHeight="24px"
          color="primaryBright"
          fontWeight={700}
        >
          {t("Performance Fee")}
        </Box>
        <Flex alignItems="flex-start">
          <Box
            fontSize="14px"
            lineHeight="24px"
            color="primaryBright"
            fontWeight={700}
          >
            {performanceFee}
          </Box>
        </Flex>
      </Flex>
      <Box mt="11px" mb="2px">
        <Box
          textAlign="center"
          fontSize="18px"
          lineHeight="24px"
          color="white"
          fontWeight={700}
          style={{
            textTransform: "uppercase",
          }}
        >
          {t("Total staked")}
        </Box>
        <Flex justifyContent="center" alignItems="flex-start">
          {totalValue ? (
            <>
              <Box
                fontSize="19px"
                lineHeight="24px"
                color="white"
                fontWeight={900}
                style={{
                  textTransform: "uppercase",
                }}
              >
                {totalValue}
              </Box>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Box>
      {/*<Box*/}
      {/*  as="ul"*/}
      {/*  textAlign="left"*/}
      {/*  color="primaryBright"*/}
      {/*  fontSize="10px"*/}
      {/*  lineHeight="20px"*/}
      {/*>*/}
      {/*  <li>*/}
      {/*    You will receive farmBDS-USDT token as a receipt for your deposited*/}
      {/*    BDS-USDT LP assets.*/}
      {/*  </li>*/}
      {/*  <li>*/}
      {/*    FarmBDS-USDT token is needed to withdraw your BDS-USDT LP, do not*/}
      {/*    trade this token to strangers!*/}
      {/*  </li>*/}
      {/*  <li>*/}
      {/*    Withdrawal will result in: Redeem farmBDS-USDT token for BDS-USDT LP.*/}
      {/*  </li>*/}
      {/*</Box>*/}
      {/*{contractAddress && (*/}
      {/*  <Flex mb="2px" justifyContent="center">*/}
      {/*    <StyledLink bold={false} small href={addLiquidityUrl}>*/}
      {/*      {`${t("Get")} ${lpLabel}`}*/}
      {/*    </StyledLink>*/}
      {/*  </Flex>*/}
      {/*)}*/}
      <Flex mt="20px">
        <StyledLink bold={false} small href={addLiquidityUrl}>
          {`${t("Get")} ${lpLabel}`}
        </StyledLink>
        <Box ml="auto">
          <StyledLink href={`${BASE_BSC_SCAN_URL}/address/${contractAddress}`}>
            {t("View Contract")}
          </StyledLink>
        </Box>
      </Flex>
    </ExpandedWrapper>
  );
};

export default React.memo(ExpandedFooter);
