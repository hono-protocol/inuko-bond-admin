import React from "react";
import styled from "styled-components";
import { ChevronDownIcon, ChevronUpIcon, Text } from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";

export interface ExpandableSectionButtonProps {
  onClick?: () => void;
  expanded?: boolean;
  className?: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({
  onClick,
  expanded,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper
      aria-label="Hide or show expandable content"
      role="button"
      onClick={() => onClick()}
      className={className}
    >
      <Text color="primary" fontWeight={900}>
        {expanded ? t("Hide") : t("Details")}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  );
};

ExpandableSectionButton.defaultProps = {
  expanded: false,
};

export default ExpandableSectionButton;
