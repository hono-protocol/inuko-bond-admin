import KardiaClient from "kardia-js-sdk";

export const kardiaClient = new KardiaClient({
  endpoint: "https://rpc.kardiachain.io",
});
export const kardiaContract = kardiaClient.contract;
export const kardiaTransaction = kardiaClient.transaction;
export const krc20Instance = kardiaClient.krc20;
