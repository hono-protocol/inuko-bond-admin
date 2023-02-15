import React from "react";
import { Box } from "@bds-libs/uikit";
import InfoCard from "./InfoCard";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "../../../contexts/Localization";
import { useStatistics } from "../../../state/statistics/hooks";
import { formatNumber } from "../../../utils/formatBalance";
import { ApexOptions } from "apexcharts";

function InfoCardTVL() {
  const { t } = useTranslation();
  const { burned, totalSupply, locked, circulation, lockedVaults } =
    useStatistics();

  const percentBurned = (burned / 1_000_000_000) * 100;
  const percentCir = (circulation / 1_000_000_000) * 100;

  const list = [
    {
      name: "MAX SUPPLY",
      value: "1,000,000,000",
    },
    {
      name: "BURNED",
      value: formatNumber(burned),
    },
    {
      name: "TOTAL SUPPLY",
      value: formatNumber(totalSupply),
    },
    {
      name: "LOCKED",
      value: formatNumber(locked),
    },
    {
      name: "CIRCULATION",
      value: formatNumber(circulation),
    },
  ];

  const list2 = [
    {
      group: "Founding team",
      begin: formatNumber(lockedVaults.founding.begin),
      quantity: formatNumber(lockedVaults.founding.available),
      percents: `${formatNumber(lockedVaults.founding.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Advisor",
      begin: formatNumber(lockedVaults.advisor.begin),
      quantity: formatNumber(lockedVaults.advisor.available),
      percents: `${formatNumber(lockedVaults.advisor.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Marketing",
      begin: formatNumber(lockedVaults.marketing.begin),
      quantity: formatNumber(lockedVaults.marketing.available),
      percents: `${formatNumber(lockedVaults.marketing.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Treasury",
      begin: formatNumber(lockedVaults.treasury.begin),
      quantity: formatNumber(lockedVaults.treasury.available),
      percents: `${formatNumber(lockedVaults.treasury.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Private Sale",
      begin: formatNumber(lockedVaults.private.begin),
      quantity: formatNumber(lockedVaults.private.available),
      percents: `${formatNumber(lockedVaults.private.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Public Investors",
      begin: formatNumber(lockedVaults.public.begin),
      quantity: formatNumber(lockedVaults.public.available),
      percents: `${formatNumber(lockedVaults.public.percentage)}%`,
      status: "Locked",
      release: "10% yearly",
    },
    {
      group: "Burned",
      begin: 0,
      quantity: `${formatNumber(burned)}`,
      percents: `${formatNumber(percentBurned)}%`,
      status: "Burned",
      release: "",
    },
    {
      group: "Circulation",
      begin: 0,
      //begin: formatNumber(lockedVaults.public.begin),
      quantity: `${formatNumber(circulation)}`,
      percents: `${formatNumber(percentCir)}%`,
      status: "",
      release: "",
    },
  ];

  const dataChart: { series: number[]; options: ApexOptions } =
    React.useMemo(() => {
      return {
        series: [
          lockedVaults.founding.percentage,
          lockedVaults.advisor.percentage,
          lockedVaults.marketing.percentage,
          lockedVaults.treasury.percentage,
          lockedVaults.private.percentage,
          lockedVaults.public.percentage,
          percentBurned,
          percentCir,
        ],
        options: {
          colors: [
            "#09E294",
            "#D1951D",
            "#FC465F",
            "#765ECE",
            "#0790FA",
            "#2887EE",
            "#32a852",
            "#3289a8",
          ],
          labels: [
            "Founding Team",
            "Advisor",
            "Marketing",
            "Treasury",
            "Private Sale",
            "Public Investors",
            "Burned",
            "Circulation",
          ],
        },
      };
    }, [lockedVaults, burned, circulation]);

  return (
    <InfoCard pb="40px">
      <Box
        fontWeight={700}
        textAlign="center"
        as="h2"
        color="textSubtle"
        fontSize="20px"
        lineHeight="22px"
      >
        {t("BDS TOKEN DETAILS")}
      </Box>
      <Box mt="16px" display="flex" flexWrap="wrap">
        {list.map((d) => {
          return (
            <Box
              key={d.name}
              flex="1"
              flexBasis={{ _: "50%", lg: 0 }}
              textAlign={{ _: "left", lg: "center" }}
            >
              <Box
                fontWeight={700}
                mt="16px"
                as="h3"
                color="textSubtle"
                fontSize="16px"
                lineHeight="18px"
              >
                {d.name}
              </Box>
              <Box
                fontWeight={700}
                mt="10px"
                as="p"
                color="primaryBright"
                fontSize="14px"
                lineHeight="16px"
              >
                {d.value}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box mt="20px" display="flex" bg="#fff" px="16px" py="16px">
        <Box mx="auto" width="500px" maxWidth="100%">
          <ReactApexChart
            options={dataChart.options}
            series={dataChart.series}
            type="donut"
          />
        </Box>
      </Box>
      <Box mt="16px" color="primaryBright" fontSize="14px">
        {t(
          "BDS tokens will be released on a schedule. Please see the chart below for more information"
        )}
      </Box>
      <Box overflow="auto">
        <Box
          mt="16px"
          as="table"
          width="100%"
          color="textSubtle"
          border="1px solid"
          borderColor="textSubtle"
          fontSize="16px"
        >
          <Box as="tr">
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Group
            </Box>
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Beginning
            </Box>
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Quality
            </Box>
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Percent
            </Box>
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Status
            </Box>
            <Box p="8px" as="th" border="1px solid" borderColor="textSubtle">
              Release
            </Box>
          </Box>
          {list2.map((l) => {
            return (
              <Box as="tr" key={l.group}>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.group}
                </Box>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.begin}
                </Box>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.quantity}
                </Box>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.percents}
                </Box>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.status}
                </Box>
                <Box
                  textAlign="center"
                  fontSize="14px"
                  p="8px"
                  as="td"
                  border="1px solid"
                  borderColor="textSubtle"
                >
                  {l.release}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </InfoCard>
  );
}

export default InfoCardTVL;
