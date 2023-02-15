import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { Contract } from "ethers";
import { BIG_ZERO } from "utils/bigNumber";
import useActiveWeb3React from "hooks/useActiveWeb3React";

// Retrieve IFO allowance
const useIfoAllowance = (
  tokenContract: Contract,
  spenderAddress: string,
  dependency?: any
): BigNumber => {
  const { account } = useActiveWeb3React();
  const [allowance, setAllowance] = useState(BIG_ZERO);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await tokenContract.allowance(account, spenderAddress);
        setAllowance(new BigNumber(res.toString()));
      } catch (e) {
        console.error(e);
      }
    };

    if (account) {
      fetch();
    }
  }, [account, spenderAddress, tokenContract, dependency]);

  return allowance;
};

export default useIfoAllowance;
