import { Box, Button, darkColors, Flex, Modal } from "@bds-libs/uikit";
import { MaxUint256 } from "@ethersproject/constants";
import BigNumber from "bignumber.js";

import ModalActions from "components/ModalActions";
import { STAKING_ADDRESS } from "config/constants";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import formatDuration from "date-fns/formatDuration";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useStakingContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import { useBalance } from "hooks/useTokenBalance";
import { useGetAmount, useGetStakingNormFunc } from "hooks/useTotalSupply";
import React, { useCallback, useState } from "react";
import { getProviderOrSigner } from "utils";
import { getAddress } from "utils/addressHelpers";
import { getBep20Contract } from "utils/contractHelpers";
import { formatNumber } from "utils/formatBalance";

interface BondModalProps {
  onDismiss?: () => void;
}

const StakingModal = ({ onDismiss }: BondModalProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [loading, setLoading] = useState(false);

  const { account, library } = useActiveWeb3React();
  const balance = useBalance(createToken(tokens.sig), [account], true);
  const stakingContract = useStakingContract();
  const { toastError, toastSuccess } = useToast();
  const maxBN = balance;
  const lockingPeriod = useGetStakingNormFunc("timePeriod");

  const approved = useGetAmount(
    createToken(tokens.sig),
    "allowance",
    [account, STAKING_ADDRESS],
    true
  )?.greaterThan(0);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const sigContract = getBep20Contract(
        getAddress(tokens.sig.address),
        getProviderOrSigner(library, account)
      );
      const tx = await sigContract?.approve(STAKING_ADDRESS, MaxUint256, {
        gasLimit: 300000,
      });

      await tx.wait();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
      // @ts-ignore
      toastError("Error!", e.message);
    }
  }, []);

  function handleChangeAmountX(e: any) {
    if (!e.target.value) {
      return setAmount("0");
    }

    if (!isNaN(e.target.value)) {
      if (e.target.value.includes(".")) {
        setAmount(e.target.value);
      } else {
        setAmount((+e.target.value).toString());
      }
    }
  }

  function handleMax() {
    setAmount(maxBN.toFixed(tokens.sig.decimals));
  }

  const handleStake = async () => {
    try {
      setLoading(true);
      const tx = await stakingContract.stake(
        new BigNumber(amount)
          .multipliedBy(new BigNumber(10).pow(tokens.sig.decimals))
          .toFixed(0)
      );

      await tx.wait();
      toastSuccess("Staked Success!");
      setAmount("0");
      onDismiss?.();
    } catch (err) {
      toastError("Staked Failed!");
    } finally {
      setLoading(false);
    }
  };

  const generateActions = () => {
    if (!approved) {
      return (
        <Button
          variant="action"
          width="100%"
          disabled={requestedApproval}
          onClick={handleApprove}
        >
          {t("Approve Contract")}
        </Button>
      );
    }

    return (
      <Button
        width="100%"
        variant="action"
        onClick={handleStake}
        isLoading={loading}
        disabled={loading}
      >
        {t("Stake")}
      </Button>
    );
  };

  return (
    <Modal className="big-modal" title={t("Staking")} onDismiss={onDismiss}>
      <Flex mb="20px" color={darkColors.black}>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("You give")}
          </Box>
          <Box>{tokens.sig.symbol}</Box>
        </Box>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Vesting")}
          </Box>
          <Box>
            {formatDuration(
              { seconds: +lockingPeriod?.toString() || 0 },
              { format: ["days", "hours", "minutes", "seconds"] }
            )}
          </Box>
        </Box>
      </Flex>
      <Box
        mt="13px"
        fontWeight="700"
        fontSize="13px"
        lineHeight="22px"
        color="primaryBright"
        mb="2px"
      >
        {t("Amount")}
      </Box>
      <Box
        minHeight="55px"
        position="relative"
        borderRadius="19px"
        border="1px solid #FFAE58"
        display="flex"
        alignItems="center"
        px="20px"
        py="8px"
        color="primaryBright"
      >
        <Box
          value={amount}
          onChange={handleChangeAmountX}
          pl="18px"
          color="primaryBright"
          style={{
            outline: "none",
          }}
          as="input"
          border="none"
          bg="transparent"
          height="100%"
          flex="1"
        />
        <Box
          onClick={handleMax}
          style={{ cursor: "pointer" }}
          fontSize="14px"
          lineHeight="20px"
          color="textSubtle"
          ml="auto"
        >
          {t("Max")}
        </Box>
      </Box>
      <ModalActions>{generateActions()}</ModalActions>
      <Box mt="20px" color={darkColors.black}>
        <Flex mb="10px">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Your balance")}
          </Box>
          <Box flex="1" />
          <Box>
            {formatNumber(balance?.toFixed(4), 4)} {tokens.sig.symbol}
          </Box>
        </Flex>
        <Flex mb="10px" justifyContent="center">
          <Box textAlign="center" color="textSubtle" mb="5px">
            {t("NOTE: Your existed lock date will EXTEND")}
          </Box>
        </Flex>
      </Box>
    </Modal>
  );
};

export default StakingModal;
