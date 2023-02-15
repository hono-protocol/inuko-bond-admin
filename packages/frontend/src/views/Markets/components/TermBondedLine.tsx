import format from "date-fns/format";
import BigNumber from "bignumber.js";
import { Button } from "@bds-libs/uikit";
import isAfter from "date-fns/isAfter";

import {
  formatNumber,
  getBalance,
  getDecimalAmount,
} from "utils/formatBalance";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBalanceOfTermBonded } from "hooks";
import { useState } from "react";
import { useTermTellerContract } from "hooks/useContract";
import useToast from "hooks/useToast";

interface TermBondedLineProps {
  id: string;
  data: any;
}

const TermBondedLine = ({ id, data }: TermBondedLineProps) => {
  const [loading, setLoading] = useState(false);
  const { account } = useActiveWeb3React();
  const { amount, meta, fetchData } = useBalanceOfTermBonded(id, account);
  const { t } = useTranslation();
  const termTellerContract = useTermTellerContract();
  const { toastError, toastSuccess } = useToast();

  const handleClaimTerm = async () => {
    try {
      setLoading(true);
      const tx = await termTellerContract.redeem(
        id,
        getDecimalAmount(amount, meta.decimals).toFixed(0)
      );
      await tx.wait();
      fetchData?.();
      toastSuccess(t("Claimed successfully!"));
    } catch (err) {
      console.log(err);
      // @ts-ignore
      toastError(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  if (
    amount.eq(0) ||
    meta?.underlying?.toLowerCase() !== data.payoutToken.address?.toLowerCase()
  ) {
    return null;
  }

  return (
    <tr>
      <td>
        {formatNumber(amount?.toNumber())} {data.payoutToken.symbol}
      </td>
      <td>{format(new Date(meta.expiry * 1000), "yyyy.MM.dd")}</td>
      <td>
        <Button
          width="100%"
          variant="action"
          onClick={handleClaimTerm}
          disabled={
            loading || isAfter(new Date(meta.expiry * 1000), new Date())
          }
        >
          {t("Claim")}
        </Button>
      </td>
    </tr>
  );
};

export default TermBondedLine;
