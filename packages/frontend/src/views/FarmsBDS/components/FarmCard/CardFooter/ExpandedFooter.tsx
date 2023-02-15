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
  depositFee?: number;
  addLiquidityUrl: string;
  lpLabel: string;
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 700;
  font-size: 13px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textSubtle};

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle}!important;
  }
`;

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({
  totalValue,
  projectLink,
  stakingTokenSymbol,
  contractAddress,
  addLiquidityUrl,
  lpLabel,
}) => {
  const { t } = useTranslation();

  return (
    <ExpandedWrapper flexDirection="column">
      <Box>
        <Box
          textAlign="center"
          color="text"
          fontSize="18px"
          fontWeight={900}
          lineHeight="24px"
        >
          {t("Total staked:")}
        </Box>
        <Box
          display="flex"
          mt="10px"
          justifyContent="center"
          textAlign="center"
          color="text"
          fontSize="19px"
          fontWeight={900}
          lineHeight="24px"
        >
          {totalValue ? (
            <>
              <Box>{totalValue}</Box>
              <Box ml="4px">{stakingTokenSymbol}</Box>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Box>
      </Box>
      {/*<Flex mb="2px" justifyContent="space-between" alignItems="center">*/}
      {/*  <Text small>{t("Total staked:")}</Text>*/}
      {/*  <Flex alignItems="flex-start">*/}
      {/*    {totalValue ? (*/}
      {/*      <>*/}
      {/*        <Text fontSize="14px">{totalValue}</Text>*/}
      {/*        <Text ml="4px" fontSize="14px">*/}
      {/*          {stakingTokenSymbol}*/}
      {/*        </Text>*/}
      {/*      </>*/}
      {/*    ) : (*/}
      {/*      <Skeleton width="90px" height="21px" />*/}
      {/*    )}*/}
      {/*  </Flex>*/}
      {/*</Flex>*/}
      {projectLink && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal bold={false} small href={projectLink}>
            {t("View Project Site")}
          </LinkExternal>
        </Flex>
      )}
      <Box mt="20px" display="flex" alignItems="center">
        <StyledLinkExternal href={addLiquidityUrl}>
          {t("Get")} {lpLabel}
        </StyledLinkExternal>
        <Box ml="auto">
          <StyledLinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${contractAddress}`}
          >
            {t("View Contract")}
          </StyledLinkExternal>
        </Box>
      </Box>
      {/* {account && isMetaMaskInScope && tokenAddress && ( */}
      {/*  <Flex justifyContent="flex-end"> */}
      {/*    <Button */}
      {/*      variant="text" */}
      {/*      p="0" */}
      {/*      height="auto" */}
      {/*      onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)} */}
      {/*    > */}
      {/*      <Text color="primary" fontSize="14px"> */}
      {/*        Add to Metamask */}
      {/*      </Text> */}
      {/*      <MetamaskIcon ml="4px" /> */}
      {/*    </Button> */}
      {/*  </Flex> */}
      {/* )} */}
    </ExpandedWrapper>
  );
};

export default React.memo(ExpandedFooter);
