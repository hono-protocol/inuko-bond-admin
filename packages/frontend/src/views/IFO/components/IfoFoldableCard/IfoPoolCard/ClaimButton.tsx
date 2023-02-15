import React, { useState } from "react";
import { AutoRenewIcon, Button } from "@bds-libs/uikit";
import { IfoVipPoolInfo, VipIfo } from "config/constants/types";
import { useTranslation } from "contexts/Localization";
import useToast from "hooks/useToast";
import BigNumber from "bignumber.js";
import { useContract } from "hooks/useContract";
import vipIfoABI from "config/abi/vip_ifo.json";

interface Props {
  ifo: VipIfo;
  poolConfig: IfoVipPoolInfo;
  hasClaimed: boolean;
  offeringAmountInToken: BigNumber;
  refundingAmountInLP: BigNumber;
}

const ClaimButton: React.FC<Props> = ({
  ifo,
  poolConfig,
  hasClaimed,
  offeringAmountInToken,
  refundingAmountInLP,
}) => {
  const { t } = useTranslation();
  const { toastError, toastSuccess } = useToast();
  const [pending, setPending] = useState(false);
  const vipIfoContract = useContract(ifo.address, vipIfoABI, true);

  const handleClaim = async () => {
    try {
      setPending(true);
      const tx = await vipIfoContract.harvestPool(poolConfig.pid);
      await tx.wait();

      toastSuccess(
        t("Success!"),
        t("You have successfully claimed your rewards.")
      );
    } catch (error) {
      toastError(
        t("Error"),
        t(
          "Please try again. Confirm the transaction and make sure you are paying enough gas!"
        )
      );
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={handleClaim}
      disabled={
        pending ||
        hasClaimed ||
        (offeringAmountInToken.lte(0) && refundingAmountInLP.lte(0))
      }
      width="100%"
      isLoading={pending}
      endIcon={pending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t("Claim")}
    </Button>
  );
};

export default ClaimButton;
