import React from "react";
import useGetPublicVipIfoData from "../hooks/vip/useGetPublicVipIfoData";
import { VipIfo } from "config/constants/types";
import IfoFoldableCard from "./IfoFoldableCard";

interface Props {
  ifo: VipIfo;
  isInitiallyVisible: boolean;
}

const IfoCardV2Data: React.FC<Props> = ({ ifo, isInitiallyVisible }) => {
  const publicIfoData = useGetPublicVipIfoData(ifo);
  // const walletIfoData = useGetWalletIfoV2Data(ifo);

  return (
    <IfoFoldableCard
      ifo={ifo}
      publicIfoData={publicIfoData}
      // walletIfoData={walletIfoData}
      isInitiallyVisible={isInitiallyVisible}
    />
  );
};

export default IfoCardV2Data;
