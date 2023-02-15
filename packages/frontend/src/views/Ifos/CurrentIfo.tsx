import React from "react";
import { Box } from "@bds-libs/uikit";
import { ifosConfig } from "config/constants";
import useGetPublicIfoV2Data from "views/Ifos/hooks/v2/useGetPublicIfoData";
import useGetWalletIfoV2Data from "views/Ifos/hooks/v2/useGetWalletIfoData";
import IfoFoldableCard from "./components/IfoFoldableCard";
import IfoLayout from "./components/IfoLayout";
import IfoSteps from "./components/IfoSteps";
import IfoQuestions from "./components/IfoQuestions";

/**
 * Note: currently there should be only 1 active IFO at a time
 */
const activeIfo = ifosConfig.find((ifo) => ifo.isActive);

const Ifo = () => {
  const publicIfoData = useGetPublicIfoV2Data(activeIfo);
  const walletIfoData = useGetWalletIfoV2Data(activeIfo);

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
        walletIfoData={walletIfoData}
        isInitiallyVisible
      />
      <IfoSteps ifo={activeIfo} walletIfoData={walletIfoData} />
      <IfoQuestions />
    </IfoLayout>
  );
};

export default Ifo;
