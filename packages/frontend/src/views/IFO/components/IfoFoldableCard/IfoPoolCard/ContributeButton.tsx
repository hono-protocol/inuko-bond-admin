import React from "react";
import BigNumber from "bignumber.js";
import { Button, useModal } from "@bds-libs/uikit";
import { getBalanceNumber } from "utils/formatBalance";
import { Ifo, IfoVipPoolInfo, PoolIds, VipIfo } from "config/constants/types";
import { WalletIfoData, PublicIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import useTokenBalance from "hooks/useTokenBalance";
import { getAddress } from "utils/addressHelpers";
import useToast from "hooks/useToast";
import ContributeModal from "./ContributeModal";
import GetLpModal from "./GetLpModal";
import styled from "styled-components";

interface Props {
  ifo: VipIfo;
  publicIfoData: PublicIfoData;
  poolConfig: IfoVipPoolInfo;
  amountTokenCommittedInLP: BigNumber;
  isPending: boolean;
  limitPerUserInLP: BigNumber;
}

const StyledButtonAction = styled(Button)`
  background: #ffae58;
  color: #052e22;
`;

const ContributeButton: React.FC<Props> = ({
  ifo,
  publicIfoData,
  amountTokenCommittedInLP,
  poolConfig,
  isPending,
  limitPerUserInLP,
}) => {
  const { t } = useTranslation();
  const { toastSuccess } = useToast();
  const { balance: userCurrencyBalance } = useTokenBalance(
    getAddress(poolConfig.lpToken.address)
  );

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber) => {
    toastSuccess(
      t("Success!"),
      t("You have contributed %amount% %symbol% LP tokens to this Pool!", {
        amount: getBalanceNumber(amount, poolConfig.lpToken.decimals),
        symbol: poolConfig.lpToken.symbol,
      })
    );
  };

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      ifo={ifo}
      poolConfig={poolConfig}
      publicIfoData={publicIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
      limitPerUserInLP={limitPerUserInLP}
      amountTokenCommittedInLP={amountTokenCommittedInLP}
    />,
    false
  );

  const [onPresentGetLpModal] = useModal(
    <GetLpModal
      lpName={poolConfig.lpToken.symbol}
      isLP={poolConfig.isLP}
      currency={poolConfig.lpToken}
    />,
    false
  );

  const isDisabled =
    isPending ||
    (limitPerUserInLP.isGreaterThan(0) &&
      amountTokenCommittedInLP.isGreaterThanOrEqualTo(limitPerUserInLP));

  return (
    <StyledButtonAction
      onClick={
        userCurrencyBalance.isEqualTo(0)
          ? onPresentGetLpModal
          : onPresentContributeModal
      }
      width="100%"
      disabled={isDisabled}
    >
      {isDisabled ? t("Max. Committed") : t("Commit now")}
    </StyledButtonAction>
  );
};

export default ContributeButton;
