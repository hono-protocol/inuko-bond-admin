import React from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { useGetReferralInfo } from "state/hooks";

const StyledLotteryCard = styled(Card)`
  background-color: #052e22;
`;

const TotalReferralCard = () => {
  const { t } = useTranslation();
  const referralsInfo = useGetReferralInfo();

  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading color="textSubtle" size="lg" mb="8px">
          {t("Total Referrals")}
        </Heading>
        <Text fontSize="12px">
          {t(
            "The number of your referral is calculated when your friends deposit into the Farm, Pool."
          )}
        </Text>
        <Text bold color="#FFAE58">
          {referralsInfo.referralsCount} Users
        </Text>
      </CardBody>
    </StyledLotteryCard>
  );
};

export default TotalReferralCard;
