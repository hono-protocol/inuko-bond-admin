import useToast from "hooks/useToast";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { fetchBondedTxs, fetchTermBondedTxs } from "./graph";
import { useGeckoList } from "hooks";
import { getBalance } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import format from "date-fns/format";
import reverse from "lodash/reverse";

// import { fetchBondedTx } from "./graph";

const fetchPrice = async (id: string, startDate: Date, endDate: Date) => {
  const startTime = startDate.getTime() / 1000;
  const endTime = endDate.getTime() / 1000;
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=usd&from=${startTime}&to=${endTime}`;
  const res = await fetch(url);
  return res.json();
};

export const useFetchBondedEvents = (id: number, type) => {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    if (!id) {
      return;
    }
    const res =
      type === "expiry"
        ? await fetchBondedTxs(id)
        : await fetchTermBondedTxs(id);
    setData(res?.data?.bondeds);
  }, [id, type]);

  useEffect(() => {
    fetchData();
  }, []);

  return { data, fetchData };
};

const findPriceNearDate = (date: Date, prices: any[]) => {
  // console.log("dasdasd", date, prices);
  let lastTime = prices[0][0];
  const dest = date.getTime();
  for (let i = 1; i < prices.length; i++) {
    const time = prices[i][0];

    if (dest <= time && dest >= lastTime) {
      // console.log("FOUND", dest, time, lastTime);
      return prices[i][1];
    } else {
      lastTime = time;
    }
  }
  // console.log("NOT FOUND", dest, prices);
  return prices[prices.length - 1][1];
};

const MAX_RANGE = 20;
export const useGetChartData = (quote: any, payout: any, rawEvents: any[]) => {
  const [data, setData] = useState([]);
  const { data: coinList } = useGeckoList();
  const [loading, setLoading] = useState(false);
  const { toastError } = useToast();

  const fetchData = useCallback(async () => {
    try {
      if (rawEvents?.length < 5 || !coinList) {
        return setData([]);
      }
      setLoading(true);
      const events = rawEvents.slice(0, MAX_RANGE);
      const tmpEnd = events[0].timeStamp || events[0].timestamp;
      const tmpStart =
        events[events.length - 1].timeStamp ||
        events[events.length - 1].timestamp;
      const startDate = new Date(tmpStart * 1000 - 24 * 60 * 60 * 1000);
      const endDate = new Date(tmpEnd * 1000 + 24 * 60 * 60 * 1000);
      const quoteId = coinList.find((o) => {
        // TODO: remove this
        if (quote.symbol === "BUSD 1" || quote.symbol === "BUSD 2") {
          return o.symbol === "busd";
        }
        return o.symbol?.toLowerCase() === quote.symbol?.toLowerCase();
      })?.id;
      const payoutId = coinList.find((o) => {
        // TODO: remove this
        if (payout.symbol === "BUSD 1" || payout.symbol === "BUSD 2") {
          return o.symbol === "busd";
        }
        return o.symbol?.toLowerCase() === payout.symbol?.toLowerCase();
      })?.id;
      if (!quoteId || !payoutId) {
        return setData([]);
      }
      try {
        const [quoteData, payoutData] = await Promise.all([
          fetchPrice(quoteId, startDate, endDate),
          fetchPrice(payoutId, startDate, endDate),
        ]);
        const quotePrices = quoteData.prices;
        const payoutPrices = payoutData.prices;

        if (!quotePrices.length || !payoutPrices.length) {
          return setData([]);
        }
        const result = [
          {
            id: `${payout.symbol} Price`,
            color: "hsl(112, 70%, 50%)",
            data: [],
          },
          {
            id: "Bond Price",
            color: "hsl(206, 70%, 50%)",
            data: [],
          },
        ];
        const hideRange = Math.ceil(events.length / 4);
        events.forEach((o, i) => {
          const x = new Date((o.timeStamp || o.timestamp) * 1000);
          const xLabel = `${i % hideRange === 0 ? "SHOW" : ""}${format(
            x,
            "d/M H:m"
          )}`;

          const payoutPrice = findPriceNearDate(x, payoutPrices);
          const findBondPrice = () => {
            const quoteAmount = getBalance(
              new BigNumber(o.amount),
              quote.decimals
            );
            const payoutAmount = getBalance(
              new BigNumber(o.payout),
              payout.decimals
            );
            const quotePrice = findPriceNearDate(x, quotePrices);
            return quoteAmount
              .multipliedBy(quotePrice)
              .dividedBy(payoutAmount)
              .toNumber();
          };
          result[0].data.push({
            x: xLabel,
            y: payoutPrice,
          });
          result[1].data.push({
            x: xLabel,
            y: findBondPrice(),
          });
        });
        reverse(result[0].data);
        reverse(result[1].data);
        setData(result);
      } catch (err) {
        toastError(
          "Error: api reach limit, please try again after few minutes! "
        );
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  }, [quote, payout, coinList, rawEvents]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, fetchData };
};
