import React from "react";
import { Box, BoxProps, darkColors } from "@bds-libs/uikit";

export interface ButtonAmountProps extends BoxProps {
  children?: React.ReactNode;
}

function ButtonAmount(props: ButtonAmountProps) {
  const { children, ...other } = props;
  return (
    <Box
      p="8px 16px"
      as="button"
      border="1px solid"
      borderColor={darkColors.black}
      borderRadius="16px"
      background="transparent"
      color={darkColors.black}
      style={{
        cursor: "pointer",
      }}
      {...(other as any)}
    >
      {children}
    </Box>
  );
}

export default ButtonAmount;
