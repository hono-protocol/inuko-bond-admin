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
import { BASE_ADD_LIQUIDITY_URL } from "config";
import { Ifo } from "config/constants/types";
import { WalletIfoData } from "views/Ifos/types";
import { useTranslation } from "contexts/Localization";
import useTokenBalance from "hooks/useTokenBalance";
import Container from "components/layout/Container";
import { getAddress } from "utils/addressHelpers";
import tokens from "../../../config/constants/tokens";

interface Props {
  ifo: Ifo;
  walletIfoData: WalletIfoData;
}

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

const IfoSteps: React.FC<Props> = ({ ifo, walletIfoData }) => {
  const { poolBasic, poolUnlimited } = walletIfoData;
  const { t } = useTranslation();
  const { balance } = useTokenBalance(getAddress(ifo.currency.address));
  const stepsValidationStatus = [
    balance.isGreaterThan(0),
    poolBasic.amountTokenCommittedInLP.isGreaterThan(0) ||
      poolUnlimited.amountTokenCommittedInLP.isGreaterThan(0),
    poolBasic.hasClaimed || poolUnlimited.hasClaimed,
  ];
  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid =
      index === 0
        ? true
        : every(stepsValidationStatus.slice(0, index), Boolean);
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? "past" : "future";
    }
    return arePreviousValid ? "current" : "future";
  };

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step];
    switch (step) {
      // case 0:
      //   return (
      //     <CardBody>
      //       <Heading as="h4" color="secondary" mb="16px">
      //         {t("Activate your Profile")}
      //       </Heading>
      //       <Text color="textSubtle" small mb="16px">
      //         {t(
      //           "You’ll need an active PancakeSwap Profile to take part in an IFO!"
      //         )}
      //       </Text>
      //       {isStepValid ? (
      //         <Text color="success" bold>
      //           {t("Profile Active!")}
      //         </Text>
      //       ) : (
      //         <Button as={Link} href="/profile">
      //           {t("Activate your Profile")}
      //         </Button>
      //       )}
      //     </CardBody>
      //   );
      case 0:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t("Get %symbol% Tokens", { symbol: ifo.lpName })}
            </Heading>
            <Text color="#9BCABB" small>
              {t("Stake BDS and USDT in the liquidity pool to get LP tokens.")}{" "}
              <br />
              {t("You’ll spend them to buy IFO sale tokens.")}
            </Text>
            {!ifo.currencyIsLP && (
              <StyledButton>
                <Button
                  width="100%"
                  variant="action"
                  as={Link}
                  external
                  href={`/swap?outputCurrency=${getAddress(
                    ifo.currency.address
                  )}`}
                  endIcon={<OpenNewIcon color="inherit" />}
                  mt="16px"
                >
                  {t("Get tokens")}
                </Button>
              </StyledButton>
            )}
            {ifo.currencyIsLP && (
              <StyledButton>
                <Button
                  width="100%"
                  variant="action"
                  as={Link}
                  external
                  href={`/add/${getAddress(tokens.sig.address)}/${getAddress(
                    tokens.usdt.address
                  )}`}
                  endIcon={<OpenNewIcon color="inherit" />}
                  mt="16px"
                >
                  {t("Get LP tokens")}
                </Button>
              </StyledButton>
            )}
          </StyledBody>
        );
      case 1:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t(ifo.currencyIsLP ? "Commit LP Tokens" : "Commit Tokens")}
            </Heading>
            <Text color="#9BCABB" small>
              {t(
                "When the IFO sales are live, you can “commit” your LP tokens to buy the tokens being sold."
              )}{" "}
              <br />
              {t(
                "We recommend committing to the Basic Sale first, but you can do both if you like."
              )}
            </Text>
          </StyledBody>
        );
      case 2:
        return (
          <StyledBody>
            <Heading as="h4" color="textSubtle" mb="16px">
              {t("Claim your tokens")}
            </Heading>
            <Text color="#9BCABB" small>
              {t(
                "After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent BDS-USDT LP tokens will be returned to your wallet."
              )}
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
        {stepsValidationStatus.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Step key={index} index={index} status={getStatusProp(index)}>
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  );
};

export default IfoSteps;
