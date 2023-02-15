import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Grid,
  InjectedModalProps,
  Button,
  WarnIcon,
  useModal,
} from "@bds-libs/uikit";
import { useTranslation } from "../../../contexts/Localization";
import { isAddress } from "../../../utils";
import Select from "react-select";
import {
  useAssetTokens,
  useAssetTokensSingle,
} from "../../../state/assets/hooks";
import { TokenWallet } from "../Assets";
import { CurrencyLogo } from "../../../components/Logo";
import { getAddress } from "../../../utils/addressHelpers";
import { formatNumber } from "../../../utils/formatBalance";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "../../../hooks/useActiveWeb3React";
import { Contract } from "ethers";
import { ERC20_ABI } from "../../../config/abi/erc20";
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units";
import { formatEther, hexlify } from "ethers/lib/utils";
import useRefresh from "../../../hooks/useRefresh";
import useToast from "../../../hooks/useToast";
import ModalConfirm from "./ModalConfirm";
import { useEffect } from "react";
import { Currency } from "@pancakeswap/sdk";

export interface ModalAddressProps extends InjectedModalProps {
  account: string;
  etherBalance: BigNumber;
  etherPrice: number;
  listToken: TokenWallet[];
  getAssets: () => void;
}

const IconSuccess = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#177358" />
      <path
        d="M9.05868 12.0644L13.1859 6.66151C13.4399 6.32902 13.9153 6.26538 14.2478 6.51936C14.5803 6.77335 14.644 7.24878 14.39 7.58127L9.76033 13.6419C9.49034 13.9953 8.97537 14.0412 8.64712 13.7411L5.70098 11.0475C5.39219 10.7652 5.37074 10.286 5.65306 9.97721C5.93538 9.66842 6.41457 9.64696 6.72336 9.92928L9.05868 12.0644Z"
        fill="white"
      />
    </svg>
  );
};
const IconClear = () => {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.93231 6.5L12.7932 1.63895C12.9269 1.50514 13.0006 1.32661 13.0008 1.13625C13.0008 0.945785 12.9271 0.76705 12.7932 0.633448L12.3672 0.207591C12.2333 0.0734601 12.0547 0 11.8642 0C11.6739 0 11.4954 0.0734601 11.3615 0.207591L6.50063 5.06832L1.63959 0.207591C1.50588 0.0734601 1.32725 0 1.13678 0C0.946525 0 0.767896 0.0734601 0.634188 0.207591L0.208014 0.633448C-0.0693378 0.910799 -0.0693378 1.36192 0.208014 1.63895L5.06896 6.5L0.208014 11.3608C0.0742 11.4949 0.00052849 11.6734 0.00052849 11.8637C0.00052849 12.0541 0.0742 12.2326 0.208014 12.3666L0.634082 12.7924C0.76779 12.9264 0.946525 13 1.13668 13C1.32714 13 1.50577 12.9264 1.63948 12.7924L6.50053 7.93157L11.3614 12.7924C11.4953 12.9264 11.6738 13 11.8641 13H11.8643C12.0546 13 12.2332 12.9264 12.3671 12.7924L12.793 12.3666C12.9268 12.2327 13.0005 12.0541 13.0005 11.8637C13.0005 11.6734 12.9268 11.4949 12.793 11.3609L7.93231 6.5Z"
        fill="#9BCABB"
      />
    </svg>
  );
};

const IconAccount = () => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="15" cy="15" r="15" fill="#177358" />
      <path
        d="M22.5333 22.2002C22.1999 22.2002 21.8666 21.9336 21.8666 21.5336V19.6002C21.8666 18.7336 21.5333 17.9336 20.9333 17.3336C20.3333 16.7336 19.5333 16.4002 18.6666 16.4002H11.8666C10.9999 16.4002 10.1999 16.7336 9.59992 17.3336C8.99992 17.9336 8.66659 18.7336 8.66659 19.6002V21.5336C8.66659 21.8669 8.39992 22.2002 7.99992 22.2002C7.59992 22.2002 7.33325 21.9336 7.33325 21.5336V19.6002C7.33325 18.4002 7.79992 17.2669 8.66659 16.4002C9.53325 15.5336 10.6666 15.0669 11.8666 15.0669H18.6666C19.8666 15.0669 20.9999 15.5336 21.8666 16.4002C22.7333 17.2669 23.1999 18.4002 23.1999 19.6002V21.5336C23.1333 21.9336 22.8666 22.2002 22.5333 22.2002Z"
        fill="white"
      />
      <path
        d="M15.2667 13.7337C12.8001 13.7337 10.7334 11.7337 10.7334 9.20033C10.7334 6.73366 12.7334 4.66699 15.2667 4.66699C17.7334 4.66699 19.8001 6.66699 19.8001 9.20033C19.8001 11.7337 17.7334 13.7337 15.2667 13.7337ZM15.2667 6.00033C13.4667 6.00033 12.0667 7.46699 12.0667 9.20033C12.0667 10.9337 13.4667 12.467 15.2667 12.467C17.0667 12.467 18.4667 11.0003 18.4667 9.26699C18.4667 7.53366 17.0667 6.00033 15.2667 6.00033Z"
        fill="white"
      />
    </svg>
  );
};

const ArrowB = (props: { w?: string; color?: string }) => {
  return (
    <svg
      width={props.w || "24px"}
      height="auto"
      viewBox="0 0 24 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.274969 5.14889C0.275249 5.14861 0.275484 5.14828 0.275812 5.148L5.17444 0.272997C5.54142 -0.0922062 6.135 -0.0908471 6.5003 0.276184C6.86555 0.643168 6.86414 1.23675 6.49716 1.602L3.20822 4.875H23.0625C23.5803 4.875 24 5.29471 24 5.8125C24 6.33028 23.5803 6.75 23.0625 6.75H3.20827L6.49711 10.023C6.86409 10.3882 6.8655 10.9818 6.50025 11.3488C6.13495 11.7159 5.54133 11.7172 5.17439 11.352L0.275764 6.477C0.275484 6.47671 0.275249 6.47639 0.274921 6.47611C-0.0922508 6.10964 -0.0910778 5.51414 0.274969 5.14889Z"
        fill={props.color || "#9BCABB"}
      />
    </svg>
  );
};

function ModalSend(props: ModalAddressProps) {
  const { etherBalance, onDismiss, listToken, etherPrice, getAssets } = props;
  const [step, setStep] = React.useState(0);
  const { toastSuccess, toastError } = useToast();
  const { library, account: accountCurrent } = useActiveWeb3React();

  const assetsTokens = useAssetTokens();
  const options = React.useMemo(() => {
    return listToken.map((l) => {
      const address = l.token?.address ? getAddress(l.token?.address) : "";
      return {
        ...l,
        asset: {
          ...assetsTokens[address],
        },
        value: l.token?.address || "ether",
      };
    });
  }, [assetsTokens, listToken]);
  const { fastRefresh } = useRefresh();
  const { t } = useTranslation();

  const [recipient, setRecipient] = React.useState("");
  const [lastTx, setLastTx] = React.useState<any>();

  const [amount, setAmount] = React.useState("");

  const [isCorrectAddress, setIsAddress] = React.useState(false);
  const [isConfirming, setIsConfirming] = React.useState(false);

  const [estGas, setEstGas] = React.useState("0");

  const [token, setToken] = useState<any>(options[0]);

  function handleChange(e: any) {
    setRecipient(e.target.value);
  }

  function handleChangeAmountX(e: any) {
    setAmount(e.target.value);
  }

  function handleMax() {
    const address = token.token?.address
      ? getAddress(token.token?.address)
      : "";
    const asset = assetsTokens[address];
    setAmount(
      (token.isEther ? formatEther(etherBalance.toString()) : asset?.balance) ||
        "0"
    );
  }
  const asset = token.token
    ? assetsTokens[getAddress(token.token?.address) || ""]
    : undefined;

  const selectedBalance = asset
    ? asset.balance
    : formatEther(etherBalance.toString());

  let logo = "";

  const address = token.token?.address ? getAddress(token.token?.address) : "";

  const bl = useAssetTokensSingle(address);

  if (token.token) {
    logo = `images/tokens/${address}.png`;
  }

  const validAmount =
    !isNaN(Number(amount)) &&
    new BigNumber(amount).gt(0) &&
    new BigNumber(amount).lte(selectedBalance);

  const [openModalConfirm] = useModal(
    <ModalConfirm
      tx={lastTx}
      amount={amount}
      gas={estGas}
      account={accountCurrent}
      recipient={recipient}
      symbol={token.token?.symbol || "BNB"}
      total={
        !token.isEther
          ? formatNumber(
              bl
                ? new BigNumber(amount)
                    .multipliedBy(bl.price)
                    .plus(new BigNumber(estGas).multipliedBy(etherPrice))
                    .toString()
                : 0,
              9
            )
          : formatNumber(
              Number(formatEther(etherBalance.toString())) * etherPrice,
              5
            )
      }
    />
  );

  useEffect(() => {
    if (lastTx) {
      openModalConfirm();
    }
  }, [lastTx]);

  async function handleConfirm() {
    setLastTx(undefined);
    try {
      setIsConfirming(true);
      if (!token.isEther) {
        const signer = library.getSigner(accountCurrent);
        const tokenContract = new Contract(
          getAddress(token.token.address),
          ERC20_ABI,
          signer
        );

        const estGas = await tokenContract.estimateGas.transfer(
          recipient,
          parseUnits(amount, token.token.decimals)
        );

        // console.log(formatUnits(estGas, "gwei"))
        // console.log(parseUnits("10", "gwei").toString());
        const tx = await tokenContract.transfer(
          recipient,
          parseUnits(amount, token.token.decimals),
          {
            // gasPrice: parseUnits("10", "gwei"),
            ///gasLimit: calculateGasMargin(estGas),
          }
        );
        await tx.wait();

        setStep(0);
        getAssets();
        toastSuccess(
          t("Success!"),
          t("You have successfully transfer the token..")
        );
        setLastTx(tx);
      } else {
        const signer = library.getSigner(accountCurrent);
        const tx = await signer.sendTransaction({
          from: accountCurrent,
          to: recipient,
          value: parseEther(amount),
          // gasLimit: hexlify(100000), // 100000
          // gasPrice: gasPrice,
        });
        await tx.wait();
        setStep(0);
        getAssets();
        toastSuccess(
          t("Success!"),
          t("You have successfully transfer the token..")
        );
        setLastTx(tx);
      }
    } catch (e) {
      console.error(e);
      toastError(
        t("Error!"),
        // @ts-ignore
        e.message
      );
    } finally {
      setIsConfirming(false);
    }
  }

  React.useEffect(() => {
    setIsAddress(Boolean(isAddress(recipient)));
  }, [recipient]);

  React.useEffect(() => {
    if (step === 1 && accountCurrent && library) {
      const signer = library.getSigner(accountCurrent);

      if (!token.isEther) {
        const tokenContract = new Contract(
          getAddress(token.token.address),
          ERC20_ABI,
          signer
        );

        tokenContract.estimateGas
          .transfer(recipient, parseUnits(amount, token.token.decimals))
          .then((s) => {
            setEstGas(
              new BigNumber(formatUnits(s.toString(), "gwei").toString())
                .multipliedBy(5)
                .toString()
            );
          });
      }

      if (token.isEther) {
        signer
          .estimateGas({
            to: recipient,
            value: parseEther(amount),
          })
          .then((s) => {
            setEstGas(
              new BigNumber(formatUnits(s.toString(), "gwei").toString())
                .multipliedBy(5)
                .toString()
            );
          });
      }
    }
  }, [step, library, accountCurrent, token, fastRefresh]);

  const selectStyles = useMemo(
    () => ({
      container: (styles: any) => ({
        ...styles,
        width: "100%",
        backgroundColor: "transparent",
      }),
      valueContainer: (styles: any) => ({
        ...styles,
        padding: "8px",
      }),
      control: (styles: any) => ({
        ...styles,
        border: "1px solid #FFAE58",
        borderRadius: "20px",
        backgroundColor: "transparent",
        paddingTop: "8px",
        paddingBottom: "8px",
      }),
      dropdownIndicator: (styles: any) => ({
        ...styles,
        color: "#FFAE58",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      menuList: (styles: any) => ({ ...styles, zIndex: "100" }),
      menu: (styles: any) => ({
        ...styles,
        zIndex: "100",
        backgroundColor: "#0A4635",
        border: "1px solid #FFAE58",
        borderRadius: "19px",
        padding: "8px",
      }),
      option: (styles: any) => ({ ...styles, backgroundColor: "transparent" }),
    }),
    []
  );

  const formatOptionLabel = useCallback(
    (
      option: TokenWallet & {
        asset: {
          balance: string;
        };
      }
    ) => {
      let logo = "";
      const address = option.token?.address
        ? getAddress(option.token?.address)
        : "";
      if (option.token) {
        logo = `images/tokens/${address}.png`;
      }

      const asset = assetsTokens[address];

      return (
        <Box>
          <Box py="8px" px="16px" display="flex" alignItems="center">
            {!option.lp && (
              <CurrencyLogo
                size="32px"
                logo={logo}
                currency={option.isEther ? Currency.ETHER : option.token}
              />
            )}
            {option.lp && (
              <Box position="relative" display="flex">
                <CurrencyLogo
                  style={{
                    zIndex: 2,
                    position: "relative",
                  }}
                  size="32px"
                  currency={option.lp.token0}
                />
                <CurrencyLogo
                  style={{
                    zIndex: 1,
                    position: "relative",
                    left: "-10px",
                  }}
                  size="32px"
                  currency={option.lp.token1}
                />
              </Box>
            )}
            <Box ml="16px">
              <Box
                fontWeight="700"
                color="primaryBright"
                fontSize="14px"
                lineHeight="16px"
              >
                {option.token?.symbol || "BNB"}
              </Box>
              <Box
                fontWeight="700"
                color="primaryBright"
                fontSize="13px"
                lineHeight="14px"
              >
                {t("Balance")}
                <Box
                  ml="14px"
                  as="span"
                  fontWeight="300"
                  color="primaryBright"
                  fontSize="13px"
                  lineHeight="22px"
                >
                  {!option.isEther && formatNumber(asset?.balance || 0, 9)}
                  {option.isEther &&
                    formatNumber(formatEther(etherBalance.toString()), 4)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    },
    [t, assetsTokens]
  );

  return (
    <>
      <Box
        mt="25px"
        bg="#052D22"
        mx="auto"
        px="20px"
        pt="20px"
        pb="50px"
        borderRadius="15px!important"
        maxWidth="90%!important"
        width="600px!important"
        minWidth="360px"
      >
        {step === 0 && (
          <Box>
            <Grid
              gridTemplateColumns="1fr repeat(1, auto) 1fr"
              justifyItems="center"
            >
              <Grid
                style={{
                  gridColumnStart: 2,
                }}
                textAlign="center"
                fontSize="17px"
                lineHeight="22px"
                color="textSubtle"
                fontWeight="700"
              >
                {t("Input Bep20 wallet address to receive")}
              </Grid>
              <Box
                ml="auto"
                fontSize="13px"
                lineHeight="22px"
                color="primaryBright"
                onClick={onDismiss}
                style={{
                  cursor: "pointer",
                }}
              >
                {t("Cancel")}
              </Box>
            </Grid>
            <Box
              position="relative"
              mt="13px"
              borderRadius="19px"
              border="1px solid #FFAE58"
              height="40px"
              display="flex"
              alignItems="center"
              px="20px"
              py="8px"
              color="primaryBright"
            >
              <Box
                display="flex"
                alignItems="center"
                opacity={isCorrectAddress ? 1 : 0}
              >
                <IconSuccess />
              </Box>
              <Box
                value={recipient}
                onChange={handleChange}
                ml="18px"
                mr="18px"
                color="primaryBright"
                style={{
                  outline: "none",
                }}
                as="input"
                border="none"
                bg="transparent"
                width="100%"
                height="100%"
              />
              <Box
                display="flex"
                alignItems="center"
                onClick={() => {
                  setRecipient("");
                }}
              >
                <IconClear />
              </Box>
            </Box>
            <Box>
              <Box
                mt="13px"
                fontWeight="700"
                fontSize="13px"
                lineHeight="22px"
                color="primaryBright"
                mb="2px"
              >
                {t("Asset")}
              </Box>

              <Select
                isSearchable={false}
                value={token}
                styles={selectStyles}
                options={options}
                formatOptionLabel={formatOptionLabel}
                onChange={(option) => setToken(option)}
              />
            </Box>
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
          </Box>
        )}
        {step === 1 && (
          <Box>
            <Box
              onClick={() => {
                setStep(0);
              }}
              display="flex"
              alignItems="center"
            >
              <ArrowB />
              <Box
                ml="8px"
                color="primaryBright"
                style={{
                  cursor: "pointer",
                }}
              >
                {t("Back")}
              </Box>
            </Box>
            <Box mt="16px" display="inline-flex" alignItems="center">
              <IconAccount />
              <Box
                ml="10px"
                fontSize="13px"
                lineHeight="22px"
                color="primaryBright"
              >
                {accountCurrent.slice(0, 4)}...
                {accountCurrent.slice(accountCurrent.length - 4)}
              </Box>
              <Box
                borderRadius="50%"
                mr="22px"
                ml="22px"
                width="20px"
                height="20px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                bg="#FFAE58"
                style={{
                  transform: "rotate(180deg)",
                }}
              >
                <ArrowB color="#052D22" w="12px" />
              </Box>
              <IconAccount />
              <Box
                ml="10px"
                fontSize="13px"
                lineHeight="22px"
                color="primaryBright"
              >
                {recipient.slice(0, 4)}...
                {recipient.slice(recipient.length - 4)}
              </Box>
            </Box>
            <Box
              mt="10px"
              border="1px solid #FFAE58"
              borderRadius="19px"
              px="20px"
              py="11px"
              minHeight="90px"
            >
              <Box color="primaryBright">
                <Box> {t("Transfer")}</Box>
                <Box mt="12px" display="flex" alignItems="center">
                  <CurrencyLogo
                    size="32px"
                    logo={logo}
                    currency={token.isEther ? Currency.ETHER : token.token}
                  />
                  <Box
                    ml="14px"
                    fontWeight="700"
                    fontSize="22px"
                    lineHeight="22px"
                  >
                    {amount} {token.token?.symbol || "BNB"}
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box mt="16px" border="1px solid #9BCABB" />
            <Box mt="10px" display="flex" alignItems="flex-start">
              <Box
                fontSize="12px"
                color="primaryBright"
                display="flex"
                alignItems="center"
                fontWeight="900"
              >
                {t("Estimated gas fee")}
                <Box ml="3px" height="12px" display="flex" alignItems="center">
                  <WarnIcon height="12px" color="primaryBright" />
                </Box>
              </Box>
              <Box
                fontSize="13px"
                color="primaryBright"
                display="flex"
                alignItems="center"
                fontWeight="900"
                ml="auto"
              >
                {estGas} BNB
              </Box>
            </Box>
            <Box
              mt="12px"
              textAlign="right"
              fontSize="13px"
              color="primaryBright"
              alignItems="center"
              fontWeight="700"
              ml="auto"
            >
              {t("Max fee")}
            </Box>
            <Box
              mt="3px"
              textAlign="right"
              fontSize="13px"
              color="primaryBright"
              alignItems="center"
              fontWeight="300"
              ml="auto"
            >
              {estGas} BNB
            </Box>
            <Box mt="16px" border="1px solid #9BCABB" />
            <Box mt="10px" display="flex" alignItems="flex-start">
              <Box
                fontSize="12px"
                color="primaryBright"
                display="flex"
                alignItems="center"
                fontWeight="900"
              >
                {t("Total")}
              </Box>
              <Box
                fontSize="13px"
                color="primaryBright"
                display="flex"
                alignItems="center"
                fontWeight="900"
                ml="auto"
              >
                <Box fontWeight="300" as="span" mr="4px">
                  {!token.isEther &&
                    formatNumber(
                      bl
                        ? new BigNumber(amount)
                            .multipliedBy(bl.price)
                            .plus(
                              new BigNumber(estGas).multipliedBy(etherPrice)
                            )
                            .toString()
                        : 0,
                      9
                    )}
                  {token.isEther &&
                    formatNumber(
                      Number(formatEther(etherBalance.toString())) * etherPrice,
                      5
                    )}{" "}
                  USDT
                </Box>
                {amount} {token.token?.symbol || "BNB"} + {estGas} BNB
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {step === 0 && (
        <Box
          width="600px!important"
          maxWidth="90%!important"
          mx="auto"
          mt="20px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button width="50%" variant="action" onClick={onDismiss}>
            {t("Cancel")}
          </Button>
          <Button
            ml="12px"
            width="50%"
            variant="action"
            disabled={!validAmount || !isCorrectAddress}
            onClick={() => {
              setStep(1);
            }}
          >
            {t("Next")}
          </Button>
        </Box>
      )}
      {step === 1 && (
        <Box
          width="600px!important"
          maxWidth="90%!important"
          mx="auto"
          mt="20px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Button width="50%" variant="action" onClick={onDismiss}>
            {t("Cancel")}
          </Button>
          <Button
            ml="12px"
            width="50%"
            variant="action"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {t("Confirm")}
          </Button>
        </Box>
      )}
    </>
  );
}

export default ModalSend;
