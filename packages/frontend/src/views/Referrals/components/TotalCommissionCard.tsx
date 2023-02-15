import React from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { useGetReferralInfo } from "state/hooks";

const StyledLotteryCard = styled(Card)`
  background-color: #052e22;
`;

const TotalCommissionCard = () => {
  const { t } = useTranslation();
  const referralsInfo = useGetReferralInfo();

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading size="lg" color="textSubtle" mb="8px">
          {t("Referral Commissions")}
        </Heading>
        <Text fontSize="12px">
          {t(
            "1% commission fee will be transferred to your wallet when your friend harvests the rewards."
          )}
        </Text>
        <Text bold color="#FFAE58">
          {referralsInfo.totalReferralCommissions} BDS
        </Text>
      </CardBody>
    </StyledLotteryCard>
  );
};

export default TotalCommissionCard;
