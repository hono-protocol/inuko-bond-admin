import { useGetApiPrices } from "./state/hooks";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useActiveWeb3React from "./hooks/useActiveWeb3React";
import { Contract } from "ethers";
import lpAbi from "./config/abi/lpToken.json";
import ercAbi from "./config/abi/erc20.json";

export function useLPPrice(lp: string) {
  const prices = useGetApiPrices();
  const [price, setPrice] = useState(new BigNumber(0));
  const { library } = useActiveWeb3React();

  useEffect(() => {
    async function calc(lpAdd: string, provider: any) {
      const contract = new Contract(lpAdd, lpAbi, provider);

      const [token0, lpTotalSupply] = await Promise.all([
        contract.token0(),
        contract.totalSupply(),
      ]);

      const contractToken0 = new Contract(token0, ercAbi, provider);

      const [balanceTokenLP, decimals] = await Promise.all([
        contractToken0.balanceOf(lpAdd),
        contractToken0.decimals(),
      ]);

      const price = prices?.[token0.toLowerCase()] || 0;

      const quoteTokenToMultiplyQuoteTokenPrice = new BigNumber(
        balanceTokenLP.toString()
      )
        .div(new BigNumber(10).pow(decimals))
        .times(2)
        .div(
          new BigNumber(lpTotalSupply.toString()).div(new BigNumber(10).pow(18))
        );

      const lpTokenPrice =
        new BigNumber(quoteTokenToMultiplyQuoteTokenPrice).times(price) ||
        new BigNumber(0);

      return lpTokenPrice;
    }

    calc(lp, library)
      .then((r) => {
        setPrice(r);
      })
      .catch((e) => {
        console.log(e);
        setPrice(new BigNumber(0));
      });
  }, [lp, library, prices]);

  return {
    price,
  };
}
