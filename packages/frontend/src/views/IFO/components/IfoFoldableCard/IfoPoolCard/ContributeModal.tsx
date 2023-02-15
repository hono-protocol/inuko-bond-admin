import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import {
  Modal,
  ModalBody,
  Text,
  Button,
  BalanceInput,
  Flex,
} from "@bds-libs/uikit";
import { IfoVipPoolInfo, VipIfo } from "config/constants/types";
import { PublicIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import { getBalanceAmount } from "utils/formatBalance";
import { getAddress } from "utils/addressHelpers";
import ApproveConfirmButtons from "views/Profile/components/ApproveConfirmButtons";
import useApproveConfirmTransaction from "hooks/useApproveConfirmTransaction";
import { DEFAULT_TOKEN_DECIMAL } from "config";
import { useContract, useERC20 } from "hooks/useContract";
import { BIG_NINE, BIG_TEN } from "utils/bigNumber";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import vipIfoABI from "config/abi/vip_ifo.json";

interface Props {
  ifo: VipIfo;
  publicIfoData: PublicIfoData;
  // walletIfoData: WalletIfoData;
  poolConfig: IfoVipPoolInfo;
  userCurrencyBalance: BigNumber;
  onSuccess: (amount: BigNumber) => void;
  onDismiss?: () => void;
  limitPerUserInLP: BigNumber;
  amountTokenCommittedInLP: BigNumber;
}

const multiplierValues = [0.1, 0.25, 0.5, 0.75, 1];

// Default value for transaction setting, tweak based on BSC network congestion.
const gasPrice = BIG_TEN.times(BIG_TEN.pow(BIG_NINE)).toString();

const ContributeModal: React.FC<Props> = ({
  ifo,
  poolConfig,
  limitPerUserInLP,
  // walletIfoData,
  userCurrencyBalance,
  amountTokenCommittedInLP,
  onDismiss,
  onSuccess,
}) => {
  // const { contract } = walletIfoData;
  const [value, setValue] = useState("");
  const { account } = useActiveWeb3React();
  const raisingTokenContract = useERC20(getAddress(poolConfig.lpToken.address));
  const { t } = useTranslation();
  const valueWithTokenDecimals = new BigNumber(
    new BigNumber(value)
      .times(BIG_TEN.pow(poolConfig.lpToken.decimals))
      .toFixed(0)
  );
  const vipIfoContract = useContract(ifo.address, vipIfoABI, true);

  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const response = await raisingTokenContract.allowance(
          account,
          ifo.address
        );
        const currentAllowance = new BigNumber(response.toString());
        return currentAllowance.gt(0);
      } catch (error) {
        return false;
      }
    },
    onApprove: () => {
      return raisingTokenContract.approve(
        ifo.address,
        ethers.constants.MaxUint256,
        { gasPrice }
      );
    },
    onConfirm: () => {
      return vipIfoContract.depositPool(
        valueWithTokenDecimals.toString(),
        poolConfig.pid,
        {
          gasPrice,
        }
      );
    },
    onSuccess: async () => {
      await onSuccess(valueWithTokenDecimals);
      onDismiss();
    },
  });

  const maximumLpCommitable = (() => {
    if (limitPerUserInLP.isGreaterThan(0)) {
      return limitPerUserInLP
        .minus(amountTokenCommittedInLP)
        .isLessThanOrEqualTo(userCurrencyBalance)
        ? limitPerUserInLP.minus(amountTokenCommittedInLP)
        : userCurrencyBalance;
    }
    return userCurrencyBalance;
  })();

  return (
    <Modal
      title={t("Contribute %symbol%", { symbol: poolConfig.lpToken.symbol })}
      onDismiss={onDismiss}
    >
      <ModalBody maxWidth="320px">
        {limitPerUserInLP.isGreaterThan(0) && (
          <Flex justifyContent="space-between" mb="16px">
            <Text>{t("Max")}</Text>
            <Text>
              {getBalanceAmount(
                maximumLpCommitable,
                poolConfig.lpToken.decimals
              ).toString()}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between" mb="8px">
          <Text>{t("Commit")}:</Text>
          <Flex flexGrow={1} justifyContent="flex-end">
            <Text>{poolConfig.lpToken.symbol}</Text>
          </Flex>
        </Flex>
        <BalanceInput
          value={value}
          // currencyValue={`~${publicIfoData.currencyPriceInUSD
          //   .times(value || 0)
          //   .toFixed(2)} USDT`}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          isWarning={valueWithTokenDecimals.isGreaterThan(maximumLpCommitable)}
          mb="8px"
        />
        <Text color="textSubtle" textAlign="right" fontSize="12px" mb="16px">
          {t("Balance: %balance%", {
            balance: getBalanceAmount(
              userCurrencyBalance,
              poolConfig.lpToken.decimals
            ).toString(),
          })}
        </Text>
        <Flex justifyContent="space-between" mb="16px">
          {multiplierValues.map((multiplierValue, index) => (
            <Button
              key={multiplierValue}
              scale="xs"
              variant="action"
              onClick={() =>
                setValue(
                  getBalanceAmount(
                    maximumLpCommitable.times(multiplierValue),
                    poolConfig.lpToken.decimals
                  ).toString()
                )
              }
              mr={index < multiplierValues.length - 1 ? "8px" : 0}
            >
              {multiplierValue * 100}%
            </Button>
          ))}
        </Flex>
        <ApproveConfirmButtons
          isApproveDisabled={isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={
            !isApproved ||
            isConfirmed ||
            valueWithTokenDecimals.isNaN() ||
            valueWithTokenDecimals.eq(0)
          }
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
      </ModalBody>
    </Modal>
  );
};

export default ContributeModal;
