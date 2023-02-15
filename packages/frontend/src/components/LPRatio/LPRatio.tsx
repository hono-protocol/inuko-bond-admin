import React from "react";
import { Box } from "@bds-libs/uikit";
import CurrencyLogo from "../Logo/CurrencyLogo";
import { Token } from "@pancakeswap/sdk";
import { Contract } from "ethers";
import ercAbi from "../../config/abi/erc20.json";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { formatUnits } from "ethers/lib/utils";
import BigNumber from "bignumber.js";
import { formatNumber } from "utils/formatBalance";
import useRefresh from "../../hooks/useRefresh";

export interface LPRatioProps {
  token0: Token;
  token1: Token;
  address: string;
}

function LPRatio(props: LPRatioProps) {
  const [ratio, setRatio] = React.useState("0");

  const { slowRefresh } = useRefresh();

  const { token0, token1, address } = props;

  const { library } = useActiveWeb3React();

  React.useEffect(() => {
    async function action() {
      const contractToken0 = new Contract(token0.address, ercAbi, library);
      const contractToken1 = new Contract(token1.address, ercAbi, library);

      const [balanceTokenLP0, balanceTokenLP1] = await Promise.all([
        contractToken0.balanceOf(address),
        contractToken1.balanceOf(address),
      ]);

      setRatio(
        formatNumber(
          new BigNumber(
            formatUnits(balanceTokenLP1.toString(), token1.decimals)
          )
            .div(
              new BigNumber(
                formatUnits(balanceTokenLP0.toString(), token0.decimals)
              )
            )
            .toString(),
          3
        ).toString()
      );
    }
    action();
  }, [token0, token1, library, slowRefresh]);

  return (
    <Box
      py="10px"
      px="24px"
      mt="10px"
      bg="#052D22"
      borderRadius="15px"
      display="flex"
      alignItems="center"
    >
      <Box position="relative" display="flex">
        <CurrencyLogo
          style={{
            zIndex: 2,
            position: "relative",
          }}
          size="32px"
          currency={token0}
        />
        <CurrencyLogo
          style={{
            zIndex: 1,
            position: "relative",
            left: "-10px",
          }}
          size="32px"
          currency={token1}
        />
      </Box>
      <Box
        as="p"
        ml="11px"
        fontSize="18px"
        lineHeight="24px"
        fontWeight="700"
        color="secondary"
        minWidth="60px"
      >
        {token0.symbol}/{token1.symbol}
      </Box>
      <Box ml="auto" display="flex" alignItems="center">
        <Box textAlign="right">
          <Box
            display="block"
            as="strong"
            fontSize="18px"
            lineHeight="20px"
            fontWeight="700"
            color="#fff"
          >
            {ratio}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default LPRatio;
