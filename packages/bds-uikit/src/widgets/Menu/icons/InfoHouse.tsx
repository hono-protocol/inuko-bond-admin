import React from "react";
import { SvgProps } from "../../..";
import { Svg } from "../../../components/Svg";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 30 33" {...props}>
      <rect x="8.75" width="3.75" height="32.5" />
      <rect x="17.5" y="12.5" width="3.75" height="20" />
      <rect y="16.25" width="3.75" height="16.25" />
      <rect x="26.25" y="8.75" width="3.75" height="23.75" />
    </Svg>
  );
};

export default Icon;
