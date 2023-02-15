import { Flex } from "@bds-libs/uikit";
import { ResponsiveLine } from "@nivo/line";
import { useTranslation } from "contexts/Localization";

const Chart = ({ data }) => {
  const { t } = useTranslation();
  console.log("[DATA]", data);
  if (!data.length) {
    return (
      <Flex
        height="100%"
        width="100%"
        justifyContent="center"
        alignItems="center"
      >
        {t("Cannot get chart data")}
      </Flex>
    );
  }

  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      yScale={{
        type: "linear",
        min: 0,
        max: "auto",
        // stacked: true,
        reverse: false,
      }}
      yFormat=" >-.4f"
      axisTop={null}
      axisRight={null}
      xScale={{
        type: "point",
      }}
      axisBottom={{
        tickSize: 1,
        tickPadding: 10,
        tickRotation: 0,
        format: (label: string) => {
          if (label.includes("SHOW")) {
            return label.replace("SHOW", "");
          }
          return "";
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      enableSlices="x"
      enableGridX={false}
      enableGridY={false}
    />
  );
};

export default Chart;
