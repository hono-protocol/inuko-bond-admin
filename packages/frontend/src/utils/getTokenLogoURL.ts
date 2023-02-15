const getTokenLogoURL = (address: string) => {
  // USDT
  if (address === "0x55d398326f99059fF775485246999027B3197955") {
    return "https://otcxpert.com/wp-content/uploads/2018/10/USDT-icon.png";
  }

  return `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
};

export default getTokenLogoURL;
