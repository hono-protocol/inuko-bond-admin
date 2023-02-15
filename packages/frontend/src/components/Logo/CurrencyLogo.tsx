import { Currency, ETHER, Token } from "@pancakeswap/sdk";
import { BinanceIcon } from "@bds-libs/uikit";
import React, { useMemo } from "react";
import styled from "styled-components";
import useHttpLocations from "../../hooks/useHttpLocations";
import { WrappedTokenInfo } from "../../state/lists/hooks";
import getTokenLogoURL from "../../utils/getTokenLogoURL";
import Logo from "./Logo";

const StyledLogo = styled(Logo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const logos = {
  USDT: "/images/tokens/0x55d398326f99059ff775485246999027b3197955.png",
  WBNB: "/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png",
  INUKO: "/images/tokens/0xea51801b8f5b88543ddad3d1727400c15b209d8f.png",
};

export default function CurrencyLogo({
  logo,
  currency,
  size = "24px",
  style,
}: {
  logo?: string;
  currency?: Currency;
  size?: string;
  style?: React.CSSProperties;
}) {
  const uriLocations = useHttpLocations(
    currency instanceof WrappedTokenInfo ? currency.logoURI : undefined
  );

  const srcs: string[] = useMemo(() => {
    const isLocalImage =
      currency instanceof WrappedTokenInfo
        ? currency.logoURI?.indexOf("/") === 0
        : undefined;

    if (isLocalImage) {
      return [currency instanceof WrappedTokenInfo ? currency.logoURI : ""];
    }

    if (currency === ETHER) return [];

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, getTokenLogoURL(currency.address)];
      }
      return [getTokenLogoURL(currency.address)];
    }
    return [];
  }, [currency, uriLocations]);

  if (currency === ETHER) {
    return <BinanceIcon width={size} style={style} />;
  }

  let final = logo ? [logo] : srcs;

  if (logos[currency.symbol]) {
    final = [logos[currency.symbol]];
  }

  return (
    <StyledLogo
      size={size}
      srcs={final}
      alt={`${currency?.symbol ?? "token"} logo`}
      style={style}
    />
  );
}
