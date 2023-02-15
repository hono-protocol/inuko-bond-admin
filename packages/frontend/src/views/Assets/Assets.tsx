import React, { useRef } from "react";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { formatEther } from "ethers/lib/utils";
import styled from "styled-components";
import { Heading, Box, Text, useModal } from "@bds-libs/uikit";
import { useTranslation } from "../../contexts/Localization";
import tokens from "../../config/constants/tokens";
import { Address } from "../../config/constants/types";
import { getAddress } from "../../utils/addressHelpers";
import UnlockButton from "../../components/UnlockButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenAssetAsync, resetTokenBalance } from "../../state/assets";
import { useAssetTokens } from "../../state/assets/hooks";
import Asset from "./components/Asset";
import { useGetBnbBalance } from "../../hooks/useTokenBalance";
import { State } from "../../state/types";
import { fetchPrices } from "../../state/prices";
import { useGetApiPrices } from "../../state/hooks";
import { formatNumber } from "../../utils/formatBalance";
import ModalAddress from "./components/ModalAddress";
import ModalSend from "./components/ModalSend";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: auto auto 25px;
  padding: 32px 16px 0 16px;
  text-align: center;
  color: #fff;
`;

export interface RawToken {
  symbol: string;
  address: Address;
  decimals: number;
}

export interface TokenWallet {
  isEther?: boolean;
  token?: RawToken;
  lp?: {
    token0: RawToken;
    token1: RawToken;
  };
  isPooCoin?: boolean;
}

const listToken: TokenWallet[] = [
  {
    token: tokens.sig,
    isPooCoin: true,
  },
  {
    token: tokens.sig,
    isPooCoin: true,
  },
  {
    token: tokens.sig,
    isPooCoin: true,
  },
  {
    token: tokens.sig,
    isPooCoin: true,
  },
  {
    isEther: true,
  },
  {
    token: tokens.usdt,
  },
  {
    token: {
      symbol: "BDS-USDT LP",
      address: {
        "56": "0x0aa7158d3d502c2be4153ef39e2f819f0593e82c",
        "97": "",
      },
      decimals: 18,
    },
    lp: {
      token0: tokens.sig,
      token1: tokens.usdt,
    },
  },
  {
    token: {
      symbol: "BDS-WBNB LP",
      address: {
        "56": "0x4B7Ba687A8d25184eA320FC73e2cd39Faaf3fA63",
        "97": "",
      },
      decimals: 18,
    },
    lp: {
      token0: tokens.sig,
      token1: tokens.wbnb,
    },
  },
  {
    token: {
      symbol: "BTN-BDS LP",
      address: {
        "56": "0xb32dd0ddd9376b1cea12d64a8466d46074a7fded",
        "97": "",
      },
      decimals: 18,
    },
    lp: {
      token0: tokens.sig,
      token1: tokens.sig,
    },
  },
  {
    token: {
      symbol: "BIG-BDS LP",
      address: {
        "56": "0xe71710e588526747134ed35a69fb9bf5263c5443",
        "97": "",
      },
      decimals: 18,
    },
    lp: {
      token0: tokens.sig,
      token1: tokens.sig,
    },
  },
  {
    token: {
      symbol: "BLC-BDS LP",
      address: {
        "56": "0x0fda38ef63ac6180af2ece83188b031f0feb6506",
        "97": "",
      },
      decimals: 18,
    },
    lp: {
      token0: tokens.sig,
      token1: tokens.sig,
    },
  },
];

const HistoryIcon = () => {
  return (
    <svg
      fill="rgb(23, 115, 88)"
      viewBox="0 -20 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M452 0H60C26.914 0 0 26.914 0 60v352c0 33.086 26.914 60 60 60h392c33.086 0 60-26.914 60-60V60c0-33.086-26.914-60-60-60zM60 40h392c11.027 0 20 8.973 20 20v60H40V60c0-11.027 8.973-20 20-20zm392 392H60c-11.027 0-20-8.973-20-20V160h432v252c0 11.027-8.973 20-20 20zM70 80c0-11.047 8.953-20 20-20s20 8.953 20 20-8.953 20-20 20-20-8.953-20-20zm70 0c0-11.047 8.953-20 20-20s20 8.953 20 20-8.953 20-20 20-20-8.953-20-20zm206.64 105.86L416.786 256l-70.144 70.14-28.282-28.28L340.215 276H235v-40h105.215l-21.856-21.86zM171.786 316H275v40H171.785l21.856 21.86-28.282 28.28L95.215 336l70.144-70.14 28.282 28.28zm0 0" />
    </svg>
  );
};

const ReceiveICon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="white" />
      <path
        d="M15.6466 8.83504C15.7312 8.83461 15.8151 8.84891 15.8934 8.87712C15.9717 8.90534 16.043 8.94691 16.103 8.99946L16.9323 9.73654V6.5671C16.9323 6.41673 17 6.27251 17.1206 6.16618C17.2412 6.05985 17.4047 6.00012 17.5752 6.00012C17.7457 6.00012 17.9092 6.05985 18.0297 6.16618C18.1503 6.27251 18.218 6.41673 18.218 6.5671V9.73654L19.0473 9.00513C19.1703 8.91225 19.3285 8.86371 19.4903 8.86922C19.6521 8.87473 19.8055 8.93389 19.92 9.03486C20.0345 9.13584 20.1016 9.2712 20.1078 9.4139C20.1141 9.5566 20.059 9.69612 19.9537 9.80458L18.0252 11.5055C17.9047 11.6111 17.7418 11.6704 17.5719 11.6704C17.4021 11.6704 17.2392 11.6111 17.1187 11.5055L15.1902 9.80458C15.0995 9.72528 15.0377 9.62396 15.0126 9.51354C14.9874 9.40312 15.0002 9.2886 15.0491 9.18459C15.0981 9.08058 15.1811 8.99179 15.2875 8.92954C15.3939 8.86728 15.5189 8.83438 15.6466 8.83504Z"
        fill="#177358"
      />
      <rect
        x="10"
        y="14.7144"
        width="16"
        height="11.3043"
        rx="2"
        stroke="#177358"
        strokeWidth="2"
      />
      <path
        d="M26.2174 17.6274H9.78259"
        stroke="#177358"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const SendIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="18" cy="18" r="18" fill="white" />
      <path
        d="M16.0158 6.99289C16.1051 6.99335 16.1937 6.97825 16.2763 6.94847C16.359 6.91869 16.4342 6.8748 16.4976 6.81933L17.373 6.0413V9.38683C17.373 9.54556 17.4445 9.69778 17.5717 9.81002C17.699 9.92226 17.8716 9.98531 18.0515 9.98531C18.2315 9.98531 18.4041 9.92226 18.5314 9.81002C18.6586 9.69778 18.7301 9.54556 18.7301 9.38683V6.0413L19.6055 6.81335C19.7353 6.9114 19.9023 6.96263 20.073 6.95681C20.2438 6.95099 20.4058 6.88855 20.5267 6.78197C20.6475 6.67538 20.7183 6.5325 20.7249 6.38187C20.7315 6.23125 20.6734 6.08398 20.5622 5.96949L18.5265 4.17403C18.3994 4.06257 18.2274 4 18.0481 4C17.8689 4 17.6969 4.06257 17.5698 4.17403L15.534 5.96949C15.4383 6.0532 15.3731 6.16015 15.3466 6.2767C15.3201 6.39325 15.3335 6.51413 15.3852 6.62392C15.4369 6.73371 15.5245 6.82743 15.6368 6.89314C15.7491 6.95886 15.881 6.99358 16.0158 6.99289Z"
        fill="#177358"
      />
      <rect
        x="10"
        y="13.1431"
        width="17"
        height="12.0435"
        rx="2"
        stroke="#177358"
        strokeWidth="2"
      />
      <path
        d="M27.1739 16.2734H9.82605"
        stroke="#177358"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

function Assets() {
  const [step, setStep] = React.useState(0);
  const prices = useGetApiPrices();
  const etherPrice = prices[getAddress(tokens.wbnb.address).toLowerCase()];
  const { account } = useActiveWeb3React();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  const lastUpdatedPrice = useSelector(
    (state: State) => state.prices.lastUpdated
  );

  const { balance: etherBalance } = useGetBnbBalance();

  const assetsTokens = useAssetTokens();

  const totalValue = React.useMemo(() => {
    let total = Object.keys(assetsTokens).reduce<number>((c, k) => {
      const t = assetsTokens[k];
      c = c + Number(t.value);
      return c;
    }, 0);

    total = total + Number(formatEther(etherBalance.toString())) * etherPrice;

    return total;
  }, [assetsTokens, etherPrice, etherBalance]);

  React.useEffect(() => {
    if (!account) {
      setStep(0);
    }
  }, [account]);

  const getAssets = React.useCallback(() => {
    if (account && lastUpdatedPrice) {
      dispatch(
        fetchTokenAssetAsync(
          listToken.reduce<
            { address: string; decimal: number; isLP?: boolean }[]
          >((c, l) => {
            if (l.token) {
              c.push({
                address: getAddress(l.token.address),
                decimal: l.token.decimals,
                isLP: Boolean(l.lp),
              });
            }
            return c;
          }, []),
          account
        )
      );
    } else if (!account) {
      dispatch(resetTokenBalance());
    }
  }, [dispatch, account, lastUpdatedPrice]);

  React.useEffect(() => {
    if (!lastUpdatedPrice) {
      dispatch(fetchPrices());
    }
  }, [dispatch, lastUpdatedPrice]);

  React.useEffect(() => {
    intervalRef.current = setInterval(getAssets, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getAssets]);

  const [openModalAddress] = useModal(<ModalAddress account={account || ""} />);

  return (
    <Box minHeight="100vh" pb="200px">
      <Hero>
        <Heading
          textAlign="center"
          as="h1"
          size="xl"
          fontWeight={900}
          color="#fff"
        >
          {t("Assets")}
        </Heading>
        <Box mt="10px" textAlign="center">
          <Text fontSize="25px" color="#fff" fontWeight={900}>
            {t("Your assets in Inuko token")}
          </Text>
        </Box>
      </Hero>
      {step === 0 && (
        <>
          <Box px="16px">
            <Box maxWidth="500px" mx="auto">
              <Box
                py="20px"
                px="16px"
                width="100%"
                mx="auto"
                bg="#052D22"
                borderRadius="16px"
              >
                <Box
                  as="h1"
                  color="textSubtle"
                  fontSize="17px"
                  lineHeight="22px"
                  fontWeight="700"
                  textAlign="center"
                >
                  {t("Total Value")}
                </Box>
                <Box
                  display="block"
                  as="strong"
                  color="primaryBright"
                  fontSize="28px"
                  lineHeight="50px"
                  fontWeight="700"
                  textAlign="center"
                >
                  {formatNumber(totalValue, 3)} USDT
                </Box>
                <Box mt="18px" textAlign="center">
                  {!account && <UnlockButton />}
                </Box>
                {account && (
                  <Box
                    mt="18px"
                    color="#fff"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    fontSize="12px"
                    lineHeight="14px"
                  >
                    <Box
                      onClick={openModalAddress}
                      style={{
                        cursor: "pointer",
                      }}
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <ReceiveICon />
                      <Box mt="6px">{t("Receive")}</Box>
                    </Box>
                    <Box
                      onClick={() => {
                        setStep(1);
                      }}
                      style={{
                        cursor: "pointer",
                      }}
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                      ml="55px"
                    >
                      <SendIcon />
                      <Box mt="6px">{t("Send")}</Box>
                    </Box>
                    <Box
                      as="a"
                      href={`https://bscscan.com/address/${account}`}
                      target="_blank"
                      style={{
                        cursor: "pointer",
                      }}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexDirection="column"
                      ml="55px"
                    >
                      <Box
                        backgroundColor="white"
                        borderRadius="50%"
                        width="40px"
                        height="40px"
                        padding="10px"
                      >
                        <HistoryIcon />
                      </Box>
                      <Box mt="6px">{t("History")}</Box>
                    </Box>
                  </Box>
                )}
              </Box>
              {listToken.map((l, i) => {
                return (
                  <Asset
                    key={i}
                    etherPrice={etherPrice}
                    etherBalance={etherBalance}
                    token={l}
                  />
                );
              })}
            </Box>
          </Box>
        </>
      )}
      {step === 1 && (
        <>
          <ModalSend
            getAssets={getAssets}
            etherBalance={etherBalance}
            etherPrice={etherPrice}
            onDismiss={() => {
              setStep(0);
            }}
            account={account}
            listToken={listToken}
          />
        </>
      )}
    </Box>
  );
}

export default Assets;
