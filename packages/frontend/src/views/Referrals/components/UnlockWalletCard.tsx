import React from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import UnlockButton from "components/UnlockButton";

const StyledCardBody = styled(CardBody)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  max-height: 196px;
`;

const StyledHeading = styled(Heading)`
  margin: 16px 0;
`;

const UnlockWalletCard = () => {
  const { t } = useTranslation();

  return (
    <Box maxWidth="600px" mx="auto">
      <Card>
        <StyledCardBody>
          {/* <IconWrapper>
          <Ticket />
        </IconWrapper> */}
          <div>
            <StyledHeading size="md">
              {t("Unlock wallet to get your unique referral link")}
            </StyledHeading>
            <UnlockButton />
          </div>
        </StyledCardBody>
      </Card>
    </Box>
  );
};

export default UnlockWalletCard;
