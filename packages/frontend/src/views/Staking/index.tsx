import { Box, darkColors, Flex, useModal } from "@bds-libs/uikit";
import React, { useState } from "react";

import Page from "components/layout/Page";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBalance } from "hooks/useTokenBalance";
import {
  useGetDistributorFunc,
  useGetDistributorNormalFunc,
  useGetStakingNormFunc,
} from "hooks/useTotalSupply";
import { formatNumber } from "utils/formatBalance";
import StakingActionContainer from "./StakingActionContainer";
import StakingModal from "./StakingModal";
import BigNumber from "bignumber.js";
import isBefore from "date-fns/isBefore";
import format from "date-fns/format";
import { useStakingContract } from "hooks/useContract";
import useToast from "hooks/useToast";

const StakingPage = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const balance = useBalance(createToken(tokens.sig), [account], true);
  const totalDistributed = useGetDistributorFunc(
    createToken(tokens.usdt),
    "totalDistributed"
  );
  const shares = useGetDistributorNormalFunc("shares", [account], true);
  const userInfos = useGetStakingNormFunc("userInfos", [account], true);
  const [loading, setLoading] = useState(false);
  const totalEarned = shares?.totalRealised?.toString() || "0";
  const lockedAmount = userInfos?.amount?.toString() || "0";
  const [onPresentBuyModal] = useModal(<StakingModal />);
  const stakingContract = useStakingContract();
  const { toastError, toastSuccess } = useToast();
  const lockingPeriod = useGetStakingNormFunc("timePeriod");
  const releaseTime = userInfos
    ? new Date(
        (userInfos?.releaseTimeStamp?.toNumber() +
          +(lockingPeriod?.toString() || 0)) *
          1000
      )
    : null;
  const canClaim =
    userInfos && lockedAmount !== "0" && isBefore(releaseTime, new Date());

  const handleUnstake = async () => {
    try {
      setLoading(true);
      const tx = await stakingContract.claimAll();

      await tx.wait();
      toastSuccess("Unstaked Success!");
    } catch (err) {
      toastError("Unstaked Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Page>
        <Box maxWidth="800px" mx="auto" mt="-18px">
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            color={darkColors.black}
          >
            <Box
              py="32px"
              px="22px"
              backgroundPosition="right top"
              backgroundSize="initial"
              backgroundRepeat="no-repeat"
            >
              <Box
                lineHeight="30px"
                fontWeight={900}
                color="textSubtle"
                size="lg"
                mb="20px"
              >
                {t("STAKING")}
              </Box>
              <Box
                textAlign="center"
                lineHeight="30px"
                fontWeight={900}
                color="textSubtle"
                size="lg"
              >
                {t("Amount of reflection paid out to date")}
              </Box>
              <Box
                fontSize="25px"
                lineHeight="30px"
                textAlign="center"
                fontWeight={900}
                size="lg"
              >
                {tokens.usdt.symbol}{" "}
                {formatNumber(totalDistributed?.toFixed(2))}
              </Box>
              <Flex mt="20px" mb="10px">
                <Box color="textSubtle" fontWeight="bold">
                  {t("Your cummulative payout to date")}
                </Box>
                <Box flex="1" textAlign="right">
                  {formatNumber(
                    new BigNumber(totalEarned)
                      .div(new BigNumber(10).pow(tokens.usdt.decimals))
                      ?.toFixed(4),
                    4
                  )}{" "}
                  {tokens.usdt.symbol}
                </Box>
              </Flex>
              <Flex mb="10px">
                <Box color="textSubtle" fontWeight="bold">
                  {t("Your current staked amount")}
                </Box>
                <Box flex="1" textAlign="right">
                  {formatNumber(
                    new BigNumber(lockedAmount)
                      .div(new BigNumber(10).pow(tokens.sig.decimals))
                      ?.toFixed(4),
                    4
                  )}{" "}
                  {tokens.sig.symbol}
                </Box>
              </Flex>
              <Flex mb="10px">
                <Box color="textSubtle" fontWeight="bold">
                  {t("Lock in date")}
                </Box>
                <Box flex="1" textAlign="right">
                  {userInfos?.releaseTimeStamp?.toNumber()
                    ? format(releaseTime, "dd/MM/yyyy HH:mm:ss")
                    : "-"}
                </Box>
              </Flex>
              <Flex mb="10px">
                <Box color="textSubtle" fontWeight="bold">
                  {t("Your wallet balance")}
                </Box>
                <Box flex="1" textAlign="right">
                  {formatNumber(balance?.toFixed(4), 4)} {tokens.sig.symbol}
                </Box>
              </Flex>

              <StakingActionContainer
                onBuy={onPresentBuyModal}
                canClaim={canClaim && !loading}
                onList={handleUnstake}
              />
            </Box>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default StakingPage;
