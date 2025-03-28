import React, { useState } from "react";
import styled from "styled-components";
import { ExpandableLabel, Flex, FlexProps, Box } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

interface FoldableTextProps extends FlexProps {
  title?: string;
}

const Wrapper = styled(Flex)`
  cursor: pointer;
`;

const StyledExpandableLabelWrapper = styled(Flex)`
  button {
    align-items: center;
    justify-content: flex-start;
  }
`;

const StyledChildrenFlex = styled(Flex)<{ isExpanded?: boolean }>`
  overflow: hidden;
  height: ${({ isExpanded }) => (isExpanded ? "100%" : "0px")};
  padding-bottom: ${({ isExpanded }) => (isExpanded ? "16px" : "0px")};
  border-bottom: 1px solid ${({ theme }) => theme.colors.inputSecondary};
`;

const FoldableText: React.FC<FoldableTextProps> = ({
  title,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Wrapper
      {...props}
      flexDirection="column"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Flex justifyContent="space-between" alignItems="center" pb="0px">
        <Box
          fontSize={{
            _: "12px",
            xl: "12px",
          }}
          lineHeight={{
            _: "24px",
          }}
          fontWeight="bold"
        >
          {title}
        </Box>
        <StyledExpandableLabelWrapper>
          <ExpandableLabel
            expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box
              fontSize={{
                _: "12px",
                xl: "12px",
              }}
              color="textSubtle"
            >
              {isExpanded ? t("Hide") : t("Details")}
            </Box>
          </ExpandableLabel>
        </StyledExpandableLabelWrapper>
      </Flex>
      <StyledChildrenFlex isExpanded={isExpanded} flexDirection="column">
        {children}
      </StyledChildrenFlex>
    </Wrapper>
  );
};

export default FoldableText;
