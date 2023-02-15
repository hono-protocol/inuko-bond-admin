import BigNumber from "bignumber.js";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import useLastUpdated from "hooks/useLastUpdated";
import { FetchStatus } from "hooks/useTokenBalance";
import React, { useEffect, useState } from "react";
import { BIG_ZERO } from "utils/bigNumber";
import { simpleRpcProvider } from "utils/providers";

const BnbContext = React.createContext(null);

const BnbContextProvider = ({ children }) => {
  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED);
  const { account } = useActiveWeb3React();
  const [balance, setBalance] = useState(BIG_ZERO);
  const { lastUpdated, setLastUpdated } = useLastUpdated();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const walletBalance = await simpleRpcProvider.getBalance(account);
        setBalance(new BigNumber(walletBalance.toString()));
        setFetchStatus(FetchStatus.SUCCESS);
      } catch {
        setFetchStatus(FetchStatus.FAILED);
      }
    };

    if (account) {
      fetchBalance();
    }

    const interval = setInterval(() => {
      if (account) {
        fetchBalance();
      }
    }, 6000);

    return () => {
      interval && clearInterval(interval);
    };
  }, [account, lastUpdated, setBalance, setFetchStatus]);

  return (
    <BnbContext.Provider
      value={{ balance, fetchStatus, refresh: setLastUpdated }}
    >
      {children}
    </BnbContext.Provider>
  );
};

export { BnbContext, BnbContextProvider };
