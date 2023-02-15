import { Box, Button, darkColors, Flex, Modal } from "@bds-libs/uikit";
import { MaxUint256 } from "@ethersproject/constants";
import BigNumber from "bignumber.js";
import formatDuration from "date-fns/formatDuration";

import ModalActions from "components/ModalActions";
import { BOND_ADDRESS } from "config/constants";
import tokens, {
  createLpToken,
  createToken,
  getLpName,
} from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useBondContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import { useGetAmount, useGetBondAmountFunc } from "hooks/useTotalSupply";
import React, { useCallback, useState } from "react";
import { getProviderOrSigner } from "utils";
import { getBep20Contract } from "utils/contractHelpers";
import { formatNumber } from "utils/formatBalance";

interface BondModalProps {
  onDismiss?: () => void;
  discountedPrice: BigNumber;
  price: BigNumber;
  profit: BigNumber;
  data?: any;
  show?: boolean;
}

const BondModal = ({
  onDismiss,
  discountedPrice,
  price,
  profit,
  data,
}: BondModalProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [loading, setLoading] = useState(false);

  const { account, library } = useActiveWeb3React();
  const { balance } = data;
  const bondContract = useBondContract();
  const { toastError, toastSuccess } = useToast();
  const maxCanTrade = data?.maxCanTrade;
  let amountSigGet = useGetBondAmountFunc(createToken(tokens.sig), "LpToSig", [
    data?.lpToken,
    new BigNumber(amount || 1)
      .multipliedBy(new BigNumber(10).pow(18))
      .toFixed(0),
  ]);
  // @ts-ignore
  amountSigGet =
    amountSigGet &&
    new BigNumber(
      amountSigGet?.toFixed(tokens.sig.decimals) || "0"
    ).multipliedBy(profit?.toNumber() / 10000);
  // @ts-ignore
  const maxBN = balance?.gt(maxCanTrade) ? maxCanTrade : balance;

  const approved = useGetAmount(
    createLpToken(data?.lpToken),
    "allowance",
    [account, BOND_ADDRESS],
    true
  )?.greaterThan(0);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const lpContract = getBep20Contract(
        data?.lpToken,
        getProviderOrSigner(library, account)
      );
      const tx = await lpContract?.approve(BOND_ADDRESS, MaxUint256, {
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
    if (!e.target.value || isNaN(e.target.value)) {
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
    setAmount(maxBN.toFixed(18));
  }

  const handleBuyBond = async () => {
    try {
      setLoading(true);
      const tx = await bondContract.buyBond(
        new BigNumber(amount)
          .multipliedBy(new BigNumber(10).pow(18))
          .toFixed(0),
        data?.id
      );

      await tx.wait();
      toastSuccess("Bond Purchased!");
      setAmount("0");
      onDismiss?.();
    } catch (err) {
      toastError("Buy Bond Failed!");
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
        onClick={handleBuyBond}
        isLoading={loading}
        // disabled={true}
        disabled={loading}
      >
        {t("Buy bond")}
      </Button>
    );
  };

  return (
    <Box
      position="fixed"
      width="100vw"
      height="100vh"
      top="0"
      left="0"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="rgba(0,0,0, 0.6)"
    >
      <Modal className="big-modal" title={t("Buy Bond")} onDismiss={onDismiss}>
        <Flex mb="20px" color={darkColors.black}>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("Bond price")}
            </Box>
            <Box>${formatNumber(discountedPrice.toFixed(6), 6)}</Box>
          </Box>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("Market price")}
            </Box>
            <Box>${formatNumber(price.toFixed(18), 6)}</Box>
          </Box>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" fontWeight="bold">
              {t("ROI")}
            </Box>
            <Box mt="5px">{profit?.toNumber() / 100 - 100}%</Box>
          </Box>
        </Flex>
        <Flex mb="20px" color={darkColors.black}>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("You give")}
            </Box>
            <Box>{getLpName(data.lpToken)}</Box>
          </Box>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("Vesting")}
            </Box>
            <Box>
              {formatDuration(
                { seconds: data.lockingPeriod?.toNumber() || 0 },
                { format: ["days", "hours", "minutes", "seconds"] }
              )}
            </Box>
          </Box>
          <Box flex="1" textAlign="center">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("You get")}
            </Box>
            <Box>{tokens.sig.symbol}</Box>
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
            <Box>{formatNumber(balance?.toFixed(4), 4)} LP</Box>
          </Flex>
          <Flex mb="10px">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("You will get")}
            </Box>
            <Box flex="1" />
            <Box>
              {formatNumber(amountSigGet?.toFixed(4), 4)} {tokens.sig.symbol}
            </Box>
          </Flex>
          <Flex mb="10px">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("Max you can sell")}
            </Box>
            <Box flex="1" />
            <Box>{formatNumber(maxBN?.toFixed(4), 4)} LP</Box>
          </Flex>
          <Flex mb="10px">
            <Box color="textSubtle" mb="5px" fontWeight="bold">
              {t("Discount")}
            </Box>
            <Box flex="1" />
            <Box>{profit?.toNumber() / 100 - 100}%</Box>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};

export default BondModal;
