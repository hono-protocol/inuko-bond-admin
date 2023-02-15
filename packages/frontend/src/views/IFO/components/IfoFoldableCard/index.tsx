import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ExpandableButton,
  Progress,
  Button,
  ChevronUpIcon,
  Box,
  LinkExternal,
} from "@bds-libs/uikit";
import { VipIfo } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import useToast from "hooks/useToast";
import { useTranslation } from "contexts/Localization";
import { EnableStatus } from "./types";
import Timer from "./Timer";
import { getBscScanLink } from "../../../../utils";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { formatNumber } from "utils/formatBalance";
import IfoPoolCard from "./IfoPoolCard";

interface IfoFoldableCardProps {
  ifo: VipIfo;
  publicIfoData: PublicIfoData;
  walletIfoData?: WalletIfoData;
  isInitiallyVisible: boolean;
}

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
  color: white;

  svg {
    fill: white;
  }
`;

const IfoFoldableCard: React.FC<IfoFoldableCardProps> = ({
  ifo,
  publicIfoData,
  walletIfoData,
  isInitiallyVisible,
}) => {
  const [isVisible, setIsVisible] = useState(isInitiallyVisible);
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();
  // const raisingTokenContract = useERC20(getAddress(ifo.currency.address));
  const isActive = publicIfoData.status !== "finished" && ifo.isActive;
  // const { contract } = walletIfoData;
  // const onApprove = useIfoApprove(raisingTokenContract, contract.address);
  const { toastSuccess } = useToast();

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
                  {t("Total sale:")} {formatNumber(ifo.lpAmount, 1)}{" "}
                  {ifo.token.symbol}
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
          <CardsWrapper singleCard={false}>
            {ifo.pools.map((o) => {
              return (
                <IfoPoolCard
                  key={o.pid}
                  ifo={ifo}
                  poolConfig={o}
                  publicIfoData={publicIfoData}
                  walletIfoData={walletIfoData}
                />
              );
            })}
          </CardsWrapper>
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
