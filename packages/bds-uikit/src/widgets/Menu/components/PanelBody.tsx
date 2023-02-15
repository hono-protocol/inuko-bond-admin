import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { SvgProps } from "../../../components/Svg";
import * as IconModule from "../icons";
import Accordion from "./Accordion";
import { MenuEntry, LinkLabel, LinkStatus } from "./MenuEntry";
import MenuLink from "./MenuLink";
import { PanelProps, PushedProps } from "../types";
import { Box, Flex } from "../../../components/Box";
import AnimatedIconComponent from "../../../components/Svg/AnimatedIconComponent";
import { darkColors } from "../../../theme/colors";

interface Props extends PanelProps, PushedProps {
  isMobile: boolean;
}

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const PanelBody: React.FC<Props> = ({ isPushed, pushNav, isMobile, links }) => {
  const location = useLocation();

  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined;

  return (
    <Container>
      <Flex justifyContent="center">
        <img src="/inuko-logo.png" alt="inuko" />
      </Flex>
      {isPushed && (
        <Box
          mb="1rem"
          color="black"
          fontSize="48px"
          fontWeight="bold"
          textAlign="center"
        >
          Inuko
        </Box>
      )}
      {links.map((entry) => {
        if (entry.isSpacer) {
          return <Box height="100px" width="100px" />;
        }

        const Icon = Icons[entry.icon];
        const iconElement = <Icon width="18px" height="auto" mr="8px" />;
        const calloutClass = entry.calloutClass
          ? entry.calloutClass
          : undefined;

        if (entry.items) {
          const itemsMatchIndex = entry.items.findIndex(
            (item) => item.href === location.pathname
          );
          const initialOpenState =
            entry.initialOpenState === true
              ? entry.initialOpenState
              : itemsMatchIndex >= 0;

          return (
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={iconElement}
              label={entry.label}
              status={entry.status}
              initialOpenState={initialOpenState}
              className={calloutClass}
              isActive={entry.items.some(
                (item) => item.href === location.pathname
              )}
            >
              {isPushed &&
                entry.items.map((item) => (
                  <Box backgroundColor="#0A4635">
                    <MenuEntry
                      key={item.label}
                      secondary
                      isActive={item.href === location.pathname}
                      onClick={handleClick}
                      className="not-apply"
                    >
                      <MenuLink href={item.href}>
                        <Box display="flex" alignItems="center">
                          <LinkLabel isSub={true} isPushed={isPushed}>
                            {item.label}
                          </LinkLabel>
                          {!!item.icon && (
                            <AnimatedIconComponent
                              style={{
                                marginLeft: "10px",
                                fill: darkColors.black,
                              }}
                              iconName={item.icon}
                              height="22px"
                              width="21px"
                            />
                          )}
                        </Box>
                        {item.status && (
                          <LinkStatus color={item.status.color} fontSize="14px">
                            {item.status.text}
                          </LinkStatus>
                        )}
                      </MenuLink>
                    </MenuEntry>
                  </Box>
                ))}
            </Accordion>
          );
        }
        return (
          <MenuEntry
            key={entry.label}
            isActive={entry.href === location.pathname}
            className={calloutClass}
          >
            <Box
              display="flex"
              width="100%"
              as={!entry.isComing ? MenuLink : ("span" as any)}
              href={!entry.isComing ? entry.href : undefined}
              onClick={!entry.isComing ? handleClick : undefined}
            >
              <Box display="flex" alignItems="center" width="100%">
                {iconElement}
                <LinkLabel
                  isActive={entry.href === location.pathname}
                  isPushed={isPushed}
                >
                  <Box width="100%" display="flex" alignItems="center">
                    {entry.label}
                    {entry.isNew && (
                      <Box
                        marginLeft="auto"
                        borderRadius="16px"
                        py="6px"
                        px="14px"
                        background="#FFAE58"
                        color="#052E22"
                      >
                        New
                      </Box>
                    )}
                    {entry.isComing && (
                      <Box
                        marginLeft="auto"
                        borderRadius="16px"
                        py="6px"
                        px="14px"
                        background="#177358"
                        color="#9BCABB"
                      >
                        Coming
                      </Box>
                    )}
                  </Box>
                </LinkLabel>
                {entry.status && (
                  <LinkStatus color={entry.status.color} fontSize="14px">
                    {entry.status.text}
                  </LinkStatus>
                )}
              </Box>
            </Box>
          </MenuEntry>
        );
      })}
    </Container>
  );
};

export default PanelBody;
