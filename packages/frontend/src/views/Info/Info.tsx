import React from "react";
import { Box, Grid } from "@bds-libs/uikit";
import InfoCardPrice from "./components/InfoCardPrice";
import InfoCardTVL from "./components/InfoCardTVL";
import InfoCardToken from "./components/InfoCardToken";

function Info() {
  return (
    <Box minHeight="100vh" pt={{ _: "20px", lg: "60px" }} pb="50px" px="20px">
      <Grid
        maxWidth="700px"
        mx="auto"
        display={{ _: "block", lg: "grid" }}
        gridTemplateColumns={{
          lg: "repeat(2 ,1fr)",
        }}
        gridColumnGap="20px"
      >
        <InfoCardPrice />
        <Box mt={{ _: "12px", lg: 0 }}>
          <InfoCardTVL />
        </Box>
      </Grid>
      <Box maxWidth="700px" mx="auto" mt="20px">
        <InfoCardToken />
      </Box>
    </Box>
  );
}

export default Info;
