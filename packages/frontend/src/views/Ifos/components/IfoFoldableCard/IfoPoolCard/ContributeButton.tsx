import React from "react";
import BigNumber from "bignumber.js";
import { Button, useModal } from "@bds-libs/uikit";
import { getBalanceNumber } from "utils/formatBalance";
import { Ifo, PoolIds } from "config/constants/types";
import { WalletIfoData, PublicIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import useTokenBalance from "hooks/useTokenBalance";
import { getAddress } from "utils/addressHelpers";
import useToast from "hooks/useToast";
import ContributeModal from "./ContributeModal";
import GetLpModal from "./GetLpModal";
import styled from "styled-components";

interface Props {
  poolId: PoolIds;
  ifo: Ifo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
}

const StyledButtonAction = styled(Button)`
  background: #ffae58;
  color: #052e22;
`;

const ContributeButton: React.FC<Props> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
}) => {
  const publicPoolCharacteristics = publicIfoData[poolId];
  const userPoolCharacteristics = walletIfoData[poolId];
  const { isPendingTx, amountTokenCommittedInLP } = userPoolCharacteristics;
  const { limitPerUserInLP } = publicPoolCharacteristics;
  const { t } = useTranslation();
  const { toastSuccess } = useToast();
  const { balance: userCurrencyBalance } = useTokenBalance(
    getAddress(ifo.currency.address)
  );

  // Refetch all the data, and display a message when fetching is done
  const handleContributeSuccess = async (amount: BigNumber) => {
    await Promise.all([
      publicIfoData.fetchIfoData(),
      walletIfoData.fetchIfoData(),
    ]);
    toastSuccess(
      t("Success!"),
      t("You have contributed %amount% %symbol% LP tokens to this IFO!", {
        amount: getBalanceNumber(amount),
        symbol: ifo.lpName,
      })
    );
  };

  const [onPresentContributeModal] = useModal(
    <ContributeModal
      poolId={poolId}
      ifo={ifo}
      publicIfoData={publicIfoData}
      walletIfoData={walletIfoData}
      onSuccess={handleContributeSuccess}
      userCurrencyBalance={userCurrencyBalance}
    />,
    false
  );

  const [onPresentGetLpModal] = useModal(
    <GetLpModal
      lpName={ifo.lpName}
      isLP={ifo.currencyIsLP}
      currency={ifo.currency}
    />,
    false
  );

  const isDisabled =
    isPendingTx ||
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
