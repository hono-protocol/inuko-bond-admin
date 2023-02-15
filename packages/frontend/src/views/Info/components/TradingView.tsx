import { Box } from "@bds-libs/uikit";
import React from "react";
import Datafeed from "./datafeed";

const tradingViewListener = async () =>
  new Promise<void>((resolve) =>
    Object.defineProperty(window, "TradingView", {
      configurable: true,
      set(value) {
        this.tv = value;
        resolve(value);
      },
    })
  );

const initializeTradingView = (TradingViewObj: any) => {
  /* eslint-disable new-cap */
  /* eslint-disable no-new */
  const s = new TradingViewObj.widget({
    autosize: true,
    height: "100%",
    symbol: "BINANCE:CAKEUSDT",
    interval: "5",
    //timezone: "Etc/UTC",
    datafeed: Datafeed,
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#f1f3f6",
    enable_publishing: false,
    allow_symbol_change: true,
    container_id: "tradingview_b239c",
    withdateranges: true,
  });
};

export default function TradingView() {
  React.useEffect(() => {
    if (document.getElementById("tradingViewWidget")) {
      document.getElementById("tradingViewWidget")?.remove();
    }
    const script = document.createElement("script");
    script.id = "tradingViewWidget";
    script.src = "https://s3.tradingview.com/tv.js";
    document.body.appendChild(script);
  }, []);

  React.useEffect(() => {
    if ((window as any).TradingView) {
      initializeTradingView((window as any).TradingView);
    } else {
      tradingViewListener().then((tv) => {
        initializeTradingView(tv);
      });
    }
  }, []);

  return (
    <Box mt="20px" height="440px" maxWidth="700px" mx="auto">
      <Box overflow="hidden" className="tradingview_container">
        <div id="tradingview_b239c" />
      </Box>
    </Box>
  );
}
