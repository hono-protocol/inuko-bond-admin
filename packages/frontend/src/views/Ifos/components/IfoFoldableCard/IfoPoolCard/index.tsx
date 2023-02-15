import React from "react";
import { useTranslation } from "contexts/Localization";
import {
  Card,
  CardBody,
  CardHeader,
  Text,
  useTooltip,
  WarnIcon,
  Flex,
  Box,
} from "@bds-libs/uikit";
import { Ifo, PoolIds } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import { EnableStatus } from "../types";
import IfoCardTokens from "./IfoCardTokens";
import IfoCardActions from "./IfoCardActions";
import IfoCardDetails from "./IfoCardDetails";
import styled from "styled-components";

interface IfoCardProps {
  poolId: PoolIds;
  ifo: Ifo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
  onApprove: () => Promise<any>;
  enableStatus: EnableStatus;
}

interface CardConfig {
  [key: string]: {
    title: string;
    sub: string;
    variant: "blue" | "violet";
    tooltip: string;
  };
}

const StyledCardHeader = styled(CardHeader)<{ sale: PoolIds }>`
  background: ${({ theme, sale }) => {
    return sale === PoolIds.poolUnlimited
      ? theme.colors.textSubtle
      : theme.colors.primary;
  }};
  color: ${({ theme, sale }) => {
    return sale === PoolIds.poolUnlimited ? "#052E22" : "#fff";
  }};

  svg {
    fill: ${({ theme, sale }) => {
      return sale === PoolIds.poolUnlimited ? "#052E22" : "#fff";
    }};
  }

  [data-sub] {
    color: ${({ theme, sale }) => {
      return sale === PoolIds.poolUnlimited
        ? "#000"
        : theme.colors.primaryBright;
    }};
  }
`;

const StyledCardBody = styled(CardBody)`
  background: #0a4635;
`;

const StyledCard = styled(Card)`
  background: #0a4635;
`;

const SmallCard: React.FC<IfoCardProps> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  onApprove,
  enableStatus,
}) => {
  const { t } = useTranslation();

  const cardConfig: CardConfig = {
    [PoolIds.poolBasic]: {
      title: "Basic Sale",
      sub: t("Can participate with limited amount"),
      variant: "blue",
      tooltip:
        "Every person can only commit a limited amount, but may expect a higher return per token committed.",
    },
    [PoolIds.poolUnlimited]: {
      title: "Unlimited Sale",
      sub: t("Can participate with unlimited amount"),
      variant: "violet",
      tooltip:
        "No limits on the amount you can commit. Additional fee applies when claiming.",
    },
  };

  const config = cardConfig[poolId];
  const { targetRef, tooltip, tooltipVisible } = useTooltip(t(config.tooltip), {
    placement: "bottom",
  });

  const isLoading = publicIfoData.status === "idle";

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <StyledCardHeader sale={poolId} variant={config.variant}>
          <Flex justifyContent="center" alignItems="center">
            <Box
              fontWeight="900"
              fontSize={{
                _: "17px",
                lg: "25px",
              }}
              lineHeight={{
                _: "19px",
                lg: "27px",
              }}
            >
              {t(config.title)}
            </Box>

            <Box ml="8px" ref={targetRef}>
              <WarnIcon />
            </Box>
          </Flex>
          <Box
            mt="3px"
            data-sub
            textAlign="center"
            fontWeight="500"
            color="primaryBright"
            fontSize={{ _: "13px", lg: "15px" }}
            lineHeight={{ _: "15px", lg: "17px" }}
          >
            {t(config.sub)}
          </Box>
        </StyledCardHeader>
        <StyledCardBody>
          <IfoCardTokens
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            hasProfile={true}
            isLoading={isLoading}
            onApprove={onApprove}
            enableStatus={enableStatus}
          />
          <IfoCardActions
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            hasProfile={true}
            isLoading={isLoading}
          />
          <IfoCardDetails
            poolId={poolId}
            ifo={ifo}
            publicIfoData={publicIfoData}
          />
        </StyledCardBody>
      </StyledCard>
    </>
  );
};

export default SmallCard;
