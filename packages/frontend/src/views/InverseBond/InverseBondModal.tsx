import { Box, Button, darkColors, Flex, Modal } from "@bds-libs/uikit";
import { MaxUint256 } from "@ethersproject/constants";
import BigNumber from "bignumber.js";
import ModalActions from "components/ModalActions";
import { INVERSE_BOND_ADDRESS } from "config/constants";
import tokens, { createToken } from "config/constants/tokens";
import { useTranslation } from "contexts/Localization";
import formatDuration from "date-fns/formatDuration";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { useInverseBondContract } from "hooks/useContract";
import useToast from "hooks/useToast";
import { useBalance } from "hooks/useTokenBalance";
import {
  useGetAmount,
  useGetInverseBondAmountFunc,
  useGetInverseBondFunc,
} from "hooks/useTotalSupply";
import React, { useCallback, useState } from "react";
import { getProviderOrSigner } from "utils";
import { getAddress } from "utils/addressHelpers";
import { getBep20Contract } from "utils/contractHelpers";
import { formatNumber } from "utils/formatBalance";

interface BondModalProps {
  onDismiss?: () => void;
  discountedPrice: BigNumber;
  price: BigNumber;
  profit: BigNumber;
}

const InverseBondModal = ({
  onDismiss,
  discountedPrice,
  price,
  profit,
}: BondModalProps) => {
  const { t } = useTranslation();
  const [amount, setAmount] = React.useState("0");
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [loading, setLoading] = useState(false);
  const lockingPeriod = useGetInverseBondFunc("timePeriod");

  const { account, library } = useActiveWeb3React();
  const balance = useBalance(createToken(tokens.sig), [account], true);
  const bondContract = useInverseBondContract();
  const { toastError, toastSuccess } = useToast();
  const maxCanTrade = useGetInverseBondAmountFunc(
    createToken(tokens.sig),
    "maxCanTrade"
  );
  const amountSigGet = useGetInverseBondAmountFunc(
    createToken(tokens.usdt),
    "getCurrentPrice",
    [
      new BigNumber(amount)
        .multipliedBy(new BigNumber(10).pow(tokens.sig.decimals))
        .toFixed(0),
    ]
  );
  const maxBN = balance?.greaterThan(maxCanTrade) ? maxCanTrade : balance;

  const approved = useGetAmount(
    createToken(tokens.sig),
    "allowance",
    [account, INVERSE_BOND_ADDRESS],
    true
  )?.greaterThan(0);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const lpContract = getBep20Contract(
        getAddress(tokens.sig.address),
        getProviderOrSigner(library, account)
      );
      const tx = await lpContract?.approve(INVERSE_BOND_ADDRESS, MaxUint256, {
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
    setAmount(maxBN?.toFixed(tokens.sig.decimals));
  }

  const handleBuyBond = async () => {
    try {
      setLoading(true);
      const tx = await bondContract.sellBond(
        new BigNumber(amount)
          .multipliedBy(new BigNumber(10).pow(tokens.sig.decimals))
          .toFixed(0)
      );

      await tx.wait();
      toastSuccess("Inverse Bond Purchased!");
      setAmount("0");
      onDismiss?.();
    } catch (err) {
      toastError("Buy Inverse Bond Failed!");
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
        disabled={loading}
      >
        {t("Buy inverse bond")}
      </Button>
    );
  };

  return (
    <Modal
      className="big-modal"
      title={t("Buy Inverse Bond")}
      onDismiss={onDismiss}
    >
      <Flex mb="20px" color={darkColors.black}>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Bond price")}
          </Box>
          <Box>${formatNumber(discountedPrice.toFixed(4), 4)}</Box>
        </Box>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Market price")}
          </Box>
          <Box>${formatNumber(price.toFixed(18), 4)}</Box>
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
          <Box>{tokens.sig.symbol}</Box>
        </Box>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Vesting")}
          </Box>
          <Box>
            {formatDuration(
              { seconds: lockingPeriod?.toNumber() || 0 },
              { format: ["days", "hours", "minutes", "seconds"] }
            )}
          </Box>
        </Box>
        <Box flex="1" textAlign="center">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("You get")}
          </Box>
          <Box>{tokens.usdt.symbol}</Box>
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
        <Flex mb="10px">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("You will get")}
          </Box>
          <Box flex="1" />
          <Box>
            {formatNumber(amountSigGet?.toFixed(4), 4)} {tokens.usdt.symbol}
          </Box>
        </Flex>
        <Flex mb="10px">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Max you can sell")}
          </Box>
          <Box flex="1" />
          <Box>
            {formatNumber(maxBN?.toFixed(4), 4)} {tokens.sig.symbol}
          </Box>
        </Flex>
        <Flex mb="10px">
          <Box color="textSubtle" mb="5px" fontWeight="bold">
            {t("Premium")}
          </Box>
          <Box flex="1" />
          <Box>{profit?.toNumber() / 100 - 100}%</Box>
        </Flex>
      </Box>
    </Modal>
  );
};

export default InverseBondModal;
