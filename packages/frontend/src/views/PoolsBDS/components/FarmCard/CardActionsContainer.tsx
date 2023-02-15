import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { provider as ProviderType } from "web3-core";
import BigNumber from "bignumber.js";
import { useLocation } from "react-router-dom";
import { getAddress } from "utils/addressHelpers";
import { getBep20Contract } from "utils/contractHelpers";
import { Button, Flex, Text } from "@bds-libs/uikit";
import { Farm } from "state/types";
import { useTranslation } from "contexts/Localization";
import { useApprove } from "hooks/useApprove";
import UnlockButton from "components/UnlockButton";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";
import { useGetApiPrices } from "state/hooks";
import { getProviderOrSigner } from "../../../../utils";
import useActiveWeb3React from "../../../../hooks/useActiveWeb3React";
import useToast from "hooks/useToast";

const Action = styled.div`
  padding-top: 16px;
`;
export interface FarmWithStakedValue extends Farm {
  apr?: number;
  quoteTokenToMultiplyQuoteTokenPrice?: string;
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  provider?: ProviderType;
  account?: string;
  addLiquidityUrl?: string;
  disableHarvest?: boolean;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  account,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { pid, lpAddresses } = farm;
  const {
    allowance: allowanceAsString = 0,
    tokenBalance: tokenBalanceAsString = 0,
    stakedBalance: stakedBalanceAsString = 0,
    earnings: earningsAsString = 0,
    canHarvest,
  } = farm.userData || {};
  const allowance = new BigNumber(allowanceAsString);
  const tokenBalance = new BigNumber(tokenBalanceAsString);
  const stakedBalance = new BigNumber(stakedBalanceAsString);
  const earnings = new BigNumber(earningsAsString);
  const lpAddress = getAddress(lpAddresses);
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const { library } = useActiveWeb3React();
  const { toastError } = useToast();

  const location = useLocation();
  const prices = useGetApiPrices();
  const lpTokenPrice =
    new BigNumber(farm.quoteTokenToMultiplyQuoteTokenPrice)?.times(
      prices[getAddress(farm.quoteToken.address).toLowerCase()]
    ) || new BigNumber(0);

  const lpContract = getBep20Contract(
    lpAddress,
    getProviderOrSigner(library, account)
  );

  const { onApprove } = useApprove(lpContract, farm.masterChefContract);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
      // @ts-ignore
      toastError("Error!", e.message);
    }
  }, [onApprove]);

  const decimals = React.useMemo(() => {
    return getAddress(farm.token.address).toLowerCase() ===
      getAddress(farm.quoteToken.address).toLowerCase()
      ? farm.token.decimals
      : undefined;
  }, [farm]);

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        LPPrice={lpTokenPrice}
        decimals={decimals}
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
        masterChef={farm.masterChefContract}
      />
    ) : (
      <Button
        variant="action"
        mt="8px"
        width="100%"
        disabled={requestedApproval || location.pathname.includes("archived")}
        onClick={handleApprove}
      >
        {t("Approve Contract")}
      </Button>
    );
  };

  return (
    <Action>
      <Flex>
        <Text
          fontWeight={900}
          textTransform="uppercase"
          color="textSubtle"
          fontSize="16px"
          pr="3px"
        >
          {farm.earnToken.symbol || "BDS"}
        </Text>
        <Text
          fontWeight={900}
          textTransform="uppercase"
          color="textSubtle"
          fontSize="16px"
        >
          {t("Earned")}
        </Text>
      </Flex>
      <HarvestAction
        earnToken={farm.earnToken}
        earnings={earnings}
        pid={pid}
        canHarvest={canHarvest}
        masterChef={farm.masterChefContract}
      />
      <Flex>
        <Text
          bold
          textTransform="uppercase"
          color="primaryBright"
          fontSize="16px"
          pr="3px"
        >
          {lpName}
        </Text>
        <Text bold color="primaryBright" fontSize="16px">
          {t("Staked")}
        </Text>
      </Flex>
      {!account ? (
        <UnlockButton mt="8px" width="100%" />
      ) : (
        renderApprovalOrStakeButton()
      )}
    </Action>
  );
};

export default CardActions;
