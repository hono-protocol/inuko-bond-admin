import { HTMLAttributes } from "react";
import {
  BackgroundColorProps,
  LineHeightProps,
  BackgroundProps,
  BorderProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  FontSizeProps,
  FontWeightProps,
  TextAlignProps,
  OpacityProps,
  ShadowProps,
  GridProps as _GridProps,
} from "styled-system";

export interface BoxProps
  extends BackgroundProps,
    LineHeightProps,
    BackgroundColorProps,
    BorderProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    FlexboxProps,
    FontSizeProps,
    FontWeightProps,
    TextAlignProps,
    OpacityProps,
    ShadowProps,
    Omit<HTMLAttributes<HTMLDivElement>, "color"> {}

export interface FlexProps extends BoxProps, FlexboxProps {}

export interface GridProps extends FlexProps, _GridProps {}
