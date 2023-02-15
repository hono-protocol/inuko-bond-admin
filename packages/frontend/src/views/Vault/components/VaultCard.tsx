import styled from "styled-components";
import {
  Flex,
  useTooltip,
  Box,
  Button,
  IconButton,
  MinusIcon,
  AddIcon,
  Skeleton,
  useModal,
  AutoIcon,
  WarnIcon,
} from "@bds-libs/uikit";
import { useTranslation } from "../../../contexts/Localization";
import React, { useCallback, useState } from "react";
import CardHeading from "../components/FarmCard/CardHeading";
import ExpandableSectionButton from "../../../components/ExpandableSectionButton";
import ExpandedFooter from "../components/FarmCard/CardFooter";
import DepositModal from "../components/DepositModal";
import WithdrawModal from "../components/WithdrawModal";
import { BASE_ADD_LIQUIDITY_URL, BASE_SWAP_URL } from "../../../config";
import { fetchVaultUserDataAsync, Vault } from "../../../state/vaults";
import UnlockButton from "../../../components/UnlockButton";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import { getBep20Contract } from "../../../utils/contractHelpers";
import { getProviderOrSigner } from "../../../utils";
import { useApprove } from "../../../hooks/useApprove";
import { getAddress } from "../../../utils/addressHelpers";
import BigNumber from "bignumber.js";
import { formatNumber } from "../../../utils/formatBalance";
import { useContract } from "../../../hooks/useContract";
import VaultABI from "../../../config/abi/vault.json";
import { fetchFarmUserDataAsync } from "../../../state/farms";
import useToast from "../../../hooks/useToast";
import { useDispatch } from "react-redux";
import { useGetApiPrices } from "../../../state/hooks";
import { getFarmApr } from "../../../utils/apr";
import ApyButton from "../../FarmsBDS/components/FarmCard/ApyButton";
import { useLPPrice } from "../../../usePrice";

const FCard = styled.div`
  align-self: baseline;
  background: #052e22;
  border-radius: 16px;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1),
    0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  text-align: center;
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface VaultCardProps {
  farm: Vault;
  userDataLoaded: boolean;
  isSingle?: boolean;
  earnPerDay: string;
  depositFee: string;
  totalValue: string;
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`;

const StyledApy = styled(ApyButton)`
  color: ${({ theme }) => theme.colors.textSubtle};

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const StyledUnlock = styled(UnlockButton)`
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.secondary};
`;

const StyledPlus = styled(IconButton)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.secondary};
  background-color: transparent;
`;

const StyledExpandableSectionButton = styled(ExpandableSectionButton)`
  & > * {
    color: ${({ theme }) => theme.colors.secondary};
  }

  & svg {
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;

export default function VaultCard(props: VaultCardProps) {
  const { t } = useTranslation();
  const prices = useGetApiPrices();
  const { account, library } = useActiveWeb3React();
  const { toastError } = useToast();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const dispatch = useDispatch();
  const { farm, userDataLoaded } = props;

  const autoTooltipText = t(
    "Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you."
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(autoTooltipText, {
    placement: "right-end",
  });

  const isSingle = farm.isSingle;

  const { price: priceCallLP } = useLPPrice(getAddress(farm.token.address));

  const LPPrice = React.useMemo(() => {
    if (!isSingle) {
      return priceCallLP;
    }

    return new BigNumber(
      prices[getAddress(farm.token.address).toLowerCase()] || 0
    );
  }, [farm, prices, isSingle]);

  const earnPrice = React.useMemo(() => {
    return new BigNumber(
      prices[getAddress(farm.earnToken.address).toLowerCase()] || 0
    );
  }, [farm, prices]);

  const quoteTokenPriceUsd = React.useMemo(() => {
    return new BigNumber(
      prices[getAddress(farm.quoteToken.address).toLowerCase()] || 0
    );
  }, [farm, prices]);

  const totalLiquidityPool = React.useMemo(() => {
    return new BigNumber(farm.lpTotalInQuoteToken || 0).times(
      quoteTokenPriceUsd
    );
  }, [farm, quoteTokenPriceUsd]);

  const totalValue = React.useMemo(() => {
    return new BigNumber(farm.tvl || 0).div(
      new BigNumber(10).pow(farm.token.decimals)
    );
  }, [farm]);

  const totalValuePrice = React.useMemo(() => {
    return new BigNumber(totalValue).multipliedBy(LPPrice);
  }, [totalValue, LPPrice]);

  const vaultContract = useContract(
    getAddress(farm.vaultAddress),
    VaultABI,
    true
  );

  const apr = React.useMemo(() => {
    if (!farm.perBlock) return 0;
    return getFarmApr(
      new BigNumber(farm.poolWeight || 0),
      earnPrice,
      totalLiquidityPool,
      farm.perBlock
    );
  }, [earnPrice, totalLiquidityPool, farm]);

  const earnLabel = farm.earnToken.symbol || "BDS";

  const { allowance: allowanceAsString = 0 } = farm.userData || {};

  const allowance = new BigNumber(allowanceAsString);

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const staked = React.useMemo(() => {
    return new BigNumber(farm.userData.sharesBalance)
      .multipliedBy(new BigNumber(farm.pricePerFullShare))
      .div(new BigNumber(10).pow(farm.token.decimals)); // use BDS decimals
  }, [farm]);

  const stakedPrice = React.useMemo(() => {
    return new BigNumber(staked).multipliedBy(LPPrice);
  }, [totalValue, LPPrice]);

  const tokenBalance = React.useMemo(() => {
    return new BigNumber(farm.userData.tokenBalance);
  }, [farm]);

  const [showExpandableSection, setShowExpandableSection] = useState(false);

  const lpLabel = farm.lpSymbol
    ? farm.lpSymbol.toUpperCase().replace("PANCAKE", "")
    : farm.token.symbol;

  const vaultAddress = farm.vaultAddress[process.env.REACT_APP_CHAIN_ID];

  let addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${getAddress(
    farm.token.address
  )}`;

  if (isSingle) {
    addLiquidityUrl = `${BASE_SWAP_URL}?outputCurrency=${getAddress(
      farm.token.address
    )}`;
  }

  const tokenContract = getBep20Contract(
    getAddress(farm.token.address),
    getProviderOrSigner(library, account)
  );

  const { onApprove } = useApprove(tokenContract, farm.vaultAddress);

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

  const handleConfirm = async (amount: string, decimals?: number) => {
    try {
      const testInput = new BigNumber(amount).multipliedBy(
        new BigNumber("10").pow(decimals || 18).toString()
      );
      const tx = await vaultContract.deposit(testInput.toString());
      await tx.wait();
      dispatch(fetchVaultUserDataAsync(account));
    } catch (e) {
      toastError("Failed stake", "");
      console.error(e);
    }
  };

  const handleWidthDraw = async (amount: string) => {
    try {
      const isWithdrawAll =
        formatNumber(staked.toString(), 12) ===
        formatNumber(new BigNumber(amount).toString(), 12);
      let tx;

      if (isWithdrawAll) {
        tx = await vaultContract.withdrawAll();
      } else {
        const testInput = new BigNumber(amount)
          .multipliedBy(new BigNumber(10).pow(farm.token.decimals))
          .multipliedBy(new BigNumber(10).pow(18))
          .div(new BigNumber(farm.pricePerFullShare));

        tx = await vaultContract.withdraw(testInput.toFixed(0));
      }
      await tx.wait();
      dispatch(fetchVaultUserDataAsync(account));
    } catch (e) {
      toastError("Failed withdraw", "");
      console.error(e);
    }
  };

  const [onPresentDeposit] = useModal(
    <DepositModal
      LPPrice={LPPrice}
      decimals={farm.token.decimals}
      max={tokenBalance}
      onConfirm={handleConfirm}
      tokenName={farm.token.symbol}
    />
  );

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      LPPrice={LPPrice}
      decimals={0}
      max={staked}
      onConfirm={handleWidthDraw}
      tokenName={farm.token.symbol}
    />
  );

  const renderStakingButtons = () => {
    return staked.eq(0) ? (
      <Button onClick={onPresentDeposit}>{t("Stake")}</Button>
    ) : (
      <IconButtonWrapper>
        <StyledPlus onClick={onPresentWithdraw} mr="6px">
          <MinusIcon color="secondary" width="14px" />
        </StyledPlus>
        <StyledPlus onClick={onPresentDeposit}>
          <AddIcon color="secondary" width="14px" />
        </StyledPlus>
      </IconButtonWrapper>
    );
  };

  return (
    <FCard>
      <CardHeading
        multiplier={farm.multiplier}
        lpLabel={farm.token.symbol}
        tokenSymbol={farm.token.symbol}
        quoteToken={farm.quoteToken}
        token={farm.token}
        lpToken={farm.lpToken}
      />
      <Box padding="18px">
        <Flex justifyContent="space-between">
          <Box
            fontWeight="bold"
            fontSize="17px"
            lineHeight="24px"
            color="textSubtle"
          >
            APY
          </Box>
          <Box
            display="flex"
            alignItems="center"
            fontWeight="bold"
            fontSize="17px"
            lineHeight="24px"
            color="textSubtle"
          >
            <StyledApy
              mode="apy"
              earnToken={farm.earnToken}
              lpLabel={lpLabel}
              addLiquidityUrl={addLiquidityUrl}
              earnPrice={earnPrice.toNumber()}
              apr={apr}
            />
            {(
              (Math.pow(1 + apr / 100 / (365 * 24 * 12), 365 * 24 * 12) - 1) *
              100
            ).toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
            %
          </Box>
        </Flex>
        <Flex justifyContent="space-between">
          <Box
            fontWeight="400"
            fontSize="17px"
            lineHeight="24px"
            color="primaryBright"
          >
            {t("Earn")}:
          </Box>
          <Box
            fontWeight="900"
            fontSize="17px"
            lineHeight="24px"
            color="primaryBright"
          >
            {farm.earnToken.symbol}
          </Box>
        </Flex>
        <Flex mt="4px" justifyContent="space-between">
          <Box
            fontWeight="400"
            fontSize="17px"
            lineHeight="24px"
            color="primaryBright"
          >
            {t("Withdraw Fee")}:
          </Box>
          <Box
            fontWeight="900"
            fontSize="14px"
            lineHeight="24px"
            color="primaryBright"
          >
            {farm.withdrawFee}
          </Box>
        </Flex>
        <Box
          mt="4px"
          color="primaryBright"
          fontSize="12px"
          lineHeight="24px"
          textAlign="left"
        >
          {t("The fee will be used to buy and burn BDS token")}.
        </Box>
        {!account && (
          <Box mt="8px">
            <Box
              textAlign="left"
              color="textSubtle"
              fontSize="14px"
              fontWeight={900}
              lineHeight="24px"
              mb="7px"
            >
              {t("START EARNING")}
            </Box>
            <StyledUnlock width="100%" />
          </Box>
        )}{" "}
        {account && userDataLoaded && (
          <Box mt="12px">
            {account && !isApproved && (
              <Box>
                <Button
                  mt="8px"
                  width="100%"
                  disabled={requestedApproval}
                  onClick={handleApprove}
                >
                  {t("Approve Contract")}
                </Button>
              </Box>
            )}
            {account && isApproved && (
              <Box>
                <Flex>
                  <Box
                    fontWeight={900}
                    style={{
                      textTransform: "uppercase",
                    }}
                    color="textSubtle"
                    fontSize="14px"
                    lineHeight="24px"
                  >
                    {lpLabel} {t("Staked")} ({t("Compounding")})
                  </Box>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Box
                      fontSize="16px"
                      lineHeight="24px"
                      fontWeight="900"
                      textAlign="left"
                      color={staked.eq(0) ? "textDisabled" : "text"}
                    >
                      {formatNumber(staked.toString(), 7)}
                    </Box>
                    <Box
                      fontSize="12px"
                      lineHeight="24px"
                      textAlign="left"
                      color="textSubtle"
                    >
                      ~{formatNumber(stakedPrice.toString(), 7)} USDT
                    </Box>
                  </Box>
                  {renderStakingButtons()}
                </Flex>
              </Box>
            )}
          </Box>
        )}
        {account && !userDataLoaded && <Skeleton height={100} width="100%" />}
        <Box my="18px" border="1px solid #9BCABB" />
        <Box mt="25px" display="flex" alignItems="center">
          <Box display="flex" alignItems="center">
            <Box
              py="4px"
              px="12px"
              borderRadius="14px"
              border="1px solid"
              borderColor="secondary"
              color="secondary"
              display="flex"
              alignItems="center"
              mr="7px"
            >
              <Box mr="14px">
                <AutoIcon color="secondary" />
              </Box>
              {t("Auto")}
            </Box>
            <div ref={targetRef}>
              {tooltipVisible && <Box textAlign="left">{tooltip}</Box>}
              <WarnIcon color="secondary" />
            </div>
          </Box>
          <Box ml="auto">
            <StyledExpandableSectionButton
              onClick={() => setShowExpandableSection(!showExpandableSection)}
              expanded={showExpandableSection}
            />
          </Box>
        </Box>
        <Box pt="12px">
          <ExpandingWrapper expanded={showExpandableSection}>
            <Box>
              <ExpandedFooter
                lpLabel={lpLabel}
                addLiquidityUrl={addLiquidityUrl}
                performanceFee={farm.performanceFee}
                stakingTokenSymbol={farm.token.symbol}
                totalValue={
                  isSingle
                    ? `${formatNumber(totalValue.toString(), 7).toString()} ${
                        farm.token.symbol
                      }`
                    : `${formatNumber(
                        totalValuePrice.toString(),
                        7
                      ).toString()} USDT`
                }
                projectLink={farm.token.projectLink}
                contractAddress={vaultAddress}
              />
            </Box>
          </ExpandingWrapper>
        </Box>
      </Box>
    </FCard>
  );
}
