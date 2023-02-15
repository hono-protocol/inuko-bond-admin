import React, { useCallback } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Box,
} from "@bds-libs/uikit";
import { useLocation } from "react-router-dom";
import { useTranslation } from "contexts/Localization";
import useStake from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import {
  formatNumber,
  getBalance,
  getFullDisplayBalance,
} from "utils/formatBalance";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";
import { Address } from "../../../../config/constants/types";

interface FarmCardActionsProps {
  LPPrice?: BigNumber;
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  addLiquidityUrl?: string;
  masterChef: Address;
  decimals: number | undefined;
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`;

const StyledPlus = styled(IconButton)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  background-color: transparent;
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  LPPrice,
  decimals,
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
  masterChef,
}) => {
  const { t } = useTranslation();
  const { onStake } = useStake(pid, masterChef);
  const { onUnstake } = useUnstake(pid, masterChef);
  const location = useLocation();

  const displayBalance = useCallback(() => {
    return formatNumber(getBalance(stakedBalance, decimals).toString(), 10);
  }, [stakedBalance]);

  const [onPresentDeposit] = useModal(
    <DepositModal
      LPPrice={LPPrice}
      decimals={decimals}
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      LPPrice={LPPrice}
      decimals={decimals}
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />
  );

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button
        onClick={onPresentDeposit}
        disabled={["history", "archived"].some((item) =>
          location.pathname.includes(item)
        )}
      >
        {t("Stake")}
      </Button>
    ) : (
      <IconButtonWrapper>
        <StyledPlus variant="tertiary" onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="textSubtle" width="14px" />
        </StyledPlus>
        <StyledPlus variant="tertiary" onClick={onPresentDeposit}>
          <AddIcon color="textSubtle" width="14px" />
        </StyledPlus>
      </IconButtonWrapper>
    );
  };

  const LP = LPPrice.multipliedBy(
    getFullDisplayBalance(stakedBalance, decimals)
  );

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Box>
        <Heading
          textAlign="left"
          color={stakedBalance.eq(0) ? "textDisabled" : "text"}
        >
          {displayBalance()}
        </Heading>
        {LP.gt(0) && (
          <Box
            color="textSubtle"
            textAlign="left"
            as="p"
            fontSize="14px"
            mt="4px"
          >
            ~{LP.toFormat(8)} USDT
          </Box>
        )}
      </Box>
      {renderStakingButtons()}
    </Flex>
  );
};

export default StakeAction;
