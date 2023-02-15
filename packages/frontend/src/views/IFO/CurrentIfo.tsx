import React from "react";
import { Box } from "@bds-libs/uikit";
import { vipIfoConfig } from "config/constants";
import useGetPublicVipIfoData from "views/IFO/hooks/vip/useGetPublicVipIfoData";
import IfoFoldableCard from "./components/IfoFoldableCard";
import IfoLayout from "./components/IfoLayout";
import IfoSteps from "./components/IfoSteps";

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = vipIfoConfig.find((ifo) => ifo.isActive);

const Ifo = () => {
  const publicIfoData = useGetPublicVipIfoData(activeIfo);
  // const walletIfoData = useGetWalletIfoV2Data(activeIfo);

  return (
    <IfoLayout>
      <Box
        height="150px"
        right="50px"
        top="120px"
        position="absolute"
        zIndex={-1}
        as="img"
        src="/images/cloud.png"
      />
      <Box
        left="-50px"
        top="300px"
        position="absolute"
        zIndex={-1}
        as="img"
        src="/images/cloud.png"
      />
      <IfoFoldableCard
        ifo={activeIfo}
        publicIfoData={publicIfoData}
        isInitiallyVisible
      />
      <IfoSteps />
    </IfoLayout>
  );
};

export default Ifo;
