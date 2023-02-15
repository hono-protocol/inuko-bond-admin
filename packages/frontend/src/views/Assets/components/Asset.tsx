import React from "react";
import CurrencyLogo from "../../../components/Logo/CurrencyLogo";
import { Currency } from "@pancakeswap/sdk";
import { BASE_BSC_SCAN_URL } from "../../../config";
import styled from "styled-components";
import { Box, LinkExternal } from "@bds-libs/uikit";
import { TokenWallet } from "../Assets";
import { getAddress } from "../../../utils/addressHelpers";
import { useAssetTokensSingle } from "../../../state/assets/hooks";
import { formatNumber } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import { formatEther } from "ethers/lib/utils";
import { useGetApiPrices } from "state/hooks";
export interface AssetProps {
  token: TokenWallet;
  etherBalance: BigNumber;
  etherPrice: number;
}

const StyledLink = styled(LinkExternal)`
  margin-left: 24px;

  svg {
    width: 20px;
    height: 20px;
    fill: #ffae58;
  }
`;

const IconChart = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 531 530"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="531" height="530" fill="url(#pattern0)" />
      <defs>
        <pattern
          id="pattern0"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0"
            transform="translate(-0.347458) scale(0.00188324)"
          />
        </pattern>
        <image
          id="image0"
          width="900"
          height="530"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

function Asset(props: AssetProps) {
  const { token: l, etherBalance, etherPrice } = props;
  const prices = useGetApiPrices();
  const isUsdt = l.token?.symbol === "USDT";

  const address = l.token ? getAddress(l.token.address) : "";

  const bl = useAssetTokensSingle(address);

  let logo = "";

  if (l.token) {
    logo = `images/tokens/${getAddress(l.token.address)}.png`;
  }

  return (
    <Box
      py="10px"
      px="24px"
      mt="10px"
      bg="#052D22"
      borderRadius="15px"
      display="flex"
      alignItems="center"
    >
      {!l.lp && (
        <CurrencyLogo
          size="32px"
          logo={logo}
          currency={l.isEther ? Currency.ETHER : l.token}
        />
      )}
      {l.lp && (
        <Box position="relative" display="flex">
          <CurrencyLogo
            style={{
              zIndex: 2,
              position: "relative",
            }}
            size="32px"
            currency={l.lp.token0}
          />
          <CurrencyLogo
            style={{
              zIndex: 1,
              position: "relative",
              left: "-10px",
            }}
            size="32px"
            currency={l.lp.token1}
          />
        </Box>
      )}
      <Box
        as="p"
        ml="11px"
        fontSize="18px"
        lineHeight="24px"
        fontWeight="700"
        color="#fff"
        minWidth="60px"
      >
        {l.token?.symbol || "BNB"}
        {!l.lp && (
          <Box
            mt="2px"
            as="p"
            fontSize="14px"
            lineHeight="16px"
            fontWeight="700"
            color="primaryBright"
          >
            <Box
              mt="2px"
              as="p"
              fontSize="14px"
              lineHeight="16px"
              fontWeight="700"
              color="primaryBright"
            >
              {l.isEther
                ? formatNumber(etherPrice, 3)
                : formatNumber(
                    isUsdt
                      ? 1
                      : prices?.[getAddress(l.token.address).toLowerCase()],
                    3
                  )}{" "}
              USDT
            </Box>
          </Box>
        )}
      </Box>
      {l.isPooCoin && (
        <Box
          ml="24px"
          as="a"
          target="__blank"
          rel="noreferrer noopener"
          href={`https://poocoin.app/tokens/${getAddress(l.token.address)}`}
        >
          <IconChart />
        </Box>
      )}
      <Box ml="auto" display="flex" alignItems="center">
        <Box textAlign="right">
          <Box
            display="block"
            as="strong"
            fontSize="18px"
            lineHeight="20px"
            fontWeight="700"
            color="#fff"
          >
            {!l.isEther && (bl ? formatNumber(bl.balance, l.lp ? 9 : 3) : 0)}
            {l.isEther && formatNumber(formatEther(etherBalance.toString()), 4)}
          </Box>
          <Box
            mt="2px"
            as="p"
            fontSize="14px"
            lineHeight="16px"
            fontWeight="700"
            color="primaryBright"
          >
            {!l.isEther && formatNumber(bl ? bl.value : 0, 3)}
            {l.isEther &&
              formatNumber(
                Number(formatEther(etherBalance.toString())) * etherPrice,
                3
              )}{" "}
            USDT
          </Box>
        </Box>
        <Box>
          <StyledLink
            href={!!address && `${BASE_BSC_SCAN_URL}/token/${address}`}
            external={true}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Asset;
