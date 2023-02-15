import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "utils/bigNumber";
import { useCakeVaultContract } from "hooks/useContract";
import useActiveWeb3React from "hooks/useActiveWeb3React";

const useGetVaultUserInfo = (lastUpdated?: number) => {
  const { account } = useActiveWeb3React();
  const cakeVaultContract = useCakeVaultContract();
  const [userInfo, setUserInfo] = useState({
    shares: BIG_ZERO,
    cakeAtLastUserAction: BIG_ZERO,
    lastDepositedTime: "",
    lastUserActionTime: "",
  });

  useEffect(() => {
    //   user-specific vault contract fetches
    const fetchUserVaultInfo = async () => {
      const userContractInfo = await cakeVaultContract.methods
        .userInfo(account)
        .call();
      setUserInfo({
        shares: new BigNumber(userContractInfo.shares),
        cakeAtLastUserAction: new BigNumber(
          userContractInfo.cakeAtLastUserAction
        ),
        lastDepositedTime: userContractInfo.lastDepositedTime,
        lastUserActionTime: userContractInfo.lastUserActionTime,
      });
    };

    if (account) {
      fetchUserVaultInfo();
    }
  }, [account, cakeVaultContract, lastUpdated]);

  return userInfo;
};

export default useGetVaultUserInfo;
