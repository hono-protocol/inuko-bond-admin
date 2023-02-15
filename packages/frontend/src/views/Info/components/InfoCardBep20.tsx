import React from "react";
import { Box } from "@bds-libs/uikit";
import InfoCard from "./InfoCard";
import { useStatistics } from "../../../state/statistics/hooks";
import { formatNumber } from "../../../utils/formatBalance";

function InfoCardBep20() {
  const { lockedBridge, circulation } = useStatistics();

  return (
    <InfoCard>
      <Box
        fontWeight={700}
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        BDS BEP20 Stats
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
      <Box
        mt="10px"
        as="p"
        fontWeight={300}
        fontSize="13px"
        display="flex"
        color="textSubtle"
      >
        Locked in Bridge
        <Box ml="auto" as="strong" color="primaryBright" fontWeight={900}>
          {formatNumber(lockedBridge, 3)} BDS
        </Box>
      </Box>
      <Box
        mt="40px"
        fontWeight={700}
        textAlign="center"
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        Circulation
      </Box>
      <Box
        fontWeight={700}
        mt="8px"
        textAlign="center"
        as="p"
        color="primaryBright"
        fontSize="20px"
        lineHeight="22px"
      >
        {formatNumber(circulation, 3)} BDS
      </Box>
    </InfoCard>
  );
}

export default InfoCardBep20;
