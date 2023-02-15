import React from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Flex, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import CopyToClipboard from "./CopyClipload";
import useActiveWeb3React from "hooks/useActiveWeb3React";

const StyledLotteryCard = styled(Card)`
  background-color: #052e22;
`;

const MyReferralLinkCard = () => {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();

  // @todo link
  const domain = `${window.origin}/?ref=`;
  const referralLink = domain + account;
  return (
    <StyledLotteryCard>
      <CardBody>
        <Heading size="lg" color="textSubtle" mb="8px">
          {t("My Referral Link")}
        </Heading>
        <Heading style={{ fontSize: "12px" }} color="white" mb="8px">
          {t(
            "Send your wallet address to your friends and add into Referrals, or send this link to ref on Web"
          )}
        </Heading>
        <Flex mb="8px">
          <Box width="100%">
            <CopyToClipboard toCopy={referralLink}>
              {referralLink}
            </CopyToClipboard>
          </Box>
        </Flex>
      </CardBody>
    </StyledLotteryCard>
  );
};

export default MyReferralLinkCard;
