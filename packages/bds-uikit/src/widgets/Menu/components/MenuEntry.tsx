import React from "react";
import styled, { keyframes, DefaultTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Colors } from "../../../theme/types";
import { MENU_ENTRY_HEIGHT } from "../config";

export interface Props {
  secondary?: boolean;
  isActive?: boolean;
  theme: DefaultTheme;
}

const rainbowAnimation = keyframes`
  0%,
  100% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
`;

const LinkLabel = styled.div<{
  isPushed: boolean;
  isActive?: boolean;
  isSub?: boolean;
}>`
  font-weight: ${({ isSub }) => (isSub ? "normal" : "normal")};
  font-size: ${({ isSub }) => (isSub ? "13px" : "16px")};
  color: ${({ theme, isActive, isSub }) => {
    if (isSub) {
      return theme.colors.textSubtle;
    }
    return isActive ? theme.colors.black : theme.colors.black;
  }};
  transition: color 0.4s;
  flex-grow: 1;
  margin-left: 14px;
`;

const MenuEntry = styled.div<Props>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  padding: ${({ secondary }) => (secondary ? "0 32px" : "0 16px")};
  font-size: ${({ secondary }) => (secondary ? "14px" : "16px")};
  color: "${({ theme }) => theme.colors.textSubtle};"
  box-shadow: ${({ isActive, theme }) =>
    isActive ? `inset 4px 0px 0px ${theme.colors.primary}` : "none"};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.yellow : theme.colors.white};

  a {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  &:not(.not-apply) {
    svg {
      fill:${({ isActive, theme }) => {
        return isActive ? theme.colors.black : theme.colors.black;
      }};
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.yellow};
    transition: 0.3s all;
  }

  // Safari fix
  flex-shrink: 0;

  &.rainbow {
    background-clip: text;
    animation: ${rainbowAnimation} 3s ease-in-out infinite;
    background: ${({ theme }) => theme.colors.gradients.bubblegum};
    background-size: 400% 100%;
  }
`;
MenuEntry.defaultProps = {
  secondary: false,
  isActive: false,
  role: "button",
};

const LinkStatus = styled(Text)<{ color: keyof Colors }>`
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 0 8px;
  border: 2px solid;
  border-color: ${({ theme, color }) => theme.colors[color]};
  box-shadow: none;
  color: ${({ theme, color }) => theme.colors[color]};
  margin-left: 8px;
`;

export { MenuEntry, LinkStatus, LinkLabel };
