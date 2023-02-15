import React from "react";
import styled from "styled-components";
import { Box, darkColors, Heading } from "@bds-libs/uikit";

import Page from "components/layout/Page";
import { useTranslation } from "contexts/Localization";
import MarketLine from "./components/MarketLine";
import { useFetchListBonds } from "hooks";

const Hero = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 16px 16px 0 16px;
  text-align: center;
  color: #fff;
`;

export const Table = styled.table`
  width: 100%;
  border-top: 1px solid black;

  tr {
    border-bottom: 1px solid black;

    &:not(:first-child):hover {
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.1);
      transition: 0.3s all;
    }
  }

  th {
    padding: 0.5rem;
    text-align: left;
  }

  td {
    padding: 1rem;
    vertical-align: middle;

    span {
      margin-left: 0.25rem;
    }
  }
`;

// @ts-ignore
const Markets: React.FC = ({ history }) => {
  const { t } = useTranslation();
  const { data } = useFetchListBonds();

  const handleClick = (id) => () => {
    history.push(`/markets/${id}`);
  };

  return (
    <div>
      <Page>
        <Hero>
          <Heading
            textAlign="center"
            as="h1"
            size="xl"
            fontWeight={900}
            color={darkColors.primary}
            mb="1rem"
          >
            {t("Live Markets")}
          </Heading>
        </Hero>

        <Box maxWidth="1024px" mx="auto" mt="1rem">
          <Box
            boxShadow="4px 4px 8px rgba(0, 0, 0, 0.25)"
            borderRadius="16px"
            background={darkColors.white}
            color={darkColors.black}
          >
            <Box p="3rem">
              <Table>
                <tr>
                  <th>{t("ID")}</th>
                  <th>{t("Bond")}</th>
                  <th>{t("Bond Price")}</th>
                  <th style={{ textAlign: "right" }}>{t("Discount")}</th>
                  <th style={{ textAlign: "right" }}>{t("Max Payout")}</th>
                  <th>{t("Vesting")}</th>
                  <th>{t("TBV")}</th>
                </tr>
                {data?.map((o) => {
                  return (
                    <MarketLine
                      key={o.id}
                      data={o}
                      onClick={handleClick(o.id)}
                    />
                  );
                })}
              </Table>
            </Box>
          </Box>
        </Box>
      </Page>
    </div>
  );
};

export default Markets;
