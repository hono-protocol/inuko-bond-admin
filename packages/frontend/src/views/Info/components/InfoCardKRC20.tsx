import React from "react";
import { Box } from "@bds-libs/uikit";
import InfoCard from "./InfoCard";
import { useStatisticsKRC20 } from "../../../state/statistics/hooks";
import { formatNumber } from "../../../utils/formatBalance";

function InfoCardBep20() {
  const { locked10, circulation, burned, locked, bep20 } = useStatisticsKRC20();
  return (
    <InfoCard>
      <Box
        fontWeight={700}
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        BDS KRC20 Stats
      </Box>
      <Box
        mt="26px"
        as="p"
        fontWeight={300}
        fontSize="13px"
        display="flex"
        color="textSubtle"
      >
        Max Supply
        <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>
          1,000,000,000 BDS
        </Box>
      </Box>
      <Box
        mt="10px"
        as="p"
        fontWeight={300}
        fontSize="13px"
        display="flex"
        color="textSubtle"
      >
        Total Supply
        <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>
          1,000,000,000 BDS
        </Box>
      </Box>
      {/*<Box*/}
      {/*  mt="10px"*/}
      {/*  as="p"*/}
      {/*  fontWeight={300}*/}
      {/*  fontSize="13px"*/}
      {/*  display="flex"*/}
      {/*  color="textSubtle"*/}
      {/*>*/}
      {/*  Lock 10 years*/}
      {/*  <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>*/}
      {/*    {formatNumber(locked10)} BDS*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      {/*<Box*/}
      {/*  mt="10px"*/}
      {/*  as="p"*/}
      {/*  fontWeight={300}*/}
      {/*  fontSize="13px"*/}
      {/*  display="flex"*/}
      {/*  color="textSubtle"*/}
      {/*>*/}
      {/*  Lock this years*/}
      {/*  <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>*/}
      {/*    {formatNumber(locked)} BDS*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      {/*<Box*/}
      {/*  mt="10px"*/}
      {/*  as="p"*/}
      {/*  fontWeight={300}*/}
      {/*  fontSize="13px"*/}
      {/*  display="flex"*/}
      {/*  color="textSubtle"*/}
      {/*>*/}
      {/*  Burned*/}
      {/*  <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>*/}
      {/*    {formatNumber(burned)} BDS*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      {/*<Box*/}
      {/*  mt="10px"*/}
      {/*  as="p"*/}
      {/*  fontWeight={300}*/}
      {/*  fontSize="13px"*/}
      {/*  display="flex"*/}
      {/*  color="textSubtle"*/}
      {/*>*/}
      {/*  BEP20 Bridge*/}
      {/*  <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>*/}
      {/*    {formatNumber(bep20)} BDS*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      <Box
        mt="10px"
        as="p"
        fontWeight={300}
        fontSize="13px"
        display="flex"
        color="textSubtle"
      >
        Circulation
        <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>
          {formatNumber(circulation)} BDS
        </Box>
      </Box>
    </InfoCard>
  );
}

export default InfoCardBep20;
