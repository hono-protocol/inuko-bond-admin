import React from "react";
import styled from "styled-components";
import {
  Text,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Flex,
} from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import FoldableText from "components/FoldableText";
import config from "./config";

const ImageWrapper = styled.div`
  flex: none;
  order: 2;
  max-width: 414px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 1;
  }
`;

const DetailsWrapper = styled.div`
  order: 1;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    order: 2;
    margin-bottom: 0;
    margin-left: 40px;
  }
`;

const StyledHeader = styled(CardHeader)`
  background: #0a4635;
`;

const StyledCardBody = styled(CardBody)`
  background: #052e22;
`;

const IfoQuestions = () => {
  const { t } = useTranslation();

  return (
    <Flex
      mt={["0px", null, null, "50px"]}
      alignItems={["center", null, null, "start"]}
      flexDirection={["column", null, null, "row"]}
    >
      <ImageWrapper>
        <img src="/images/itos/banner_detail.png" alt="" />
      </ImageWrapper>
      <DetailsWrapper>
        <Card>
          <StyledHeader>
            <Heading textAlign="center" scale="lg" color="textSubtle">
              {t("Details")}
            </Heading>
          </StyledHeader>
          <StyledCardBody>
            {config.map(({ title, description }, i, { length }) => (
              <FoldableText
                key={title}
                id={title}
                mb={i + 1 === length ? "" : "10px"}
                title={t(title)}
              >
                {description.map((desc) => {
                  return (
                    <Text key={desc} color="#9BCABB" fontSize="12px" as="p">
                      {t(desc)}
                    </Text>
                  );
                })}
              </FoldableText>
            ))}
          </StyledCardBody>
        </Card>
      </DetailsWrapper>
    </Flex>
  );
};

export default IfoQuestions;
