import BigNumber from "bignumber.js";
import { BIG_TEN } from "./bigNumber";
import { Contract } from "ethers";

const options = {
  gasLimit: 600000,
};

export const stake = async (
  masterChefContract,
  pid,
  amount,
  account,
  ref,
  decimals = 18
) => {
  // const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString();
  //
  // const tx = await masterChefContract.deposit(pid, value, ref, options);
  //
  // const receipt = await tx.wait();
  //
  // return receipt.status;

  // Kai cant return tx hash
  const value = new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString();

  await masterChefContract.deposit(pid, value, ref);

  return true;
};

export const unstake = async (
  masterChefContract,
  pid,
  amount,
  account,
  decimals = 18
) => {
  await masterChefContract.withdraw(
    pid,
    new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(),
    options
  );

  return true;
};

export const harvest = async (masterChefContract: Contract, pid, account) => {
  await masterChefContract.deposit(
    pid,
    "0",
    "0x0000000000000000000000000000000000000000",
    {
      ...options,
      from: account,
    }
  );

  return true;

  // return masterChefContract.methods
  //   .deposit(pid, "0", "0x0000000000000000000000000000000000000000")
  //   .send({ from: account, gas: 700000 })
  //   .on("transactionHash", (tx) => {
  //     return tx.transactionHash;
  //   });
};
