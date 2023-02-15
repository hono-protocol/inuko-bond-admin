import { Box, Modal, Spinner } from "@bds-libs/uikit";
import React, { useEffect, useState } from "react";

import { useTranslation } from "contexts/Localization";
import { useBondContract } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import BigNumber from "bignumber.js";
import tokens from "config/constants/tokens";
import BondClaimItem from "./BondClaimItem";

interface BondListModalProps {
  onDismiss?: () => void;
}

const BondListModal = ({ onDismiss }: BondListModalProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const bondContract = useBondContract();
  const { account } = useActiveWeb3React();

  const fetchData = async () => {
    try {
      setLoading(true);
      const length = (await bondContract.CountBond(account)).toNumber();
      const listData = [];
      for (let i = 0; i < length; i++) {
        const res = await bondContract.GetBondInfo(i);
        const res2 = await bondContract.bondData(res.toNumber());
        listData.push({
          index: i,
          id: res.toNumber(),
          ...res2,
        });
      }
      setData(listData);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Modal className="big-modal" title={t("Claim Bond")} onDismiss={onDismiss}>
      {loading ? (
        <Box textAlign="center">
          <Spinner />
        </Box>
      ) : (
        data.map((o) => {
          const releaseTimeStamp = o.releaseTimeStamp?.toNumber() * 1000;
          const amountBN = new BigNumber(o.amount.toString()).div(
            new BigNumber(10).pow(tokens.sig.decimals)
          );

          return (
            <BondClaimItem
              key={o.id}
              id={o.id}
              releaseTimeStamp={releaseTimeStamp}
              amountBN={amountBN}
              callback={fetchData}
              index={o.index}
            />
          );
        })
      )}
    </Modal>
  );
};

export default BondListModal;
