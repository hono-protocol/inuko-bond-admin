import { useState, useEffect, useMemo, useCallback } from "react";
import { MaxUint256 } from "@ethersproject/constants";
import { BigNumber } from "bignumber.js";

import {
  BridgeType,
  BSC_CONTRACT_ADDRESS,
  BSC_KAI_CONTRACT_ADDRESS,
  KAI_BSC_CONTRACT_ADDRESS,
} from "config/constants/bridgeChain";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import { kardiaContract, kardiaTransaction } from "utils/kardiaChain";
import { ERC20_ABI } from "config/abi/erc20";
import { useTokenContract } from "./useContract";
import multicall from "utils/multicall";
import { useApprove } from "./useApprove";
import { getBep20Contract } from "utils/contractHelpers";
import { getProviderOrSigner } from "utils";
import useToast from "./useToast";

export enum ApprovalState {
  INIT_CHECKING,
  APPROVING,
  APPROVED,
  UNKNOWN,
}

export const useBridgeApproval = (
  type: BridgeType,
  tokenAddress: string,
  approveAmount?: string
) => {
  const { account, library } = useActiveWeb3React();
  const { toastError } = useToast();
  const tokenContract = getBep20Contract(
    tokenAddress,
    getProviderOrSigner(library, account)
  );
  const contractAddress = useMemo(() => {
    if (type === BridgeType.BSC_TO_KAI) {
      return BSC_KAI_CONTRACT_ADDRESS;
    }

    return BSC_CONTRACT_ADDRESS;
  }, [type]);

  const [initChecking, setInitChecking] = useState<boolean>(true);
  const [approved, setApproved] = useState<boolean>();
  const [approving, setApproving] = useState<boolean>();

  const getBSCAllowance = useCallback(async () => {
    if (account) {
      const calls = [
        {
          address: tokenAddress,
          name: "allowance",
          params: [account, contractAddress],
        },
      ];

      const result = await multicall(ERC20_ABI, calls);
      const allowance = result[0];

      setInitChecking(false);
      if (allowance.toString() !== "0") {
        const bigNumberAllowance = new BigNumber(allowance);
        const bigNumberApproveAmount = new BigNumber(approveAmount || 0);

        if (bigNumberAllowance.comparedTo(bigNumberApproveAmount) >= 0) {
          setApproved(true);
        }
      }
    }
  }, [account, tokenAddress, approveAmount]);

  // check if we have already approved, call directly to prevent buggy if we on Ethereum
  useEffect(() => {
    try {
      const getKaiAllowance = async () => {
        if (window.kaiAccount && tokenAddress) {
          kardiaContract.updateAbi(ERC20_ABI);
          const allowance = await kardiaContract
            .invokeContract("allowance", [
              window.kaiAccount,
              KAI_BSC_CONTRACT_ADDRESS,
            ])
            .call(tokenAddress, {}, "latest");

          setInitChecking(false);
          if (allowance.toString() !== "0") {
            const bigNumberAllowance = new BigNumber(allowance);
            const bigNumberApproveAmount = new BigNumber(approveAmount || 0);
            if (bigNumberAllowance.comparedTo(bigNumberApproveAmount) >= 0) {
              setApproved(true);
            }
          }
        }
      };

      if (type === BridgeType.KAI_TO_BSC) {
        getKaiAllowance();
      } else {
        getBSCAllowance();
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [type, tokenAddress, approveAmount]);

  const handleApproveKai = useCallback(async () => {
    kardiaContract.updateAbi(ERC20_ABI);
    const data = await kardiaContract
      .invokeContract("approve", [
        KAI_BSC_CONTRACT_ADDRESS,
        "99999999999999999999999999",
      ])
      .txData();

    await kardiaTransaction.sendTransactionToExtension(
      {
        to: tokenAddress,
        gasPrice: "1000000000",
        gas: 300000,
        data,
      },
      true
    );

    setTimeout(async () => {
      const allowance = await kardiaContract
        .invokeContract("allowance", [
          window.kaiAccount,
          KAI_BSC_CONTRACT_ADDRESS,
        ])
        .call(tokenAddress, {}, "latest");

      if (allowance.toString() !== "0") {
        setApproved(true);
        setApproving(false);
      }
    }, 1500);
  }, [tokenAddress]);

  const handleApprove = useCallback(async () => {
    try {
      setApproving(true);
      if (type === BridgeType.KAI_TO_BSC) {
        return handleApproveKai();
      }

      const tx = await tokenContract?.approve(contractAddress, MaxUint256, {
        gasLimit: 300000,
      });

      await tx.wait();

      // call directly to prevent buggy if we on Ethereum
      tokenContract?.allowance(account, contractAddress).then((allowance) => {
        if (allowance.toString() !== "0") {
          setApproved(true);
          setApproving(false);
        }
      });

      return null;
    } catch (err) {
      setApproving(false);
      toastError(
        "Failed to approve token!",
        // @ts-ignore
        err.message
      );
    }
  }, [type, handleApproveKai, tokenContract, account, contractAddress]);

  const approvalState = useMemo(() => {
    if (initChecking) {
      return ApprovalState.INIT_CHECKING;
    }
    if (approved) {
      return ApprovalState.APPROVED;
    }

    if (approving) {
      return ApprovalState.APPROVING;
    }

    return ApprovalState.UNKNOWN;
  }, [initChecking, approving, approved]);

  return {
    approvalState,
    handleApprove,
  };
};
