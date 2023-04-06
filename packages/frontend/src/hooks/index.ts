import { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-query";
import { isAddress } from "utils";
import BigNumber from "bignumber.js";
import uniqBy from "lodash/uniqBy";
import format from "date-fns/format";

import ERC20ABI from "../config/abi/erc20.json";
import AGGABI from "../config/abi/aggregator_abi.json";
import {
  useContract,
  useExpiryTellerContract,
  useTermTellerContract,
} from "./useContract";
import EXPIRY_SDA_ABI from "config/abi/expirySda.json";
import {
  AGGREGATOR_ADDRESS,
  EXPIRY_SDA_ADDRESS,
  TERM_SDA_ADDRESS,
} from "config/constants";
import useToast from "./useToast";
import { Contract } from "ethers";
import { ERC20_ABI } from "config/abi/erc20";
import { fetch1155Txs } from "./graph";

export const useGeckoList = () => {
  return useQuery(
    "PRICE LIST",
    async () => {
      const data = await fetch("https://api.coingecko.com/api/v3/coins/list");
      return data?.json();
    },
    {
      staleTime: 30 * 60 * 1000, // 30 minutes
      onError: (err) => {
        console.log("err", err);
      },
    }
  );
};

export const useGeckoPrices = () => {
  return useQuery(
    "PRICE LIST",
    async () => {
      const data = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"
      );
      return data?.json();
    },
    {
      staleTime: 60 * 1000, // 1 minute
    }
  );
};

export const useTokenDetail = (address?: string) => {
  const [data, setData] =
    useState<{ symbol?: string; decimals?: number; price?: any }>();
  const [loading, setLoading] = useState(false);
  const tokenContract = useContract(address, ERC20ABI, true);
  const { data: coinList } = useGeckoList();

  const fetchData = useCallback(async () => {
    if (!isAddress(address) || !coinList) {
      return setData(undefined);
    }

    try {
      setLoading(true);
      const decimals = await tokenContract.decimals();
      const symbol = await tokenContract.symbol();
      const coinId = coinList.find((o) => {
        // TODO: remove this
        if (symbol === "BUSD 1" || symbol === "BUSD 2") {
          return o.symbol === "busd";
        }
        // TODO: find a way to fix this exceptional case when 2 tokens same symbol
        if (symbol === "LIQ") {
          return o.id === "liquidus";
        }

        return o.symbol?.toLowerCase() === symbol?.toLowerCase();
      })?.id;
      const coinRes = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${format(
          new Date(),
          "dd-MM-yyyy"
        )}`
      );
      const coin = await coinRes?.json();

      setData({
        decimals,
        symbol,
        price: coin?.market_data?.current_price?.usd,
      });
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [address, coinList]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
  };
};

export const useGetBondPrice = (id: number, quote: any, payout: any) => {
  const [realRate, setRealRate] = useState(new BigNumber(0));
  const aggContract = useContract(AGGREGATOR_ADDRESS, AGGABI, true);

  const fetchData = useCallback(async () => {
    if (!quote || !payout) {
      return;
    }

    const marketPrice = await aggContract.marketPrice(id);
    const realRate = new BigNumber(1).dividedBy(
      new BigNumber(marketPrice.toString()).dividedBy(
        new BigNumber(10).pow(
          new BigNumber(payout.decimals)
            .minus(quote.decimals)
            .dividedBy(2)
            .plus(36)
        )
      )
    );
    setRealRate(realRate);
  }, [quote, payout, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    rate: realRate,
    bondPrice: new BigNumber(1)
      .dividedBy(realRate)
      .multipliedBy(quote?.price || 0),
  };
};

export const useGetMarketDetail = (id: number, type: string) => {
  const [data, setData] = useState<any>();
  const { toastError } = useToast();

  const addr = type === "expiry" ? EXPIRY_SDA_ADDRESS : TERM_SDA_ADDRESS;
  const contract = useContract(addr, EXPIRY_SDA_ABI, true);

  const fetchData = useCallback(async () => {
    try {
      const res = await contract.markets(id);
      setData(res);
    } catch (err) {
      toastError(err.toString());
    }
  }, [contract, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { marketDetail: data };
};

export const useGetExpiryBonded = (id, account, library, type) => {
  const [bondTk, setBondToken] =
    useState<{ address: string; decimals: number }>();
  const [amount, setAmount] = useState(new BigNumber(0));
  const contract = useExpiryTellerContract();
  const fetchData = useCallback(async () => {
    try {
      if (!account || type === "term") {
        return;
      }
      const bondTk = await contract.getBondTokenForMarket(id);
      const tkContract = new Contract(bondTk, ERC20_ABI, library);
      const decimals = await tkContract.decimals();
      const balance = await tkContract.balanceOf(account);
      setBondToken({
        address: bondTk,
        decimals,
      });
      setAmount(
        new BigNumber(balance?.toString() || "0").dividedBy(
          new BigNumber(10).pow(decimals)
        )
      );
    } catch (err) {
      console.log("err", err);
    }
  }, [account, id, library, type, contract]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    bondTk,
    amount,
    fetchData,
  };
};

export const useGetTermBonded = (id, account, type) => {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      if (!account || type === "expiry") {
        return;
      }
      const all = await fetch1155Txs(account);
      const latest = uniqBy(all.data.transferSingles, "tokenId");
      // setData(latest);
      setData(
        latest.map((o: any) => {
          return {
            ...o,
            renderId: `${new Date().getTime()}_${o.id}`,
          };
        })
      );
    } catch (err) {
      console.log("err", err);
    }
  }, [account, id, type]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, fetchData };
};

export const useBalanceOfTermBonded = (tokenId, account) => {
  const [amount, setAmount] = useState(new BigNumber(0));
  const [meta, setMeta] = useState<any>();
  const termTeller = useTermTellerContract();

  const fetchData = useCallback(async () => {
    try {
      if (!account) {
        return;
      }

      const amount = await termTeller.balanceOf(account, tokenId);
      if (new BigNumber(amount.toString()).eq(0)) {
        return setAmount(new BigNumber(0));
      }
      const metadata = await termTeller.tokenMetadata(tokenId);
      setAmount(
        new BigNumber(amount.toString()).dividedBy(
          new BigNumber(10).pow(metadata.decimals)
        )
      );
      setMeta(metadata);
    } catch (err) {
      console.log("err", err);
    }
  }, [tokenId, account]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    amount,
    meta,
    fetchData,
  };
};

export const useFetchListBonds = () => {
  const [data, setData] = useState([]);
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(process.env.REACT_APP_BOND_LIST_API);
      const resData = await res.json();

      setData(resData);
    } catch (err) {
      console.log("err", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
  };
};

export const useFetchBondId = (id: string) => {
  const [data, setData] = useState<any>();
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(process.env.REACT_APP_BOND_LIST_API);
      const resData = await res.json();

      setData(resData?.find((o) => o.id == id));
    } catch (err) {
      console.log("err", err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
  };
};
