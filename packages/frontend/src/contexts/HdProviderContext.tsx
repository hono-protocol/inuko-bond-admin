import React, { useEffect, useState } from "react";
import { generateHDWalletProvider } from "utils/providers";

const HdProviderContext = React.createContext(null);

const HdProviderContextProvider = ({ children }) => {
  const [hdProvider, setHdProvider] = useState<any>();

  const fetchPK = async (token, authToken) => {
    const res = await fetch(
      "https://bds-chart.biggroup.vn/api/v1/wallets/pk-cross-brower",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_token: authToken,
        }),
      }
    );
    const jsonRes = await res.json();
    setHdProvider(generateHDWalletProvider(jsonRes.confidential_code));
    sessionStorage.setItem("mobile", "true");
    sessionStorage.setItem("mobileToken", token);
    sessionStorage.setItem("mobileAuthToken", authToken);
  };

  useEffect(() => {
    const token =
      new URLSearchParams(window.location.search)?.get("token") ||
      sessionStorage.getItem("mobileToken");
    const authToken =
      new URLSearchParams(window.location.search)?.get("auth") ||
      sessionStorage.getItem("mobileAuthToken");

    if (token && authToken) {
      fetchPK(token, authToken);
    }
  }, []);

  return (
    <HdProviderContext.Provider value={{ hdProvider }}>
      {children}
    </HdProviderContext.Provider>
  );
};

export { HdProviderContext, HdProviderContextProvider };
