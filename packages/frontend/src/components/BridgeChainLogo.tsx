import React, { useMemo } from "react";
import styled from "styled-components";

import Logo from "./Logo/Logo";

export const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: ${({ size }) => size};
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  background-color: ${({ theme }) => theme.colors.input};
`;

export default function BridgeChainLogo({
  symbol,
  tokenAddress,
  size = "24px",
  style,
  logoUrl,
}: {
  symbol?: string;
  tokenAddress?: string;
  size?: string;
  style?: React.CSSProperties;
  logoUrl?: string;
}) {
  const srcs: string[] = useMemo(() => {
    if (!tokenAddress) return [];
    if (symbol === "ETH") return [];

    return [getTokenLogoURL(tokenAddress || symbol || "")];
  }, [symbol, tokenAddress]);

  if (logoUrl) {
    return (
      <StyledLogo
        size={size}
        srcs={[logoUrl]}
        alt={`${symbol ?? "token"} logo`}
        style={style}
      />
    );
  }

  return (
    <StyledLogo
      size={size}
      srcs={srcs}
      alt={`${symbol ?? "token"} logo`}
      style={style}
    />
  );
}
