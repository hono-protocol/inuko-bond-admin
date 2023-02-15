import React from "react";
import {
  CardHeader,
  Heading,
  Text,
  Flex,
  Image,
  Box,
  PoolHouseIcon,
  Tag,
} from "@bds-libs/uikit";
import styled from "styled-components";
import { useTranslation } from "contexts/Localization";
import { Token } from "config/constants/types";
import { getAddress } from "../../../utils/addressHelpers";

const Wrapper = styled(CardHeader)<{
  isFinished?: boolean;
}>`
  position: relative;
  padding: 0;
  height: 100px;
`;
const HeaderTransparent = styled.div<{
  bgImg?: string;
}>`
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 116px;
  padding: 16px;
  border-radius: 16px;
  background-color: rgba(100, 100, 100, 0.3);
`;
const Header = styled.div<{
  bgImg?: string;
}>`
  position: absolute;
  top: -16px;
  left: -16px;
  width: calc(100% + 32px);
  height: 116px;
  padding: 16px;
  border-radius: 16px;
  background: url(${({ bgImg }) => bgImg}) no-repeat center center;
  background-size: cover;
`;

const StyledCardHeader: React.FC<{
  earningToken: Token;
  stakingToken: Token;
  isAutoVault?: boolean;
  isFinished?: boolean;
  multiplier?: string;
  bgImg?: string;
  name?: string;
  url?: string;
}> = ({
  multiplier,
  earningToken,
  stakingToken,
  isFinished = false,
  isAutoVault = false,
  name,
  bgImg,
  url,
}) => {
  const { t } = useTranslation();

  //@todo handle beco
  const isCakePool =
    earningToken.symbol === "BECO" && stakingToken.symbol === "BECO";

  const getHeadingPrefix = () => {
    if (isAutoVault) {
      // vault
      return `${t("Auto")}`;
    }
    if (isCakePool) {
      // manual cake
      return `${t("Manual")}`;
    }
    // all other pools
    return `${t("Earn")}`;
  };

  return (
    <Wrapper isFinished={isFinished}>
      <Header bgImg={bgImg}>
        <HeaderTransparent />
        <Flex
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            padding: "16px",
          }}
          flexDirection="column"
          justifyContent="space-between"
          zIndex={1}
        >
          <Flex alignItems="center" width="100%">
            <Image
              width={32}
              height={32}
              src={`/images/tokens/${getAddress(
                stakingToken.address
              ).toLowerCase()}.png`}
              alt={stakingToken.symbol}
            />
            <Box flex="1" textAlign="center">
              <Text
                textAlign="center"
                fontWeight={900}
                fontSize="16px"
                color="white"
                style={{ textShadow: "1px 1px 1px #000" }}
              >
                {name}
              </Text>
            </Box>
          </Flex>
          <Box display="flex" mt="8px" justifyContent="space-between">
            <Box
              mt="8px"
              display="flex"
              justifyContent="flex-start"
              color="white"
              fontWeight="bold"
            >
              {multiplier}
            </Box>
            <Box
              mt="8px"
              display="flex"
              justifyContent="flex-start"
              color="white"
              as="a"
              href={url}
              target="_blank"
              style={{ cursor: "pointer" }}
            >
              <a href={url} target="_blank">
                {t("View Info")}
              </a>
            </Box>
          </Box>
        </Flex>
      </Header>
    </Wrapper>
  );
};

export default StyledCardHeader;
