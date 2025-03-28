import { Colors } from "./types";

export const baseColors = {
  failure: "#ED4B9E",
  primary: "#177358",
  primaryBright: "#53DEE9",
  primaryDark: "#0098A1",
  secondary: "#34612f",
  success: "#31D0AA",
  warning: "#FFB237",
};

export const brandColors = {
  binance: "#F0B90B",
};

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  white: '#f5f5f5',
  black: '#181a1d',
  yellow: '#ffb739',
  background: "#FAF9FA",
  backgroundDisabled: "#E9EAEB",
  backgroundAlt: "#FFFFFF",
  cardBorder: "#E7E3EB",
  backgroundNav: "#FFFFFF",
  contrast: "#191326",
  dropdown: "#F6F6F6",
  invertedContrast: "#FFFFFF",
  input: "#eeeaf4",
  inputSecondary: "#d7caec",
  tertiary: "#EFF4F5",
  text: "#000",
  textDisabled: "#BDC2C4",
  textSubtle: "#177358",
  borderColor: "#E9EAEB",
  gradients: {
    bubblegum: "linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)",
    cardHeader: "linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)",
    blue: "linear-gradient(180deg, #A7E8F1 0%, #94E1F2 100%)",
    violet: "linear-gradient(180deg, #E2C9FB 0%, #CDB8FA 100%)",
    violetAlt: "linear-gradient(180deg, #CBD7EF 0%, #9A9FD0 100%)",
  },
};

// export const darkColors: Colors = {
//   ...baseColors,
//   ...brandColors,
//   primary: "#177358",
//   primaryBright: "#9BCABB",
//   secondary: "#FFAE58",
//   background: "#052E22",
//   backgroundDisabled: "#3c3742",
//   backgroundAlt: "#27262c",
//   cardBorder: "#383241",
//   backgroundNav: "#052E22",
//   contrast: "#FFFFFF",
//   dropdown: "#1E1D20",
//   invertedContrast: "#191326",
//   input: "#483f5a",
//   inputSecondary: "#66578D",
//   primaryDark: "#0098A1",
//   tertiary: "#353547",
//   text: "#fff",
//   textDisabled: "#666171",
//   textSubtle: "#FFAE58",
//   borderColor: "#524B63",
//   gradients: {
//     bubblegum: "linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)",
//     cardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
//     blue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
//     violet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
//     violetAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
//   },
// };

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  white: '#f5f5f5',
  black: '#181a1d',
  yellow: '#ffb739',
  primary: "#ffb739",
  primaryBright: "#181a1d",
  secondary: "#ffb739",
  background: "#f5f5f5",
  backgroundDisabled: "#3c3742",
  backgroundAlt: "#27262c",
  cardBorder: "#383241",
  backgroundNav: "#f5f5f5",
  contrast: "#FFFFFF",
  dropdown: "#1E1D20",
  invertedContrast: "#191326",
  input: "#483f5a",
  inputSecondary: "#66578D",
  primaryDark: "#0098A1",
  tertiary: "#353547",
  text: "#fff",
  textDisabled: "#666171",
  textSubtle: "#ffb739",
  borderColor: "#524B63",
  gradients: {
    bubblegum: "linear-gradient(180deg, #f5f5f5 0%, #ffb739 100%)",
    cardHeader: "linear-gradient(166.77deg, #3B4155 0%, #3A3045 100%)",
    blue: "linear-gradient(180deg, #00707F 0%, #19778C 100%)",
    violet: "linear-gradient(180deg, #6C4999 0%, #6D4DB2 100%)",
    violetAlt: "linear-gradient(180deg, #434575 0%, #66578D 100%)",
  },
};
