import React, { Fragment, memo } from "react";
import { Trade } from "@pancakeswap/sdk";
import { Text, Flex, ChevronRightIcon, darkColors } from "@bds-libs/uikit";
import { unwrappedToken } from "utils/wrappedCurrency";

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <Flex
      flexWrap="wrap"
      width="100%"
      justifyContent="flex-end"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          <Fragment key={i}>
            <Flex alignItems="end">
              <Text
                fontSize="14px"
                ml="0.125rem"
                mr="0.125rem"
                color={darkColors.black}
              >
                {currency.symbol}
              </Text>
            </Flex>
            {!isLastItem && (
              <ChevronRightIcon color={darkColors.black} width="12px" />
            )}
          </Fragment>
        );
      })}
    </Flex>
  );
});
