export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  nav: string;
};

export type Spacing = number[];

export type Radii = {
  small: string;
  default: string;
  card: string;
  circle: string;
};

export type Shadows = {
  level1: string;
  active: string;
  success: string;
  warning: string;
  focus: string;
  inset: string;
};

export type Gradients = {
  bubblegum: string;
  cardHeader: string;
  blue: string;
  violet: string;
  violetAlt: string;
};

export type Colors = {
  primary: string;
  white: string;
  black: string;
  yellow: string;
  primaryBright: string;
  primaryDark: string;
  secondary: string;
  tertiary: string;
  success: string;
  failure: string;
  warning: string;
  contrast: string;
  dropdown: string;
  invertedContrast: string;
  input: string;
  inputSecondary: string;
  background: string;
  backgroundNav: string;
  backgroundDisabled: string;
  backgroundAlt: string;
  cardBorder: string;
  text: string;
  textDisabled: string;
  textSubtle: string;
  borderColor: string;

  // Gradients
  gradients: Gradients;

  // Brand colors
  binance: string;
};

export type ZIndices = {
  dropdown: number;
  modal: number;
};
