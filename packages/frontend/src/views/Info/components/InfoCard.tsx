import React from "react";
import { Box, BoxProps } from "@bds-libs/uikit";

export default function InfoCard(props: BoxProps) {
  return (
    <Box
      px="24px"
      py="20px"
      borderRadius="15px"
      backgroundColor="background"
      {...props}
    />
  );
}
