import React, { useState } from "react";
import styled from "styled-components";
import {
  Heading,
  Card,
  CardBody,
  Text,
  Input,
  Box,
  Button,
} from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { useGetReferralInfo } from "state/hooks";
import { isAddress } from "utils";

const StyledLotteryCard = styled(Card)`
  background-color: #052e22;
`;

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

const InputReferral = () => {
  const { t } = useTranslation();
  const referralsInfo = useGetReferralInfo();
  const refLocal =
    localStorage.getItem("REFERRER") || window.location.href.split("ref=")?.[1];
  const [isCorrectAddress, setIsAddress] = React.useState(false);
  const [recipient, setRecipient] = React.useState("");
  const [refContract, setRefContract] = React.useState("");

  React.useEffect(() => {
    setIsAddress(Boolean(isAddress(recipient)));
  }, [recipient]);

  React.useEffect(() => {
    if (referralsInfo.referrer && parseInt(referralsInfo.referrer)) {
      setRefContract(referralsInfo.referrer);
    }
  });

  function handleChange(e: any) {
    setRecipient(e.target.value);
  }

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading style={{ fontSize: 16 }} color="textSubtle" mb="8px">
          {t("Input the address of your referrer")}
        </Heading>
        <Box
          position="relative"
          mt="13px"
          mb="12px"
          borderRadius="19px"
          border="1px solid white"
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
            opacity={
              isCorrectAddress || isAddress(refLocal) || isAddress(refContract)
                ? 1
                : 0
            }
          >
            <IconSuccess />
          </Box>
          <Box
            disabled={!!(refContract || refLocal)}
            value={refContract || refLocal || recipient}
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
            borderColor="red"
            borderWidth="1px"
            width="100%"
            height="100%"
          />
        </Box>
        <Button
          width="100%"
          style={{ borderRadius: 19 }}
          variant="action"
          disabled={!!(refContract || refLocal) || !isCorrectAddress}
          onClick={() => {
            localStorage.setItem("REFERRER", recipient);
            window.location.reload();
          }}
        >
          {t("Save")}
        </Button>
      </CardBody>
    </StyledLotteryCard>
  );
};

export default InputReferral;
