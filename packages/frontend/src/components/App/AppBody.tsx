import React from "react";
import styled from "styled-components";
import { Card } from "@bds-libs/uikit";

export const BodyWrapper = styled(Card)`
  max-width: 480px;
  width: 100%;
  z-index: 1;
  margin: 0 auto;
  background-color: ${({ theme }) => {
    return theme.colors.background;
  }};
  border-radius: 15px;
  padding: 20px 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 30px;
  }
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>;
}
