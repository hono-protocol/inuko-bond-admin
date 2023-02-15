import React from "react";
import { useTranslation } from "contexts/Localization";
import { getBscScanLink } from "utils";
import { Flex, Link, PocketWatchIcon, Text, Skeleton } from "@bds-libs/uikit";
import getTimePeriods from "utils/getTimePeriods";
import { PublicIfoData } from "views/Ifos/types";

interface Props {
  publicIfoData: PublicIfoData;
}

const Time = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5631 11.7661L10.7746 9.67464V5.41441C10.7746 4.98605 10.4283 4.6398 9.99995 4.6398C9.57159 4.6398 9.22534 4.98605 9.22534 5.41441V10.062C9.22534 10.306 9.33999 10.5361 9.53519 10.6817L12.6335 13.0055C12.773 13.11 12.9357 13.1604 13.0975 13.1604C13.3338 13.1604 13.5662 13.0543 13.718 12.8498C13.9752 12.5081 13.9055 12.0225 13.5631 11.7661Z"
        fill="#F69B3D"
      />
      <path
        d="M10 0C4.48566 0 0 4.48566 0 10C0 15.5143 4.48566 20 10 20C15.5143 20 20 15.5143 20 10C20 4.48566 15.5143 0 10 0ZM10 18.4508C5.34082 18.4508 1.54918 14.6592 1.54918 10C1.54918 5.34082 5.34082 1.54918 10 1.54918C14.66 1.54918 18.4508 5.34082 18.4508 10C18.4508 14.6592 14.6592 18.4508 10 18.4508Z"
        fill="#F69B3D"
      />
    </svg>
  );
};

const Timer: React.FC<Props> = ({ publicIfoData }) => {
  const { t } = useTranslation();
  const { status, secondsUntilStart, secondsUntilEnd, startBlockNum } =
    publicIfoData;
  const countdownToUse =
    status === "coming_soon" ? secondsUntilStart : secondsUntilEnd;
  const timeUntil = getTimePeriods(countdownToUse);
  const suffix =
    status === "coming_soon"
      ? t("Start").toUpperCase()
      : t("Finish").toUpperCase();
  return (
    <Flex justifyContent="center" mb="32px">
      {status === "idle" ? (
        <Skeleton animation="pulse" variant="rect" width="100%" height="48px" />
      ) : (
        <>
          <Time />
          <Flex ml="16px" alignItems="center">
            <Text color="textSubtle" bold mr="16px">
              {suffix}:
            </Text>
            <Text color="textSubtle">
              {t("%day%d %hour%h %minute%m", {
                day: timeUntil.days,
                hour: timeUntil.hours,
                minute: timeUntil.minutes,
              })}
            </Text>
            {/*<Link*/}
            {/*  color="textSubtle"*/}
            {/*  href={getBscScanLink(startBlockNum, "countdown")}*/}
            {/*  target="blank"*/}
            {/*  rel="noopener noreferrer"*/}
            {/*  ml="8px"*/}
            {/*  textTransform="lowercase"*/}
            {/*>*/}
            {/*  {`(${t("Blocks")})`}*/}
            {/*</Link>*/}
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default Timer;
