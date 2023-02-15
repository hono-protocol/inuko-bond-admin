import React from "react";
import { SvgProps } from "../../../components/Svg";
import Flex from "../../../components/Box/Flex";
import Dropdown from "../../../components/Dropdown/Dropdown";
import Link from "../../../components/Link/Link";
import * as IconModule from "../icons";
import { socials } from "../config";
import { darkColors } from "../../../theme";

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> };

// @todo link
const SocialLinks: React.FC = () => (
  <Flex width="100%" alignItems="center" flexWrap="wrap">
    {socials.map((social, index) => {
      const Icon = Icons[social.icon];
      const iconProps = {
        width: "auto",
        height: "20px",
        color: darkColors.black,
        style: { cursor: "pointer" },
      };
      const mr = index < socials.length - 1 ? "12px" : 0;
      if (social.items) {
        return (
          <Dropdown
            key={social.label}
            position="top"
            target={<Icon {...iconProps} pr={mr} />}
          >
            {social.items.map((item) => (
              <Link
                external
                key={item.label}
                href={item.href}
                aria-label={item.label}
                color="textSubtle"
              >
                {item.label}
              </Link>
            ))}
          </Dropdown>
        );
      }
      return (
        <Flex width="33%" key={social.label} justifyContent="center" mb="5px">
          <Link external href={social.href} aria-label={social.label} mr={mr}>
            <Icon {...iconProps} />
          </Link>
        </Flex>
      );
    })}
  </Flex>
);

export default React.memo(SocialLinks, () => true);
