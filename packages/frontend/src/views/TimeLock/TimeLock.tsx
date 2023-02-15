import React from "react";
import styled from "styled-components";
import PageHeader from "../../components/PageHeader";
import { Heading, Text, Box, Grid } from "@bds-libs/uikit";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { useTranslation } from "contexts/Localization";
import TimeLockCard from "./components/TimeLockCard";
import TimeLockCardS from "../PoolLock/components/TimeLockCard";
import useActiveWeb3React from "../../hooks/useActiveWeb3React";
import UnlockButton from "../../components/UnlockButton";
import BigNumber from "bignumber.js";
import useToast from "../../hooks/useToast";
import { useContract } from "../../hooks/useContract";
import timelockABI from "../../config/abi/timelock.json";
import multicall from "../../utils/multicall";
import { BDS, BIG } from "../../config/constants/tokens";
import { ChainId } from "@pancakeswap/sdk";

const Hero = styled(PageHeader)`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  paddingtop: 32px;
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  color: #fff;
`;

const totalDay1 = eachDayOfInterval({
  start: new Date(2021, 9, 1),
  end: new Date(2022, 2, 2),
}).length;

const totalDay2 = eachDayOfInterval({
  start: new Date(2021, 9, 1),
  end: new Date(2024, 6, 2),
}).length;

const totalDay3 = eachDayOfInterval({
  start: new Date(2021, 9, 10),
  end: new Date(2022, 9, 11),
}).length;

const totalDay4 = eachDayOfInterval({
  start: new Date(2021, 10, 7),
  end: new Date(2022, 1, 4),
}).length;
const totalDay5 = eachDayOfInterval({
  start: new Date(2021, 10, 10),
  end: new Date(2024, 10, 10),
}).length;
const totalDayCH = eachDayOfInterval({
  start: new Date(2021, 10, 19),
  end: new Date(2024, 10, 19),
}).length;

function useTimeLock(props: { address: string; totalDay: number }) {
  const { address, totalDay } = props;

  const [state, setState] = React.useState({
    lockOf: new BigNumber(0),
    pendingTokens: new BigNumber(0),
    total: new BigNumber(0),
    perDay: new BigNumber(0),
  });

  const [isPending, setPending] = React.useState(false);

  const { t } = useTranslation();

  const { account } = useActiveWeb3React();

  const { toastError } = useToast();

  const timelockContract = useContract(address, timelockABI, true);

  const getData = React.useCallback(() => {
    if (timelockContract && account) {
      multicall(timelockABI, [
        { address, name: "lockOf", params: [account] },
        { address, name: "pendingTokens", params: [account] },
        { address, name: "totalLockUntilToday", params: [account] },
      ]).then((r) => {
        const s = {
          lockOf: new BigNumber(r[0]),
          pendingTokens: new BigNumber(r[1][1]),
          total: new BigNumber(r[2]),
          perDay: new BigNumber(r[2])
            .div(totalDay)
            .div(new BigNumber(10).pow(8)),
        };
        setState(s);
      });
    }
  }, [account, timelockContract, address, totalDay]);

  async function handleClaim() {
    try {
      if (timelockContract && account) {
        setPending(true);

        const tx = await timelockContract.claim();

        await tx.wait();
      }
    } catch (e) {
      console.log(e);
      toastError(
        t("Error"),
        t(
          "Please try again. Confirm the transaction and make sure you are paying enough gas!"
        )
      );
    } finally {
      setPending(false);
      getData();
    }
  }

  React.useEffect(() => {
    getData();
    const time = setInterval(() => {
      getData();
    }, 6000);

    return () => {
      clearInterval(time);
    };
  }, [account, timelockContract]);

  React.useEffect(() => {
    if (!account) {
      setState({
        lockOf: new BigNumber(0),
        pendingTokens: new BigNumber(0),
        total: new BigNumber(0),
        perDay: new BigNumber(0),
      });
    }
  }, [account]);

  return {
    ...state,
    isPending,
    handleClaim,
  };
}

function TimeLock() {
  const { t } = useTranslation();
  const { account } = useActiveWeb3React();

  const consultantTimeLock = useTimeLock({
    address: "0xD4bC33Bb9bC99B0Ba26460007e0Ec9355fd7E09E",
    totalDay: totalDay1,
  });

  const staffTimeLock = useTimeLock({
    address: "0x08d720dC7A243b5da2F25117ca052AFc562B0756",
    totalDay: totalDay1,
  });

  const p1TimeLock = useTimeLock({
    address: "0x53C1F1C91ab43959D0Ee3aaD0Ffc6150b8A4fCf6",
    totalDay: totalDay1,
  });

  const p3TimeLock = useTimeLock({
    address: "0xB285dA11cD04150D3e6F277C4707AE41ABDEa575",
    totalDay: totalDay2,
  });

  const p4TimeLock = useTimeLock({
    address: "0x03Fb2894d58A2B17da4043748374B262312fE269",
    totalDay: totalDay3,
  });

  const p5TimeLock = useTimeLock({
    address: "0x2C20015Cc6273556640f530e1E08a85aCfd49e49",
    totalDay: totalDay3,
  });

  const BLCTimeLock = useTimeLock({
    address: "0x03B8F39e62678ea474b3a28b31fDbb65854e431a",
    totalDay: totalDay4,
  });
  const BLCTimeLock2 = useTimeLock({
    address: "0x345E4dc10120ad9c1Cc0Ad17dFAE6B947B8929DA",
    totalDay: totalDay5,
  });
  const CHTimeLock = useTimeLock({
    address: "0x881f384C5777f92bC0b060b6eF51775C84Ae8849",
    totalDay: totalDayCH,
  });
  return (
    <Box minHeight="100vh">
      <Hero>
        <Heading
          textAlign="center"
          as="h1"
          size="xl"
          fontWeight={900}
          color="#fff"
        >
          {t("Time lock")}
        </Heading>
        <Box mt="25px" textAlign="center">
          <Text fontSize="25px" color="#fff" fontWeight={900}>
            {t("Account instalment")}
          </Text>
        </Box>
      </Hero>
      <Box pb="100px">
        {!account && (
          <Box mx="auto" width="200px">
            <UnlockButton width="100%" />
          </Box>
        )}
        {account &&
          consultantTimeLock.lockOf.eq(0) &&
          staffTimeLock.lockOf.eq(0) &&
          p1TimeLock.lockOf.eq(0) &&
          p3TimeLock.lockOf.eq(0) &&
          p4TimeLock.lockOf.eq(0) &&
          p5TimeLock.lockOf.eq(0) &&
          BLCTimeLock.lockOf.eq(0) &&
          BLCTimeLock2.lockOf.eq(0) && 
          CHTimeLock.lockOf.eq(0) &&(
            <Box
              mt="50px"
              color="text"
              textAlign="center"
              fontWeight="700"
              fontSize="30px"
            >
              {" "}
              {t("No time lock")}
            </Box>
          )}
        {account && (
          <Box maxWidth="800px" mx="auto" px="20px">
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              mx="-20px"
            >
              <TimeLockCard
                totalDay={totalDay1}
                endDate="2/2/2022"
                address="0xD4bC33Bb9bC99B0Ba26460007e0Ec9355fd7E09E"
                title="CONSULTANT"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...consultantTimeLock}
              />
              <TimeLockCard
                totalDay={totalDay1}
                endDate="2/2/2022"
                address="0x08d720dC7A243b5da2F25117ca052AFc562B0756"
                title="STAFF"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...staffTimeLock}
              />
              <TimeLockCard
                totalDay={totalDay1}
                endDate="2/2/2022"
                address="0x53C1F1C91ab43959D0Ee3aaD0Ffc6150b8A4fCf6"
                title="PRIVATE 1 Y"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...p1TimeLock}
              />
              <TimeLockCard
                totalDay={totalDay2}
                endDate="2/6/2024"
                address="0xB285dA11cD04150D3e6F277C4707AE41ABDEa575"
                title="PRIVATE 3 Y"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...p3TimeLock}
              />
              <TimeLockCard
                totalDay={totalDay3}
                endDate="11/09/2022"
                address="0x03Fb2894d58A2B17da4043748374B262312fE269"
                title="PRIVATE 1 Y"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...p4TimeLock}
              />
              <TimeLockCard
                totalDay={totalDay3}
                endDate="11/09/2022"
                address="0x2C20015Cc6273556640f530e1E08a85aCfd49e49"
                title="STAFF"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...p5TimeLock}
              />
              <TimeLockCard
                totalDay={totalDayCH}
                endDate="19/10/2024"
                address="0x881f384C5777f92bC0b060b6eF51775C84Ae8849"
                title="PRIVATE 3Y"
                token="BDS"
                tokenIcon="/images/tokens/0x7C0073F6285A89c7cf1e197e5D22554ff8726334.png"
                {...CHTimeLock}
              />
              <TimeLockCard
                totalDay={totalDay4}
                endDate="04/01/2022"
                address="0x03B8F39e62678ea474b3a28b31fDbb65854e431a"
                title="BLC 90 days"
                token="BLC"
                tokenIcon="/images/tokens/0x15aC0a5240EDEd9c4B62112342dd808d59F88675.png"
                {...BLCTimeLock}
              />
              <TimeLockCard
                totalDay={totalDay5}
                endDate="10/10/2024"
                address="0x345E4dc10120ad9c1Cc0Ad17dFAE6B947B8929DA"
                title="BLC 3 Years"
                token="BLC"
                tokenIcon="/images/tokens/0x15aC0a5240EDEd9c4B62112342dd808d59F88675.png"
                {...BLCTimeLock2}
              />
            </Box>
          </Box>
        )}
      </Box>
      <Box>
        <Hero>
          <Heading
            textAlign="center"
            as="h1"
            size="xl"
            fontWeight={900}
            color="#fff"
          >
            {t("Pool lock")}
          </Heading>
        </Hero>
        <Box maxWidth="800px" mx="auto" px="20px" pb="100px">
          <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            mx="-20px"
          >
            <TimeLockCardS
              tokenDecimal={BIG[ChainId.MAINNET].decimals}
              tokenSymbol={BIG[ChainId.MAINNET].symbol}
              tokenAddress={BIG[ChainId.MAINNET].address}
              pooId={0}
              address={"0xeea580cA1Dd612BfE41e196e167Ce3029c36a282"}
            />
            <TimeLockCardS
              tokenDecimal={BDS[ChainId.MAINNET].decimals}
              tokenSymbol={BDS[ChainId.MAINNET].symbol}
              tokenAddress={BDS[ChainId.MAINNET].address}
              pooId={1}
              address={"0xeea580cA1Dd612BfE41e196e167Ce3029c36a282"}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TimeLock;
