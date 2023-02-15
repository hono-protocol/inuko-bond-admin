import { Box, Button, darkColors, Flex } from "@bds-libs/uikit";
import React, { useState } from "react";

import Page from "components/layout/Page";
import UnlockButton from "components/UnlockButton";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useDistributorContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import {
  useGetDistributorFunc,
  useGetDistributorNormalFunc,
} from "hooks/useTotalSupply";
import { formatNumber } from "utils/formatBalance";
import BigNumber from "bignumber.js";

const SharesPage = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const [loading, setLoading] = useState(false);
  const { toastError, toastSuccess } = useToast();
  const totalDistributed = useGetDistributorFunc(
    createToken(tokens.usdt),
    "totalDistributed"
  );
  const unpaidReward = useGetDistributorFunc(
    createToken(tokens.usdt),
    "getUnpaidEarnings",
    [account],
    {
      blocksPerFetch: 3,
    }
  );

  const shares = useGetDistributorNormalFunc("shares", [account], true);
  const distributorContract = useDistributorContract();
  const canClaim = unpaidReward?.greaterThan(0);
  const totalEarned = shares?.totalRealised?.toString() || "0";
  const yourShares = shares?.amount?.toString() || "0";

  const generateActions = () => {
    if (!account) {
      return <UnlockButton style={{ flex: 1 }} />;
    }

    return (
      <Button
        isLoading={loading}
        disabled={!canClaim || loading}
        style={{ flex: 1 }}
        variant="action"
        onClick={handleClaim}
      >
        {t("Claim")}
      </Button>
    );
  };

  const handleClaim = async () => {
    try {
      setLoading(true);
      const tx = await distributorContract.claimDividend();

      await tx.wait();
      toastSuccess("Claimed Success!");
    } catch (err) {
      toastError("Claimed Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Page>
        <Box maxWidth="600px" mx="auto" mt="-18px">
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
                {t("SHARES")}
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
              {!!account && (
                <>
                  <Flex my="10px">
                    <Box color="textSubtle" fontWeight="bold">
                      {t("Your shares")}
                    </Box>
                    <Box flex="1" textAlign="right">
                      {formatNumber(
                        new BigNumber(yourShares)
                          .div(new BigNumber(10).pow(tokens.sig.decimals))
                          ?.toFixed(4),
                        4
                      )}{" "}
                      {t("shares")}
                    </Box>
                  </Flex>
                  <Flex mb="10px">
                    <Box color="textSubtle" fontWeight="bold">
                      {t("Total earned")}
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
                      {t("Your pending reward")}
                    </Box>
                    <Box flex="1" textAlign="right">
                      {formatNumber(unpaidReward?.toFixed(4), 4)}{" "}
                      {tokens.usdt.symbol}
                    </Box>
                  </Flex>
                </>
              )}
              <Flex mt="20px">{generateActions()}</Flex>
            </Box>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default SharesPage;
