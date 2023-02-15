import React, { useEffect, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ResetCSS } from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
//import ReactGA from "react-ga4";
import TagManager from "react-gtm-module";

import { useFetchPriceList } from "state/hooks";
import GlobalStyle from "./style/Global";
import Menu from "./components/Menu";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import ToastListener from "./components/ToastListener";
import PageLoader from "./components/PageLoader";
import history from "./routerHistory";

const NotFound = lazy(() => import("./views/NotFound"));
const MarketCreate = lazy(() => import("./views/Markets/Create"));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

//Google Tag Manager
const tagManagerArgs = {
  gtmId: "GTM-TXCG8V6",
};

TagManager.initialize(tagManagerArgs);

history.listen((location) => {
  TagManager.dataLayer({
    event: "pageview",
    page: {
      url: location.pathname + location.search,
    },
  });
});

/*
//GA4 implementation
const TRACKING_ID = "G-52KSWTDFQB";
ReactGA.initialize([{trackingId: TRACKING_ID}]);

history.listen((location) => {
  ReactGA.send({hitType: "pageview", page: location.pathname + location.search});
});
*/

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null;
  }, []);

  useEffect(() => {
    TagManager.dataLayer({
      event: "pageview",
      page: {
        url: window.location.pathname + window.location.search,
      },
    });
    //ReactGA.send({hitType: "pageview", page: window.location.pathname + window.location.search});
  }, []);

  // useFetchPriceList();

  return (
    <Router history={history}>
      <ResetCSS />
      <GlobalStyle />
      <Menu>
        <SuspenseWithChunkError fallback={<PageLoader />}>
          <Switch>
            <Route exact strict path="/" component={MarketCreate} />
            {/* 404 */}
            <Route component={NotFound} />
          </Switch>
        </SuspenseWithChunkError>
      </Menu>
      <ToastListener />
    </Router>
  );
};

export default React.memo(App);
