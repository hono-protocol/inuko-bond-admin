import React from "react";
import { ModalProvider } from "@bds-libs/uikit";
import { Web3ReactProvider } from "@web3-react/core";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { getLibrary } from "utils/web3React";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { HdProviderContextProvider } from "contexts/HdProviderContext";
import { LanguageProvider } from "contexts/Localization";
import { RefreshContextProvider } from "contexts/RefreshContext";
import { ToastsProvider } from "contexts/ToastsContext";
import store from "state";
import { BnbContextProvider } from "contexts/BnbContext";
import { QueryClient, QueryClientProvider } from "react-query";

const Providers: React.FC = ({ children }) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          <ToastsProvider>
            <HelmetProvider>
              <ThemeContextProvider>
                <HdProviderContextProvider>
                  <BnbContextProvider>
                    <LanguageProvider>
                      <RefreshContextProvider>
                        <ModalProvider>{children}</ModalProvider>
                      </RefreshContextProvider>
                    </LanguageProvider>
                  </BnbContextProvider>
                </HdProviderContextProvider>
              </ThemeContextProvider>
            </HelmetProvider>
          </ToastsProvider>
        </Provider>
      </Web3ReactProvider>
    </QueryClientProvider>
  );
};

export default Providers;
