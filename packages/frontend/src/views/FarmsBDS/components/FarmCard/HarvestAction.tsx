import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Button, Flex, Heading, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import { useGetApiPrices } from "state/hooks";
import CardBusdValue from "../CardBusdValue";
import { Address, Token } from "../../../../config/constants/types";
import { getAddress } from "../../../../utils/addressHelpers";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface FarmCardActionsProps {
  earnToken: Token;
  earnings?: BigNumber;
  pid?: number;
  canHarvest?: boolean;
  masterChef: Address;
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  pid,
  canHarvest,
  masterChef,
  earnToken,
}) => {
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid, masterChef);

  const prices = useGetApiPrices();

  const tokenPrice = prices[getAddress(earnToken.address).toLowerCase()];

  const rawEarningsBalance = account
    ? getBalanceNumber(earnings, earnToken.decimals)
    : 0;
  const displayBalance = rawEarningsBalance.toLocaleString();
  const earningsBusd = rawEarningsBalance
    ? new BigNumber(rawEarningsBalance).multipliedBy(tokenPrice).toNumber()
    : 0;
  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? "textDisabled" : "text"}>
        {displayBalance}
        {earningsBusd > 0 && (
          <Box display="flex">
            <CardBusdValue value={earningsBusd} />{" "}
            <Box ml="4px" fontSize="14px" color="textSubtle">
              {" "}
              USDT
            </Box>
          </Box>
        )}
      </Heading>
      <Button
        disabled={rawEarningsBalance === 0 || pendingTx || !canHarvest}
        onClick={async () => {
          setPendingTx(true);
          await onReward();
          setPendingTx(false);
        }}
      >
        {t("Harvest")}
      </Button>
    </Flex>
  );
};

export default HarvestAction;
