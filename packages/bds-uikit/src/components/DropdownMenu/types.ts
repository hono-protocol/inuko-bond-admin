import React from "react";
import { BoxProps } from "../Box";

export interface DropdownMenuProps extends BoxProps {
  items?: DropdownMenuItems[];
  activeItem?: string;
  isBottomNav?: boolean;
  openMenuTimeout?: number;
  showItemsOnMobile?: boolean;
  setMyActive?: () => void;
  setNoActive?: () => void;
}

export interface StyledDropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<"button"> {
  disabled?: boolean;
  isActive?: boolean;
}

export enum DropdownMenuItemType {
  INTERNAL_LINK,
  EXTERNAL_LINK,
  BUTTON,
  DIVIDER,
}

export interface LinkStatus {
  text: string;
  color: string;
}

export interface DropdownMenuItems {
  label?: string | React.ReactNode;
  href?: string;
  icon?: string;
  onClick?: () => void;
  type?: DropdownMenuItemType;
  status?: LinkStatus;
  disabled?: boolean;
}
