import React from "react";
import { Box } from "@bds-libs/uikit";
import CurrencyLogo from "../Logo/CurrencyLogo";
import { Token } from "@pancakeswap/sdk";
import { Contract, ethers } from "ethers";
import ercAbi from "../../config/abi/erc20.json";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import { formatNumber, getBalanceNumber } from "utils/formatBalance";
import useRefresh from "../../hooks/useRefresh";
import gswapABI from "../../config/abi/gswap.json";
import { getAddress } from "../../utils/addressHelpers";
import tokens from "../../config/constants/tokens";
import BigNumber from "bignumber.js";
import { formatUnits } from "ethers/lib/utils";
import contracts from "config/constants/contracts";
import { usePriceCakeBusd } from "state/hooks";

export interface LPRatioProps {
  token0: Token;
  totalSupply: number;
  withLabel?: boolean;
}

function TokenGswap(props: LPRatioProps) {
  const [ratio, setRatio] = React.useState("0");
  const [ratioUSDT, setRatioUSDT] = React.useState("0");
  const [burned, setBurned] = React.useState(0);
  const bdsPrice = usePriceCakeBusd();

  const { slowRefresh } = useRefresh();

  const { token0, totalSupply, withLabel } = props;

  const { library } = useActiveWeb3React();

  React.useEffect(() => {
    async function action() {
      const contractToken0 = new Contract(token0.address, ercAbi, library);

      const gswapContract = new ethers.Contract(
        getAddress(contracts.gswap),
        gswapABI,
        library
      );

      const [burned, usdtCalc] = await Promise.all([
        contractToken0.balanceOf("0x000000000000000000000000000000000000dEaD"),
        gswapContract.calculateAmountIn(
          token0.address,
          new BigNumber("1")
            .multipliedBy(new BigNumber(10).pow(token0.decimals))
            .toString()
        ),
      ]);

      setBurned(getBalanceNumber(burned.toString(), token0.decimals));

      setRatio(
        formatNumber(
          +formatUnits(usdtCalc.toString(), tokens.usdt.decimals) /
            bdsPrice.toNumber(),
          4
        ).toString()
      );

      setRatioUSDT(
        formatNumber(
          formatUnits(usdtCalc.toString(), tokens.usdt.decimals),
          4
        ).toString()
      );
    }

    action();
  }, [token0, library, slowRefresh, bdsPrice]);

  return (
    <Box>
      {withLabel && (
        <Box
          px="24px"
          display="flex"
          alignItems="center"
          fontSize={{ _: "12px", lg: "14px" }}
          fontWeight="700"
          lineHeight="24px"
          color="#fff"
        >
          <Box
            flexGrow={0}
            flexShrink={0}
            flexBasis="20%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            Token
          </Box>
          <Box textAlign="center" flexGrow={0} flexShrink={0} flexBasis="50%">
            Total Supply/ Max Supply
          </Box>
          <Box
            flexGrow={0}
            flexShrink={0}
            flexBasis="15%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            USDT
          </Box>
          <Box
            flexGrow={0}
            flexShrink={0}
            flexBasis="15%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            BDS
          </Box>
        </Box>
      )}
      <Box
        py="10px"
        px="24px"
        bg="#052D22"
        borderRadius="15px"
        display="flex"
        alignItems="center"
      >
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="20%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box position="relative" display="flex" justifyContent="center">
            <CurrencyLogo
              style={{
                zIndex: 2,
                position: "relative",
                maxWidth: "32px",
              }}
              size="32px"
              currency={token0}
            />
          </Box>
          <Box
            as="p"
            ml="11px"
            fontSize={{ _: "12px", lg: "14px" }}
            lineHeight="24px"
            fontWeight="700"
            color="text"
            minWidth="40px"
          >
            {token0.symbol}
          </Box>
        </Box>
        <Box
          textAlign="center"
          flexGrow={0}
          flexShrink={0}
          flexBasis="50%"
          fontSize={{ _: "12px", lg: "14px" }}
          fontWeight="700"
          lineHeight="24px"
          color="primaryBright"
        >
          {formatNumber(totalSupply - burned)} /{formatNumber(totalSupply)}
        </Box>
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="15%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">
            <Box
              display="block"
              as="strong"
              fontSize={{ _: "12px", lg: "14px" }}
              lineHeight="20px"
              fontWeight="700"
              color="secondary"
            >
              {ratioUSDT}
            </Box>
          </Box>
        </Box>
        <Box
          flexGrow={0}
          flexShrink={0}
          flexBasis="15%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box textAlign="center">
            <Box
              display="block"
              as="strong"
              fontSize={{ _: "12px", lg: "14px" }}
              lineHeight="20px"
              fontWeight="700"
              color="secondary"
            >
              {ratio}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TokenGswap;
