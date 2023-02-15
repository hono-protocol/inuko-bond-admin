import React from "react";
import { useTranslation } from "contexts/Localization";
import { Button } from "@bds-libs/uikit";
import { Link } from "react-router-dom";
import { Ifo, PoolIds } from "config/constants/types";
import { WalletIfoData, PublicIfoData } from "views/Ifos/types";
import ConnectWalletButton from "components/ConnectWalletButton";
import ContributeButton from "./ContributeButton";
import ClaimButton from "./ClaimButton";
import { SkeletonCardActions } from "./Skeletons";
import styled from "styled-components";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface Props {
  poolId: PoolIds;
  ifo: Ifo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
  hasProfile: boolean;
  isLoading: boolean;
}

const StyledConnectWalletButton = styled(ConnectWalletButton)`
  background: #ffae58;
  color: #052e22;
`;

const IfoCardActions: React.FC<Props> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
}) => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const userPoolCharacteristics = walletIfoData[poolId];

  if (isLoading) {
    return <SkeletonCardActions />;
  }

  if (!account) {
    return <StyledConnectWalletButton width="100%" />;
  }

  if (!hasProfile) {
    return (
      <Button as={Link} to="/profile" width="100%">
        {t("Activate your Profile")}
      </Button>
    );
  }

  return (
    <>
      {publicIfoData.status === "live" && (
        <ContributeButton
          poolId={poolId}
          ifo={ifo}
          publicIfoData={publicIfoData}
          walletIfoData={walletIfoData}
        />
      )}
      {publicIfoData.status === "finished" &&
        !userPoolCharacteristics.hasClaimed &&
        (userPoolCharacteristics.offeringAmountInToken.isGreaterThan(0) ||
          userPoolCharacteristics.refundingAmountInLP.isGreaterThan(0)) && (
          <ClaimButton
            poolId={poolId}
            ifoVersion={ifo.version}
            walletIfoData={walletIfoData}
          />
        )}
    </>
  );
};

export default IfoCardActions;
