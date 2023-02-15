import styled from "styled-components";
import {
  grid,
  background,
  border,
  layout,
  position,
  space,
  flex,
  flexbox,
  color,
  fontSize,
  fontWeight,
  textAlign,
  opacity,
  shadow,
  lineHeight,
} from "styled-system";
import { BoxProps } from "./types";

const Box = styled.div<BoxProps>`
  ${grid}
  ${background}
  ${border}
  ${layout}
  ${position}
  ${space}
  ${flex}
  ${flexbox}
  ${color}
  ${fontSize}
  ${lineHeight}
  ${fontWeight}
  ${textAlign}
  ${opacity}
  ${shadow}
`;

export default Box;
