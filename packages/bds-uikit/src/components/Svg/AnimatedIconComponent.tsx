import React from "react";
import * as IconModule from ".";
import { StyledAnimatedIconComponent, StyledIconContainer } from "./styles";
import { IconComponentType, SvgProps } from "./types";

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const AnimatedIconComponent: React.FC<IconComponentType> = ({
  iconName,
  color = "textSubtle",
  activeColor = "secondary",
  activeBackgroundColor = "transparent",
  isActive = false,
  className,
  ...props
}) => {
  const IconElement = Icons[`${iconName}`];
  const IconElementFill = Icons[`${iconName}FillIcon`];
  const hasFillIcon = IconElementFill !== undefined;
  return IconElement ? (
    <StyledAnimatedIconComponent
      className={className}
      isActive={isActive}
      hasFillIcon={hasFillIcon}
      {...props}
    >
      <StyledIconContainer activeBackgroundColor={activeBackgroundColor}>
        <IconElement color={color} />
      </StyledIconContainer>
      {hasFillIcon && (
        <StyledIconContainer
          activeBackgroundColor={activeBackgroundColor}
          {...props}
        >
          <IconElementFill color={activeColor} />
        </StyledIconContainer>
      )}
    </StyledAnimatedIconComponent>
  ) : null;
};

export default AnimatedIconComponent;
