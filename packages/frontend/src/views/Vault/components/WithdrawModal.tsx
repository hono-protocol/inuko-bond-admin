import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal } from "@bds-libs/uikit";
import ModalActions from "components/ModalActions";
import ModalInput from "components/ModalInput";
import { useTranslation } from "contexts/Localization";
import {
  formatNumber,
  getBalance,
  getFullDisplayBalance,
} from "utils/formatBalance";

interface WithdrawModalProps {
  LPPrice: BigNumber | undefined;
  max: BigNumber;
  onConfirm: (amount: string, decimals?: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  decimals?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  LPPrice,
  onConfirm,
  decimals,
  onDismiss,
  max,
  tokenName = "",
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const { t } = useTranslation();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, decimals);
  }, [max]);

  const valNumber = new BigNumber(val);
  const fullBalanceNumber = new BigNumber(fullBalance);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, "."));
      }
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const valuePrice = LPPrice?.multipliedBy(Number(val || 0));
  const balancePrice = LPPrice?.multipliedBy(getBalance(max, decimals));

  return (
    <Modal title={t("Unstake LP tokens")} onDismiss={onDismiss}>
      <ModalInput
        valuePrice={
          valuePrice && valuePrice.gt(0) ? valuePrice.toFormat(8) : undefined
        }
        balancePrice={
          balancePrice && balancePrice.gt(0)
            ? formatNumber(balancePrice.toString(), 12).toString()
            : undefined
        }
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t("Unstake")}
      />
      <ModalActions>
        <Button
          variant="secondary"
          onClick={onDismiss}
          width="100%"
          disabled={pendingTx}
        >
          {t("Cancel")}
        </Button>
        <Button
          disabled={
            pendingTx ||
            !valNumber.isFinite() ||
            valNumber.eq(0) ||
            valNumber.gt(fullBalanceNumber)
          }
          onClick={async () => {
            setPendingTx(true);
            await onConfirm(val, decimals);
            setPendingTx(false);
            onDismiss();
          }}
          width="100%"
        >
          {pendingTx ? t("Pending Confirmation") : t("Confirm")}
        </Button>
      </ModalActions>
    </Modal>
  );
};

export default WithdrawModal;
