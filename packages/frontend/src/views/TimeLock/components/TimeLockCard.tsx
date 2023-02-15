import React from "react";
import { Button, Box, Card } from "@bds-libs/uikit";
import { formatNumber } from "../../../utils/formatBalance";
import { formatUnits } from "ethers/lib/utils";
import { useTranslation } from "../../../contexts/Localization";
import styled from "styled-components";
import BigNumber from "bignumber.js";
export interface TimeLockCardProps {
  children?: React.ReactNode;
  address: string;
  title: string;
  endDate: string;
  totalDay: number;
  total: BigNumber;
  handleClaim: () => Promise<void>;
  lockOf: BigNumber;
  pendingTokens: BigNumber;
  isPending: boolean;
  perDay: BigNumber;
  token: string;
  tokenIcon: string;
}

const StyledButton = styled(Button)`
  background-color: #ffae58;
  color: #052e22;
`;

const Logo = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="24" fill="white" />
      <path
        d="M24 45.3333C35.7821 45.3333 45.3333 35.782 45.3333 24C45.3333 12.2179 35.7821 2.66663 24 2.66663C12.2179 2.66663 2.66667 12.2179 2.66667 24C2.66667 35.782 12.2179 45.3333 24 45.3333Z"
        fill="url(#timelockLogo)"
      />
      <path
        d="M28.1574 25.6953V22.7529C28.1576 22.4712 28.1022 22.1922 27.9946 21.9318C27.8869 21.6715 27.729 21.4349 27.5299 21.2356C27.3307 21.0362 27.0943 20.8781 26.834 20.7702C26.5738 20.6623 26.2948 20.6067 26.0131 20.6066H20.2478C20.1944 20.6066 20.1417 20.6171 20.0924 20.6375C20.0431 20.6579 19.9984 20.6878 19.9607 20.7255C19.923 20.7632 19.8931 20.8079 19.8727 20.8572C19.8523 20.9064 19.8418 20.9592 19.8418 21.0125V27.4371C19.8418 27.4904 19.8523 27.5432 19.8727 27.5924C19.8931 27.6417 19.923 27.6865 19.9607 27.7241C19.9984 27.7618 20.0431 27.7917 20.0924 27.8121C20.1417 27.8326 20.1944 27.8431 20.2478 27.8431H26.0131C26.2949 27.843 26.574 27.7873 26.8344 27.6793C27.0947 27.5713 27.3312 27.413 27.5303 27.2136C27.7295 27.0141 27.8874 26.7773 27.995 26.5168C28.1025 26.2563 28.1577 25.9771 28.1574 25.6953ZM21.4372 26.1748V22.279H25.8389C25.9339 22.2789 26.0279 22.2975 26.1157 22.3338C26.2035 22.3701 26.2832 22.4234 26.3504 22.4906C26.4176 22.5577 26.4708 22.6375 26.5071 22.7253C26.5434 22.813 26.5621 22.9071 26.562 23.0021V25.4531C26.5621 25.5481 26.5434 25.6421 26.5071 25.7299C26.4708 25.8177 26.4176 25.8974 26.3504 25.9646C26.2832 26.0318 26.2035 26.085 26.1157 26.1213C26.0279 26.1576 25.9339 26.1763 25.8389 26.1762L21.4372 26.1748Z"
        fill="white"
      />
      <path
        d="M9.06257 24.2247C9.06257 16.1576 15.4469 9.58246 23.4398 9.28961V7.5249C14.6003 7.81983 7.52409 15.0827 7.52409 23.9999C7.52409 24.342 7.53588 24.6814 7.55601 25.0179H9.08269C9.06928 24.7547 9.06257 24.4903 9.06257 24.2247Z"
        fill="white"
      />
      <path
        d="M38.4951 20.6044H31.2177C30.9286 20.6045 30.6424 20.6615 30.3754 20.7722C30.1083 20.883 29.8657 21.0452 29.6614 21.2496C29.4571 21.4541 29.295 21.6968 29.1845 21.9639C29.0739 22.231 29.0171 22.5173 29.0172 22.8063V22.8251C29.0169 23.1142 29.0736 23.4006 29.1841 23.6678C29.2945 23.935 29.4566 24.1778 29.6609 24.3824C29.8653 24.587 30.108 24.7492 30.3751 24.8599C30.6422 24.9707 30.9285 25.0276 31.2177 25.0276H35.1218C35.2713 25.0379 35.4112 25.1045 35.5135 25.214C35.6157 25.3235 35.6726 25.4677 35.6726 25.6175C35.6726 25.7673 35.6157 25.9115 35.5135 26.021C35.4112 26.1305 35.2713 26.1971 35.1218 26.2074H29.0151V27.8465H35.1912C35.7584 27.8465 36.3024 27.6211 36.7035 27.22C37.1046 26.8189 37.33 26.2749 37.33 25.7077V25.4419C37.3299 25.3033 37.316 25.1649 37.2883 25.029C37.208 24.6262 37.0117 24.2557 36.7236 23.963C36.4354 23.6703 36.068 23.4682 35.6666 23.3816C35.5206 23.35 35.3717 23.3342 35.2224 23.3344H30.9269C30.8117 23.2847 30.7173 23.1966 30.6599 23.0851C30.6024 22.9735 30.5854 22.8455 30.6117 22.7229C30.6381 22.6002 30.7062 22.4905 30.8044 22.4125C30.9027 22.3344 31.0249 22.2929 31.1504 22.2949L40.3861 22.2775C39.5443 14.1653 32.8228 7.8004 24.5592 7.5249V9.28892C31.3127 9.53804 36.9205 14.2728 38.4951 20.6044Z"
        fill="white"
      />
      <path
        d="M40.4749 24C40.4749 23.7689 40.4694 23.5392 40.4597 23.3109H38.908C38.926 23.6128 38.9364 23.9181 38.9364 24.2248C38.9364 32.292 32.5487 38.8671 24.5592 39.16V40.4785C33.3987 40.1808 40.4749 32.9179 40.4749 24Z"
        fill="white"
      />
      <path
        d="M9.50319 27.8465H17.0866C17.3356 27.8465 17.5822 27.7975 17.8122 27.7021C18.0422 27.6068 18.2512 27.4671 18.4272 27.291C18.6032 27.1148 18.7428 26.9057 18.838 26.6756C18.9331 26.4456 18.982 26.199 18.9818 25.95V25.7092C18.9817 25.3693 18.8793 25.0374 18.6878 24.7567C18.4963 24.4759 18.2246 24.2594 17.9083 24.1353C18.1593 24.041 18.3755 23.8725 18.5283 23.6522C18.681 23.4319 18.763 23.1702 18.7632 22.9022V21.923C18.7632 21.5733 18.6243 21.2379 18.377 20.9907C18.1298 20.7434 17.7944 20.6045 17.4447 20.6045H11.0715C10.9639 20.6047 10.8607 20.6475 10.7847 20.7236C10.7086 20.7997 10.6657 20.9028 10.6656 21.0104V25.0166H16.8341C16.9674 25.0166 17.0952 25.0695 17.1896 25.1637C17.2839 25.2579 17.337 25.3857 17.3372 25.519V25.6335C17.3372 25.6996 17.3241 25.765 17.2989 25.826C17.2736 25.887 17.2365 25.9424 17.1898 25.989C17.143 26.0357 17.0876 26.0727 17.0265 26.0979C16.9655 26.1231 16.9001 26.136 16.8341 26.1359H7.66145C8.68572 34.0518 15.3178 40.2043 23.4397 40.4764V39.1579C16.6883 38.9115 11.0771 34.1753 9.50319 27.8465ZM17.2116 22.9327C17.2114 23.0703 17.1566 23.2022 17.0593 23.2995C16.962 23.3968 16.8301 23.4516 16.6925 23.4518H12.263V22.2651H16.6925C16.8301 22.2653 16.962 22.32 17.0593 22.4173C17.1566 22.5146 17.2114 22.6466 17.2116 22.7842V22.9327Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="timelockLogo"
          x1="6.72279"
          y1="15.6282"
          x2="45.1286"
          y2="34.2385"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1F8569" />
          <stop offset="1" stopColor="#146149" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const BodyWrapper = styled(Card)`
  background: transparent;
  flex: 0 0 100%;
  -moz-box-flex: 0;
  padding-left: 10px;
  padding-top: 10px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex: 0 0 50%;
  }
`;

const Body = styled(Card)`
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: ${({ theme }) => {
    return theme.colors.background;
  }};
  border-radius: 15px;
`;

function TimeLockCard(props: TimeLockCardProps) {
  const {
    lockOf,
    perDay,
    handleClaim,
    total,
    pendingTokens,
    isPending,
    title,
    endDate,
    totalDay,
    token,
    tokenIcon,
  } = props;
  const { t } = useTranslation();

  if (lockOf.eq(0)) {
    return <></>;
  }

  return (
    <BodyWrapper>
      <Body>
        <Box
          display="flex"
          alignItems="center"
          color="textSubtle"
          fontSize="24px"
          fontWeight="700"
        >
          <Box display="flex" alignItems="center">
            <Box mr="11px">
              <Box height="48px" as="img" src={tokenIcon} alt={token} />
            </Box>
            {token}
          </Box>
          <Box
            fontSize="20px"
            color="#052E22"
            borderRadius="30.5px"
            px="16px"
            py="12px"
            ml="auto"
            bg="#9BCABB"
          >
            {title}
          </Box>
        </Box>
        <Box mt="20px" border="1px solid #9BCABB" />
        <Box
          mt="12px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total locked")}
          <Box ml="auto" as="strong" color="primaryBright" fontWeight={700}>
            {formatNumber(formatUnits(total.toString(), 8), 3)}
          </Box>
        </Box>
        <Box
          mt="8px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total withdrew")}
          <Box ml="auto" as="strong" color="textSubtle" fontWeight={700}>
            {formatNumber(formatUnits(total.minus(lockOf).toString(), 8))}
          </Box>
        </Box>
        <Box
          mt="8px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total remaining")}
          <Box ml="auto" as="strong" color="textSubtle" fontWeight={700}>
            {formatNumber(formatUnits(lockOf.toString(), 8), 3)}
          </Box>
        </Box>
        <Box mt="20px" border="1px solid #9BCABB" />
        <Box
          mt="12px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total token pay by day")}
          <Box ml="auto" as="strong" color="primaryBright" fontWeight={700}>
            {formatNumber(perDay.toString())}
          </Box>
        </Box>
        <Box
          mt="8px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("End date")}
          <Box ml="auto" as="strong" color="primaryBright" fontWeight={700}>
            {endDate}
          </Box>
        </Box>
        <Box
          mt="8px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Number of days to pay")}
          <Box ml="auto" as="strong" color="secondary" fontWeight={700}>
            {formatNumber(totalDay)}
          </Box>
        </Box>

        <Box mt="20px" border="1px solid #9BCABB" />
        <Box
          mt="12px"
          as="p"
          fontWeight={300}
          fontSize="14px"
          display="flex"
          color="primaryBright"
        >
          {t("Total pending")}
          <Box ml="auto" as="strong" color="textSubtle" fontWeight={700}>
            {formatNumber(formatUnits(pendingTokens.toString(), 8), 3)}
          </Box>
        </Box>
        <Box mt="20px">
          <StyledButton
            width="100%"
            disabled={pendingTokens.eq(0) || isPending}
            onClick={handleClaim}
          >
            {t("Claim")}
          </StyledButton>
        </Box>
      </Body>
    </BodyWrapper>
  );
}

export default TimeLockCard;
