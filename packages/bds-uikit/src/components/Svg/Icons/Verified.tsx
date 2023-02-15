import React from "react";
import Svg from "../Svg";
import { SvgProps } from "../types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 24 24" {...props}>
      <path d="M10.1361 15.2873L18.3079 4.58952C18.8108 3.93119 19.7522 3.80518 20.4106 4.30807C21.0688 4.81096 21.1948 5.7523 20.692 6.41064L11.5253 18.4106C10.9907 19.1104 9.9711 19.2013 9.32117 18.6071L3.48785 13.2738C2.87645 12.7148 2.83397 11.766 3.39296 11.1546C3.95195 10.5432 4.90075 10.5007 5.51216 11.0597L10.1361 15.2873Z" />
    </Svg>
  );
};

export default Icon;
