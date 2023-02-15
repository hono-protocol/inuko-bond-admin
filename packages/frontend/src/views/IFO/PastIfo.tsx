import React from "react";
import { vipIfoConfig } from "config/constants";
import { VipIfo } from "config/constants/types";
import IfoCardV2Data from "./components/IfoCardV2Data";
import IfoLayout from "./components/IfoLayout";

const inactiveIfo: VipIfo[] = vipIfoConfig.filter((ifo) => !ifo.isActive);

const PastIfo = () => {
  return (
    <IfoLayout>
      {inactiveIfo.map((ifo) => (
        <IfoCardV2Data key={ifo.id} ifo={ifo} isInitiallyVisible={false} />
      ))}
    </IfoLayout>
  );
};

export default PastIfo;
