import React from "react";
import { Card, CardBody, CardHeader, Flex, Box } from "@bds-libs/uikit";
import BigNumber from "bignumber.js";
import { VipIfo, IfoVipPoolInfo } from "config/constants/types";
import { PublicIfoData, WalletIfoData } from "views/Ifos/types";
import IfoCardTokens from "./IfoCardTokens";
import styled from "styled-components";
import useToast from "hooks/useToast";
import useActiveWeb3React from "hooks/useActiveWeb3React";
import vipIfoABI from "config/abi/vip_ifo.json";
import erc20ABI from "config/abi/erc20.json";
import multicall, { multicallv2 } from "utils/multicall";
import { useTranslation } from "contexts/Localization";
import { useContract } from "hooks/useContract";
import { ethers } from "ethers";
import { BIG_TEN } from "utils/bigNumber";
import { getAddress } from "utils/addressHelpers";

interface IfoCardProps {
  ifo: VipIfo;
  poolConfig: IfoVipPoolInfo;
  publicIfoData: PublicIfoData;
  walletIfoData: WalletIfoData;
}

const StyledCardHeader = styled(CardHeader)<{ highlight: boolean }>`
  background: ${({ theme, highlight }) => {
    return !highlight ? theme.colors.textSubtle : theme.colors.primary;
  }};
  color: ${({ theme, highlight }) => {
    return !highlight ? "#052E22" : "#fff";
  }};

  svg {
    fill: ${({ theme, highlight }) => {
      return !highlight ? "#052E22" : "#fff";
    }};
  }

  [data-sub] {
    color: ${({ theme, highlight }) => {
      return !highlight ? "#000" : theme.colors.primaryBright;
    }};
  }
`;

const StyledCardBody = styled(CardBody)`
  background: #0a4635;
`;

const StyledCard = styled(Card)`
  background: #0a4635;
`;

function useVipIfoPool(props: {
  address: string;
  poolId: number;
  lpTokenAddress: string;
}) {
  const { address, poolId, lpTokenAddress } = props;
  const { toastError } = useToast();

  const [state, setState] = React.useState({
    raisingAmountPool: new BigNumber(0),
    offeringAmountPool: new BigNumber(0),
    limitPerUserInLP: new BigNumber(0),
    hasTax: false,
    sumTaxesOverflow: new BigNumber(0),
    numberUsers: new BigNumber(0),
    totalLPCommitted: new BigNumber(0),
    balance: new BigNumber(0),
    allowance: new BigNumber(0),
    amountTokenCommittedInLP: new BigNumber(0),
    hasClaimed: false,
    canDeposit: false,
    offeringAmountInToken: new BigNumber(0),
    refundingAmountInLP: new BigNumber(0),
    taxAmountInLP: new BigNumber(0),
  });

  const [isPending, setPending] = React.useState(false);

  const [isFetching, setIsFetching] = React.useState(true);

  const { account } = useActiveWeb3React();

  const vipIfoContract = useContract(address, vipIfoABI, true);
  const bep20Contract = useContract(lpTokenAddress, erc20ABI, true);

  const handleHarvest = React.useCallback(async () => {
    if (vipIfoContract) {
      try {
        setPending(true);
        const tx = await vipIfoContract.harvestPool(poolId);
        await tx.wait();
      } catch (e) {
        // @ts-ignore
        toastError("Failed to harvest!", e.message);
        console.error(e);
      } finally {
        setPending(false);
      }
    }
  }, [vipIfoContract, poolId]);

  const handleApprove = React.useCallback(async () => {
    if (vipIfoContract) {
      try {
        setPending(true);
        const tx = await bep20Contract.approve(
          address,
          ethers.constants.MaxUint256
        );
        await tx.wait();
      } catch (e) {
        // @ts-ignore
        toastError("Failed to approve!", e.message);
        console.error(e);
      } finally {
        setPending(false);
      }
    }
  }, [vipIfoContract, poolId]);

  const handleDeposit = React.useCallback(
    async (amount: string, decimals?: number) => {
      if (vipIfoContract) {
        try {
          setPending(true);
          const tx = await vipIfoContract.depositPool(
            new BigNumber(amount).times(BIG_TEN.pow(decimals)).toFixed(0),
            poolId
          );
          await tx.wait();
        } catch (e) {
          // @ts-ignore
          toastError("Failed to deposit!", e.message);
          console.error(e);
        } finally {
          setPending(false);
        }
      }
    },
    [vipIfoContract, poolId]
  );

  const getData = React.useCallback(async () => {
    if (vipIfoContract) {
      if (account) {
        const r = await multicallv2(vipIfoABI, [
          { address, name: "viewPoolInformation", params: [poolId] },
          {
            address,
            name: "checkDepositedInPool",
            params: [poolId, account],
          },
          {
            address,
            name: "viewUserInfo",
            params: [account, [poolId, poolId, poolId, poolId]],
          },
          {
            address,
            name: "viewUserOfferingAndRefundingAmountsForPools",
            params: [account, [poolId]],
          },
        ]);
        const r2 = await multicall(erc20ABI, [
          {
            address: lpTokenAddress,
            name: "allowance",
            params: [account, address],
          },
          {
            address: lpTokenAddress,
            name: "balanceOf",
            params: [account],
          },
        ]);
        setIsFetching(false);
        setState((c) => {
          return {
            raisingAmountPool: new BigNumber(r[0][0].toString()),
            offeringAmountPool: new BigNumber(r[0][1].toString()),
            limitPerUserInLP: new BigNumber(r[0][2].toString()),
            hasTax: r[0][3],
            totalLPCommitted: new BigNumber(r[0][4].toString()),
            sumTaxesOverflow: new BigNumber(r[0][5].toString()),
            numberUsers: new BigNumber(r[0][6].toString()),
            balance: new BigNumber(r2[1][0].toString()),
            allowance: new BigNumber(r2[0][0].toString()),
            hasClaimed: r[2][1][poolId],
            amountTokenCommittedInLP: new BigNumber(r[2][0][poolId].toString()),
            canDeposit: r[1][0],
            offeringAmountInToken: new BigNumber(r[3][0][0][0].toString()),
            refundingAmountInLP: new BigNumber(r[3][0][0][1].toString()),
            taxAmountInLP: new BigNumber(r[3][0][0][2].toString()),
          };
        });
      } else {
        const r = await multicall(vipIfoABI, [
          { address, name: "viewPoolInformation", params: [poolId] },
        ]);

        setIsFetching(false);
        setState((c) => {
          return {
            raisingAmountPool: r[0][0],
            offeringAmountPool: r[0][1],
            limitPerUserInLP: r[0][2],
            hasTax: r[0][3],
            totalLPCommitted: r[0][4],
            sumTaxesOverflow: r[0][5],
            numberUsers: r[0][6],
            balance: new BigNumber(0),
            allowance: new BigNumber(0),
            amountTokenCommittedInLP: new BigNumber(0),
            hasClaimed: false,
            canDeposit: false,
            offeringAmountInToken: new BigNumber(0),
            refundingAmountInLP: new BigNumber(0),
            taxAmountInLP: new BigNumber(0),
          };
        });
      }
    }
  }, [account, vipIfoContract, address]);

  React.useEffect(() => {
    getData();
    const time = setInterval(() => {
      getData();
    }, 9000);

    return () => {
      clearInterval(time);
    };
  }, [account, vipIfoContract]);

  return {
    state,
    isPending,
    handleHarvest,
    handleApprove,
    handleDeposit,
    isFetching,
  };
}

const SmallCard: React.FC<IfoCardProps> = ({
  ifo,
  poolConfig,
  publicIfoData,
  walletIfoData,
}) => {
  const { t } = useTranslation();
  const isLoading = publicIfoData.status === "idle";
  const poolData = useVipIfoPool({
    address: ifo.address,
    poolId: poolConfig.pid,
    lpTokenAddress: getAddress(poolConfig.lpToken.address),
  });
  const { isPending, handleHarvest, handleApprove, handleDeposit } = poolData;
  const {
    raisingAmountPool,
    offeringAmountPool,
    limitPerUserInLP,
    hasTax,
    totalLPCommitted,
    sumTaxesOverflow,
    numberUsers,
    balance,
    canDeposit,
    allowance,
    hasClaimed,
    offeringAmountInToken,
    refundingAmountInLP,
    taxAmountInLP,
    amountTokenCommittedInLP,
  } = poolData.state;

  return (
    <>
      <StyledCard>
        <StyledCardHeader highlight={poolConfig.name === "Holder"}>
          <Flex justifyContent="center" alignItems="center">
            <Box
              fontWeight="900"
              fontSize={{
                _: "17px",
                lg: "25px",
              }}
              lineHeight={{
                _: "19px",
                lg: "27px",
              }}
            >
              {poolConfig.name.toUpperCase()}
            </Box>
          </Flex>
          <Box
            mt="3px"
            data-sub
            textAlign="center"
            fontWeight="500"
            color="primaryBright"
            fontSize={{ _: "13px", lg: "15px" }}
            lineHeight={{ _: "15px", lg: "17px" }}
          >
            {t("Condition")}: {t(poolConfig.condition)}
          </Box>
          <Box
            mt="3px"
            data-sub
            textAlign="center"
            fontWeight="500"
            color="primaryBright"
            fontSize={{ _: "13px", lg: "15px" }}
            lineHeight={{ _: "15px", lg: "17px" }}
          >
            {t("Use %symbol% to claim new token", {
              symbol: poolConfig.lpToken.symbol,
            })}
          </Box>
        </StyledCardHeader>
        <StyledCardBody>
          <IfoCardTokens
            poolConfig={poolConfig}
            ifo={ifo}
            publicIfoData={publicIfoData}
            walletIfoData={walletIfoData}
            isLoading={isLoading}
            onApprove={handleApprove}
            totalLPCommitted={totalLPCommitted}
            approved={allowance.gt(0)}
            isPending={isPending}
            hasClaimed={hasClaimed}
            refundingAmountInLP={refundingAmountInLP}
            amountTokenCommittedInLP={amountTokenCommittedInLP}
            offeringAmountInToken={offeringAmountInToken}
            limitPerUserInLP={limitPerUserInLP}
            raisingAmountPool={raisingAmountPool}
            offeringAmountPool={offeringAmountPool}
            canDeposit={canDeposit}
          />
        </StyledCardBody>
      </StyledCard>
    </>
  );
};

export default SmallCard;
