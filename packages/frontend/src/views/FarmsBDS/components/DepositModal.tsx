import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, LinkExternal } from "@bds-libs/uikit";
import ModalActions from "components/ModalActions";
import ModalInput from "components/ModalInput";
import { useTranslation } from "contexts/Localization";
import {
  formatNumber,
  getBalance,
  getFullDisplayBalance,
} from "utils/formatBalance";

interface DepositModalProps {
  LPPrice: BigNumber | undefined;
  max: BigNumber;
  onConfirm: (amount: string, decimals?: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  addLiquidityUrl?: string;
  decimals: number | undefined;
}

const DepositModal: React.FC<DepositModalProps> = ({
  LPPrice,
  decimals,
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  addLiquidityUrl,
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
    <Modal title={t("Stake LP tokens")} onDismiss={onDismiss}>
      <ModalInput
        valuePrice={
          valuePrice && valuePrice.gt(0) ? valuePrice.toFormat(8) : undefined
        }
        balancePrice={
          balancePrice && balancePrice.gt(0)
            ? formatNumber(balancePrice.toString(), 12).toString()
            : undefined
        }
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={t("Stake")}
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
          width="100%"
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
        >
          {pendingTx ? t("Pending Confirmation") : t("Confirm")}
        </Button>
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: "center" }}>
        {t("Get")} {tokenName}
      </LinkExternal>
    </Modal>
  );
};

export default DepositModal;
