import React, { useState } from "react";
import {
  Box,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Button,
  ChevronUpIcon,
  ChevronDownIcon,
  LinkExternal,
  CalculateIcon,
  IconButton,
} from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "../../../contexts/Localization";
import UnlockButton from "../../../components/UnlockButton";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface FooterEntryProps {
  label: string;
  value: string | number;
}

export interface ITOCardProps {
  children?: React.ReactNode;
}

const StyledHeader = styled(CardHeader)`
  background: transparent;
  padding-bottom: 0;
`;

const StyledBody = styled(CardBody)`
  background: transparent;
  padding-top: 16px;
`;

const StyledFooter = styled(CardFooter)`
  border: none;
  padding-top: 0px;
`;

const StyledFooterBody = styled(CardBody)`
  border: none;
  padding-top: 0px;
`;

function Icon() {
  return (
    <svg
      width="45"
      height="45"
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="22.5" cy="22.5" r="22.5" fill="#5D331A" />
      <path
        d="M16.5212 20.4747L22.4988 33.9802L28.4765 20.4747H16.5212Z"
        fill="white"
      />
      <path
        d="M25.3516 11.25H19.6459L16.4993 18.644H28.4982L25.3516 11.25Z"
        fill="white"
      />
      <path
        d="M14.5112 20.4747H7.49927L21.2054 36.1526L14.5112 20.4747Z"
        fill="white"
      />
      <path
        d="M30.443 11.5227C30.2711 11.3483 30.0363 11.2501 29.7913 11.2501H27.3416L30.4881 18.6441H37.4663L30.443 11.5227Z"
        fill="white"
      />
      <path
        d="M30.4872 20.4747L23.793 36.1526L37.4992 20.4747H30.4872Z"
        fill="white"
      />
      <path
        d="M15.2073 11.25C14.9624 11.25 14.7276 11.3482 14.5556 11.5226L7.53223 18.644H14.5105L17.657 11.25H15.2073Z"
        fill="white"
      />
    </svg>
  );
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text color="text">{label}</Text>
      <Text fontWeight={900} textAlign="right">
        {value}
      </Text>
    </Flex>
  );
};

const DetailsButton = styled(Button).attrs({ variant: "text" })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`;

function ITOCardP() {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();

  const [isOpen, setIsOpen] = useState(false);

  const IconDetail = isOpen ? ChevronUpIcon : ChevronDownIcon;

  const handleClick = async () => {
    setIsOpen(!isOpen);
  };
  return (
    <Card>
      <StyledHeader>
        <Box display="flex" alignItems="center">
          <Icon />
          <Text
            ml="16px"
            as="h2"
            fontWeight={900}
            fontSize="25px"
            color="textSubtle"
          >
            Big Angel Hotel
          </Text>
        </Box>
      </StyledHeader>
      <StyledBody>
        <Box
          position="relative"
          minHeight="175px"
          borderRadius="16px"
          overflow="hidden"
        >
          <Box
            zIndex={2}
            position="absolute"
            bottom="15px"
            right="10px"
            display="flex"
          >
            <Box
              background="#fff"
              width="38px"
              height="38px"
              borderRadius="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                width="32px"
                height="32px"
                as="img"
                src="/images/tokens/0x72b7181bd4a0b67ca7df2c7778d8f70455dc735b.png"
              />
            </Box>
            <Box
              position="relative"
              left="-10px"
              background="#fff"
              width="38px"
              height="38px"
              borderRadius="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                width="32px"
                height="32px"
                as="img"
                src="/images/tokens/0xaf984e23eaa3e7967f3c5e007fbe397d8566d23d.png"
              />
            </Box>
          </Box>
          <Box
            zIndex={1}
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            background="#000"
            opacity={0.4}
          />
          <Box as="img" src="https://dummyimage.com/600x400/c7a9c7/541748" />
        </Box>
        <Box mt="20px">
          <Box fontSize="12px" color="primary" as="p">
            {t("Loaded")} 20%
          </Box>
          <Box
            mt="3px"
            position="relative"
            height="11px"
            width="100%"
            background="#EDEDED"
            borderRadius="8px"
          >
            <Box
              top="0"
              left="0"
              position="absolute"
              height="11px"
              width="20%"
              background="rgba(78, 167, 141, 0.5);"
              borderRadius="8px"
            >
              <Box
                borderRadius="50%"
                width="12px"
                top="-0.5px"
                right="0"
                background="#177358"
                position="absolute"
                height="12px"
              />
            </Box>
          </Box>
        </Box>
        <Box mt="16px">
          <FooterEntry label={t("LP Stake")} value="BDS + VNDC" />
          <FooterEntry
            label={t("Total token distribution")}
            value="25,000 Slot"
          />
          <FooterEntry label={t("Token price")} value="1 BDS = 300,000 VNDC" />
          <FooterEntry label={t("Left")} value="22,857" />
        </Box>
        <Box mt="20px">
          {!account && <UnlockButton width="100%" />}
          {account && <Button width="100%">{t("Stake")}</Button>}
        </Box>
      </StyledBody>
      <StyledFooter p="0">
        <DetailsButton
          width="100%"
          endIcon={<IconDetail width="24px" color="primary" />}
          onClick={handleClick}
        >
          {t("Details")}
        </DetailsButton>
        {isOpen && (
          <StyledFooterBody padding="0 24px">
            <Box
              height="1px"
              width="100%"
              background="rgba(155, 202, 187, 0.6)"
            />
            <Box mt="16px">
              <FooterEntry label={t("Start")} value="25/05/2021" />
              <FooterEntry label={t("Timeline")} value="12 tháng" />
              <FooterEntry label={t("Monthly gift")} value="8,333 VNDC/ Slot" />
              <Flex mt="9px" justifyContent="space-between" alignItems="center">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text color="text">CF</Text>
                  <Text ml="4px" fontWeight={900} textAlign="right">
                    13.2%
                  </Text>
                  <IconButton
                    color="textSubtle"
                    variant="text"
                    scale="sm"
                    ml="7px"
                  >
                    <CalculateIcon color="textSubtle" width="18px" />
                  </IconButton>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text color="text">ROI</Text>
                  <Text ml="4px" fontWeight={900} textAlign="right">
                    32.5%
                  </Text>
                  <IconButton
                    color="textSubtle"
                    variant="text"
                    scale="sm"
                    ml="7px"
                  >
                    <CalculateIcon color="textSubtle" width="18px" />
                  </IconButton>
                </Flex>
              </Flex>
            </Box>
            <Box mt="23px">
              <StyledLinkExternal href="#">
                {t("View Project Site")}
              </StyledLinkExternal>
            </Box>
          </StyledFooterBody>
        )}
      </StyledFooter>
    </Card>
  );
}

export default ITOCardP;
