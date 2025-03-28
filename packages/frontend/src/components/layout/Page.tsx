import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router";
import { customMeta, DEFAULT_META } from "config/constants/meta";
import { usePriceCakeBusd } from "state/hooks";
import Container from "./Container";

const StyledPage = styled(Container)`
  min-height: calc(100vh - 40px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    min-height: calc(100vh - 64px);
  }
`;

const PageMeta = () => {
  const { pathname } = useLocation();
  const cakePriceUsd = usePriceCakeBusd();
  const cakePriceUsdDisplay = cakePriceUsd.eq(0)
    ? ""
    : `${cakePriceUsd.toNumber().toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })} USDT`;
  const pageMeta = customMeta[pathname] || {};
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta };
  const pageTitle = cakePriceUsdDisplay
    ? [title, cakePriceUsdDisplay].join(" - ")
    : title;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Helmet>
  );
};

const Page: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  );
};

export default Page;
