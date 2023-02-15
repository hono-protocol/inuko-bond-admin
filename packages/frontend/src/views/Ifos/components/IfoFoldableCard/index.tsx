import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardRibbon,
  ExpandableButton,
  Progress,
  Button,
  ChevronUpIcon,
  Box,
  LinkExternal,
} from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
import { Ifo, IfoStatus, PoolIds } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import { useERC20 } from "hooks/useContract";
import useToast from "hooks/useToast";
import { useTranslation } from "contexts/Localization";
import { getAddress } from "utils/addressHelpers";
import { EnableStatus } from "./types";
import IfoPoolCard from "./IfoPoolCard";
import Timer from "./Timer";
import useIfoApprove from "../../hooks/useIfoApprove";
import { getBscScanLink } from "../../../../utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";

interface IfoFoldableCardProps {
  ifo: Ifo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
  isInitiallyVisible: boolean;
}

const getRibbonComponent = (ifo: Ifo, status: IfoStatus, t: any) => {
  if (status === "coming_soon") {
    return (
      <CardRibbon
        variantColor="textDisabled"
        ribbonPosition="left"
        text={t("Coming Soon")}
      />
    );
  }

  if (status === "live" || (status === "finished" && ifo.isActive)) {
    return (
      <CardRibbon
        variantColor="primary"
        ribbonPosition="left"
        style={{ textTransform: "uppercase" }}
        text={status === "live" ? `${t("Live")}!` : `${t("Finished")}!`}
      />
    );
  }

  return null;
};

const StyledCard = styled(Card)`
  max-width: 850px;
  width: 100%;
  margin: auto;
`;

const Header = styled(CardHeader)<{ ifoId: string; bg?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 143px;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: ${({ bg }) => `url(${bg ? bg : "/images/itos/test.jpg"})`};

  ${({ theme }) => theme.mediaQueries.xl} {
    height: 200px;
  }
`;

const FoldableContent = styled.div<{ isVisible: boolean; isActive: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "block" : "none")};
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.gradients.bubblegum : theme.colors.dropdown};
`;

const CardsWrapper = styled.div<{ singleCard: boolean }>`
  margin-top: 10px;
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-bottom: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 25px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: ${({ singleCard }) =>
      singleCard ? "1fr" : "1fr 1fr"};
    justify-items: ${({ singleCard }) => (singleCard ? "center" : "unset")};
  }
`;

const StyledCardBody = styled(CardBody)`
  background: #052e22;

  padding: 24px 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px;
  }
`;

const StyledCardFooter = styled(CardFooter)`
  text-align: center;
  padding: 8px;
  background: #0a4635;
  border: none;
  height: 77px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledExpandableButton = styled(ExpandableButton)`
  background-color: #fff;
  box-shadow: 0px 4px 4px 0px #00000040; ;
`;

const StyledProgressContainer = styled(Box)`
  & [data-bar="true"] {
    background: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textSubtle};

  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
  }
`;

const IfoFoldableCard: React.FC<IfoFoldableCardProps> = ({
  ifo,
  publicIfoData,
  walletIfoData,
  isInitiallyVisible,
}) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible);
  const [enableStatus, setEnableStatus] = useState(EnableStatus.DISABLED);
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  const raisingTokenContract = useERC20(getAddress(ifo.currency.address));
  const Ribbon = getRibbonComponent(ifo, publicIfoData.status, t);
  const isActive = publicIfoData.status !== "finished" && ifo.isActive;
  const { contract } = walletIfoData;
  const onApprove = useIfoApprove(raisingTokenContract, contract.address);
  const { toastSuccess } = useToast();

  const handleApprove = async () => {
    try {
      setEnableStatus(EnableStatus.IS_ENABLING);

      await onApprove();

      setEnableStatus(EnableStatus.ENABLED);
      toastSuccess(
        t("Successfully Enabled!"),
        t("You can now participate in the %symbol% IFO.", {
          symbol: ifo.token.symbol,
        })
      );
    } catch (error) {
      setEnableStatus(EnableStatus.DISABLED);
    }
  };

  useEffect(() => {
    const checkAllowance = async () => {
      try {
        const response = await raisingTokenContract.allowance(
          account,
          contract.address
        );
        const currentAllowance = new BigNumber(response.toString());
        setEnableStatus(
          currentAllowance.lte(0) ? EnableStatus.DISABLED : EnableStatus.ENABLED
        );
      } catch (error) {
        setEnableStatus(EnableStatus.DISABLED);
      }
    };

    if (account) {
      checkAllowance();
    }
  }, [account, raisingTokenContract, contract, setEnableStatus]);

  return (
    <StyledCard>
      <Header bg={ifo.bgUrl} ifoId={ifo.id}>
        <Box
          width="100%"
          height="100%"
          position="absolute"
          top="0"
          left="0"
          background="linear-gradient(90deg, rgba(0, 0, 0, 0.65) -1.22%, rgba(0, 0, 0, 0) 97.95%)"
        />
        <Box position="relative">
          <Box
            color="text"
            fontSize={{
              base: "25px",
              xl: "35px",
            }}
            lineHeight={{
              base: "29px",
              xl: "41px",
            }}
            as="h2"
          >
            {ifo.title}
          </Box>
        </Box>
        <Box position="relative" ml="auto">
          <StyledExpandableButton
            expanded={isVisible}
            onClick={() => setIsVisible((prev) => !prev)}
          />
        </Box>
      </Header>
      <FoldableContent
        isVisible={isVisible}
        isActive={publicIfoData.status !== "idle" && isActive}
      >
        {isActive && (
          <StyledProgressContainer>
            <Progress variant="flat" primaryStep={publicIfoData.progress} />
          </StyledProgressContainer>
        )}
        <StyledCardBody>
          {isActive && <Timer publicIfoData={publicIfoData} />}
          <Box display={{ lg: "flex" }}>
            <Box display="flex">
              <Box
                as="img"
                src={ifo.logoUrl}
                width={
                  {
                    _: "50px",
                    lg: "65px",
                  } as any
                }
                height={
                  {
                    _: "50px",
                    lg: "65px",
                  } as any
                }
              />
              <Box ml={{ _: "16px", lg: "24px" }}>
                <Box
                  color="textSubtle"
                  fontSize={{ _: "12px", lg: "13px" }}
                  lineHeight={{ _: "24px" }}
                  fontWeight="700"
                >
                  {t("TOKEN SALE")}
                </Box>
                <Box
                  fontWeight="900"
                  color="textSubtle"
                  fontSize={{ _: "14px", lg: "15px" }}
                  lineHeight={{ _: "24px" }}
                >
                  {ifo.name} ({ifo.token.symbol})
                </Box>
                <Box
                  fontWeight="700"
                  color="textSubtle"
                  fontSize={{ _: "14px", lg: "15px" }}
                  lineHeight={{ _: "24px" }}
                >
                  {ifo.token.symbol} = {ifo.lpAmount} {ifo.lpName} LP
                </Box>
                <Box
                  fontWeight="700"
                  color="textSubtle"
                  fontSize={{ _: "14px", lg: "15px" }}
                  lineHeight={{ _: "24px" }}
                >
                  {ifo.token.symbol} = {ifo.lpPriceDisplay}
                </Box>
              </Box>
            </Box>
            <Box ml="auto">
              <Box display="flex" alignItems="flex-end" flexDirection="column">
                <StyledLinkExternal external href={ifo.articleUrl} mb="8px">
                  {t("Learn more about %title%", { title: ifo.title })}
                </StyledLinkExternal>
                <StyledLinkExternal
                  external
                  href={getBscScanLink(ifo.address, "address")}
                >
                  {t("View Contract")}
                </StyledLinkExternal>
              </Box>
            </Box>
          </Box>
          <CardsWrapper
            singleCard={!publicIfoData.poolBasic || !walletIfoData.poolBasic}
          >
            {publicIfoData.poolBasic && walletIfoData.poolBasic && (
              <IfoPoolCard
                poolId={PoolIds.poolBasic}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
                onApprove={handleApprove}
                enableStatus={enableStatus}
              />
            )}
            <IfoPoolCard
              poolId={PoolIds.poolUnlimited}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              onApprove={handleApprove}
              enableStatus={enableStatus}
            />
          </CardsWrapper>
          <Box
            fontSize="13px"
            lineHeight="22px"
            fontWeight="500"
            color="primaryBright"
          >
            {t(
              "Reserve the %symbol% LP according to the amount of Tokens you want to own to participate",
              { symbol: ifo.lpName }
            )}
            <br />
            {t(
              "The new token is distributed according to the percentage of the reservation for those who join"
            )}
            <br />
            {t(
              "The remaining portion of %symbol% LP that cannot be redeemed will be returned after the opening time for redemption",
              {
                symbol: ifo.lpName,
              }
            )}
          </Box>
        </StyledCardBody>
        <StyledCardFooter>
          <Button
            variant="text"
            endIcon={<ChevronUpIcon color="textSubtle" />}
            onClick={() => setIsVisible(false)}
          >
            <Box color="textSubtle">{t("Close")}</Box>
          </Button>
        </StyledCardFooter>
      </FoldableContent>
    </StyledCard>
  );
};

export default IfoFoldableCard;
