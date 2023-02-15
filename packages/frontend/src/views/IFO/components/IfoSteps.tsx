import React from "react";
import styled from "styled-components";
import every from "lodash/every";
import {
  Stepper,
  Step,
  StepStatus,
  Card,
  CardBody,
  Heading,
  Text,
  Button,
  Link,
  OpenNewIcon,
  Box,
} from "@bds-libs/uikit";
import { Ifo } from "config/constants/types";
import { WalletIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import Container from "components/layout/Container";

const Wrapper = styled(Container)`
  position: relative;
  background: url("/images/itos/road-map.png");
  background-repeat: no-repeat;
  background-position: center 100px;
  background-size: contain;
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 100px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`;

const StyledBody = styled(CardBody)`
  background: #052e22;
`;

const StyledButton = styled(Box)`
  > a {
    width: 100%;
  }
`;

const IfoSteps: React.FC = () => {
  const { t } = useTranslation();

  const renderCardBody = (step: number) => {
    switch (step) {
      case 0:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t("Deposit VIP Pools")}
              {/* {t("Get %symbol% Tokens", { symbol: ifo.lpName })} */}
            </Heading>
            <Text color="#9BCABB" small>
              {t(
                "To join in IVO, you need to deposit BDS and BDS-USDT LP into VIP Pools"
              )}
            </Text>
            <StyledButton>
              <Button
                width="100%"
                variant="action"
                as={Link}
                external
                href="/vip-pools"
                endIcon={<OpenNewIcon color="inherit" />}
                mt="16px"
              >
                {t("Deposit VIP Pools")}
              </Button>
            </StyledButton>
          </StyledBody>
        );
      case 1:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t("Swap token to IVO token")}
            </Heading>
            <Text color="#9BCABB" small>
              {t(
                "If you meet the requirement, you can use your token to buy IVO token."
              )}{" "}
              <br />
              <br />
              {t(
                "You can buy many times until the time ends. You can join in all pools if you meet the requirement."
              )}
            </Text>
          </StyledBody>
        );
      case 2:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t("Claim your tokens when IVO finished")}
            </Heading>
            <Text color="#9BCABB" small>
              {t(
                "After the IVO sales finish, you can claim any IVO tokens that you bought based on your % deposited."
              )}
              <br />
              {t("And the rest of your tokens aswell.")}
            </Text>
          </StyledBody>
        );
      default:
        return null;
    }
  };

  return (
    <Wrapper>
      <Box
        right="-20px"
        top="-50px"
        position="absolute"
        zIndex={-1}
        as="img"
        src="/images/cloud.png"
      />
      <Box
        as="h2"
        fontSize={{
          _: "25px",
          xl: "35px",
        }}
        lineHeight={{
          _: "29px",
          xl: "41px",
        }}
        color="text"
        mb="24px"
        textAlign="center"
      >
        {t("How to Take Part")}
      </Box>
      <Stepper>
        {[0, 1, 2].map((_, index) => (
          <Step key={index} index={index} status="past">
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  );
};

export default IfoSteps;
