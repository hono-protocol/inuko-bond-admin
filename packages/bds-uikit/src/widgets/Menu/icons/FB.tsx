import React from "react";
import Svg from "../../../components/Svg/Svg";
import { SvgProps } from "../../../components/Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 20 20" {...props}>
      <path d="M10 0C4.48029 0 0 4.48029 0 10C0 15.5197 4.48029 20 10 20C15.5197 20 20 15.5197 20 10C20 4.48029 15.5197 0 10 0ZM12.7599 6.12903H11.3082C11.0753 6.12903 10.7348 6.25448 10.7348 6.75627V8.10036H12.7599L12.5269 10.3943H10.7348V16.9355H8.02867V10.3943H6.73835V8.10036H8.02867V6.6129C8.02867 5.55556 8.53047 3.88889 10.7527 3.88889H12.7599V6.12903Z" />
    </Svg>
  );
};

export default Icon;
