import React from "react";
import styled from "styled-components";
import {
  Text,
  Button,
  Input,
  InputProps,
  Flex,
  Link,
  Box,
} from "@bds-libs/uikit";
import { useTranslation } from "contexts/Localization";
import { formatNumber } from "../../utils/formatBalance";

interface ModalInputProps {
  balancePrice?: string;
  valuePrice?: string;
  max: string;
  min?: string;
  symbol: string;
  onSelectMax?: () => void;
  onSelectMin?: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  placeholder?: string;
  value: string;
  addLiquidityUrl?: string;
  inputTitle?: string;
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  return theme.shadows.inset;
};

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 16px 8px 0;
  width: 100%;
`;

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin: 0 8px;
  padding: 0 8px;
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.primary};

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`;

const StyledErrorMessage = styled(Text)`
  position: absolute;
  bottom: -22px;
  a {
    display: inline;
  }
`;

const ModalInput: React.FC<ModalInputProps> = ({
  balancePrice,
  valuePrice,
  max,
  min,
  symbol,
  onChange,
  onSelectMax,
  onSelectMin,
  value,
  addLiquidityUrl,
  inputTitle,
}) => {
  const { t } = useTranslation();
  const isBalanceZero = max === "0" || !max;

  const displayBalance = (balance: string) => {
    return formatNumber(balance, 12);
  };

  return (
    <div style={{ position: "relative" }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
          <Box>
            <Text fontSize="14px">
              {t("Balance")}: {displayBalance(max)}
            </Text>
            <Text textAlign="right" fontSize="12px">
              {balancePrice && <span>~{balancePrice || "-"} USDT</span>}
            </Text>
          </Box>
        </Flex>
        {valuePrice && (
          <Box pl="16px" mb="8px">
            <Text textAlign="left" fontSize="12px">
              ~{valuePrice || "-"} USDT
            </Text>
          </Box>
        )}
        <Flex alignItems="flex-end" justifyContent="space-around">
          <StyledInput
            pattern="^[0-9]*[.,]?[0-9]*$"
            inputMode="decimal"
            step="any"
            min="0"
            onChange={onChange}
            placeholder="0"
            value={value}
          />
          {!!min && (
            <Button scale="sm" onClick={onSelectMin} mr="8px">
              {t("Min")}
            </Button>
          )}
          <Button
            style={{ backgroundColor: "#FFAE58" }}
            scale="sm"
            onClick={onSelectMax}
            mr="8px"
          >
            {t("Max")}
          </Button>
          {!min && <Text fontSize="16px">{symbol}</Text>}
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          No tokens to stake:{" "}
          <Link
            fontSize="14px"
            bold={false}
            href={addLiquidityUrl}
            external
            color="failure"
          >
            {t("get")} {symbol}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  );
};

export default ModalInput;
