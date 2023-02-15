import { Box, Button, darkColors, Flex } from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { formatNumber } from "utils/formatBalance";
import { formatCountDown, useCountDown } from "hooks/countdown";
import { useTranslation } from "contexts/Localization";
import { useBondContract } from "hooks/useContract";
import useToast from "hooks/useToast";

interface BondClaimItemProps {
  id: string;
  releaseTimeStamp: number;
  amountBN: BigNumber;
  callback: () => void;
  index: number;
}

const BondClaimItem = ({
  id,
  releaseTimeStamp,
  amountBN,
  callback,
  index,
}: BondClaimItemProps) => {
  const { t } = useTranslation();
  //   const timeStamp = new Date(releaseTimeStamp);
  const countdown = useCountDown(releaseTimeStamp);
  const formattedDigitCountDown = formatCountDown(countdown);
  const [loading, setLoading] = useState(false);
  const bondContract = useBondContract();
  const { toastSuccess } = useToast();

  const handleClaim = async () => {
    try {
      setLoading(true);

      const tx = await bondContract.claim(index);
      await tx.wait();
      toastSuccess(t("Success!"), t("You have successfully claimed!"));
      callback?.();
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const formatCountdown = () => {
    const { days, hours, minutes, seconds } = formattedDigitCountDown;
    if (+days === 0 && +hours === 0 && +minutes === 0 && +seconds === 0) {
      return "Can claim NOW";
    }
    let result = "";

    if (days) {
      result += `${days}d-`;
    }

    if (hours) {
      result += `${hours}h-`;
    }

    if (minutes) {
      result += `${minutes}m-`;
    }

    if (seconds) {
      result += `${seconds}s-`;
    }

    return result.replace(/.$/, "");
  };

  return (
    <Flex key={id} mb="10px">
      <Box flex="1">
        <Box color="textSubtle" mb="5px">
          {t("Vesting Left")}
        </Box>
        <Box color={darkColors.black}>{formatCountdown()}</Box>
      </Box>
      <Box flex="1">
        <Box color="textSubtle" mb="5px">
          {t("Amount")}
        </Box>
        <Box color={darkColors.black}>
          {formatNumber(amountBN.toFixed(4), 4)} INUKO
        </Box>
      </Box>
      <Box flex="1" textAlign="right">
        <Button
          isLoading={loading}
          disabled={!countdown.isFinished || loading}
          style={{ flex: 1 }}
          variant="action"
          onClick={handleClaim}
        >
          {t("Claim")}
        </Button>
      </Box>
    </Flex>
  );
};

export default BondClaimItem;
