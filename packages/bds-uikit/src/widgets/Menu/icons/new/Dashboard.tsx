import React from "react";
import { SvgProps } from "../../../..";
import { Svg } from "../../../../components/Svg";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 512 512" {...props}>
      <path
        fillRule="evenodd"
        d="M253 52.1c3 0 11.4.3 18.5.9 7.1.5 17.7 1.7 23.5 2.6 5.8.9 14.8 2.6 20 3.9 5.2 1.2 12.2 3.1 15.5 4 3.3 1 11.9 4 19 6.8 7.8 3.1 14.4 6.3 16.4 8.2 1.9 1.6 4.2 4.8 5.2 7s1.9 5.7 1.9 7.7c0 2.1-.7 5.5-1.6 7.5-.8 2.1-2.5 4.9-3.7 6.2-1.2 1.3-4 3.2-6.2 4.2s-5.9 1.9-8.2 1.9c-2.7 0-8.5-1.6-15.5-4.4-6.2-2.4-15.1-5.5-19.8-6.9-4.7-1.4-11.9-3.3-16-4.2-4.1-.9-11.7-2.1-26-4v17c0 15.7-.2 17.3-2.2 21.4-1.3 2.5-4 5.9-6.1 7.5-3.6 2.9-4.5 3.1-11.7 3.1-7.3 0-8.1-.2-11.7-3.1-2.1-1.7-4.7-4.6-5.8-6.5-1.7-3-2.1-5.8-3-39.5l-9 1.3c-4.9.7-13.3 2.2-18.5 3.4-5.2 1.1-14.7 3.8-21 5.9-6.3 2.1-16.4 6.1-22.5 9-6.1 2.8-14.8 7.5-19.5 10.3-4.7 2.8-12.8 8.3-18 12.2-5.2 3.9-14.2 11.6-19.9 17-5.7 5.5-13.1 13.4-16.6 17.5-3.4 4.1-8.7 11.1-11.7 15.5s-5.8 8.6-6.1 9.3c-.5.8 4.1 3.5 14.5 8.5 10.5 5 16.3 8.4 18.4 10.8 1.6 1.9 3.6 5.2 4.3 7.4.8 2.3 1.1 5.9.8 8.5-.3 2.6-1.8 6.2-3.4 8.5-1.6 2.2-4.7 5-6.8 6.2-2.8 1.6-5.7 2.3-9.5 2.3-4.8 0-7.4-.9-21-7.5-8.5-4.2-15.8-7.2-16.1-6.8-.4.4-1.8 4.6-3.2 9.3-1.4 4.7-3.5 12.1-4.6 16.5-1.1 4.4-2.8 12.9-3.7 19-1.2 7.4-1.7 17.5-1.8 31-.1 14.6.4 23 1.7 31 1 6.1 2.9 15.5 4.3 21s3.9 14.1 5.6 19c1.7 4.9 5.7 14.5 8.9 21.3 3.3 6.7 6.4 12.2 6.9 12.2s7-2.9 14.3-6.5c11.2-5.6 14-6.6 18.4-6.5 3.2 0 6.8.8 9.1 1.9 2 1 4.7 3 5.9 4.3 1.2 1.2 2.9 4 3.7 6 .9 2.1 1.6 5.5 1.6 7.5 0 2.1-1 5.8-2.2 8.2-1.3 2.5-3.9 5.7-5.8 7.2-1.9 1.4-13.4 7.4-25.5 13.3-18.7 9.2-22.7 10.8-27 10.8-3.1 0-6.5-.7-9-2-2.2-1.1-5-3.1-6.1-4.4-1.2-1.2-4.5-6-7.3-10.6-2.8-4.5-7.5-13-10.5-19-2.9-5.9-7.4-15.9-9.9-22.2-2.5-6.3-5.7-15.3-7-20-1.4-4.7-3.6-13.9-5-20.5s-3.3-17.7-4.1-24.8c-.9-7-1.6-19.1-1.6-27 0-7.8.7-20.3 1.6-27.7.8-7.4 2.7-18.9 4.1-25.5 1.4-6.6 3.6-15.8 5-20.5 1.3-4.7 4.5-13.7 7-20 2.4-6.3 7.4-17.1 11-24 3.5-6.9 9.3-16.8 12.7-22 3.5-5.2 9.4-13.6 13.3-18.5 3.8-4.9 11-13.2 15.9-18.4 4.9-5.1 12.9-12.8 17.9-17.1 5-4.2 12.6-10.3 17-13.6 4.4-3.2 12.7-8.7 18.5-12.2 5.8-3.5 15.4-8.8 21.5-11.7 6.1-2.9 16.6-7.3 23.5-9.8 6.9-2.5 18.1-5.9 25-7.5 6.9-1.7 17.2-3.8 23-4.7 5.8-.8 15-1.9 20.5-2.4 5.5-.4 12.5-.9 15.5-1zM470.8 192c2.8 0 6.7.6 8.4 1.3 1.8.7 4.8 3.1 6.6 5.3 1.8 2.1 4.7 7.1 6.3 10.9 1.6 3.8 4.5 11.5 6.3 17 1.9 5.5 4.3 13.6 5.5 18 1.1 4.4 2.7 11.6 3.6 16 .8 4.4 2.2 13.9 3 21 .8 7.1 1.5 19.4 1.5 27.3 0 7.8-.7 19.9-1.6 27-.8 7-2.7 18.1-4.1 24.7-1.4 6.6-3.6 15.8-5 20.5-1.3 4.7-4.5 13.7-7 20-2.5 6.3-7 16.3-9.9 22.3-3 5.9-7.7 14.4-10.5 19-2.8 4.5-6.1 9.3-7.3 10.5-1.1 1.3-3.9 3.3-6.1 4.4-2.2 1.1-6 2.1-8.5 2.1-3.7 0-8.7-1.9-27.5-10.7-12.6-6-24.6-12-26.5-13.5-1.9-1.5-4.5-4.7-5.8-7.2-1.2-2.4-2.2-6.1-2.2-8.1 0-2.1.7-5.5 1.6-7.5.8-2.1 2.5-4.9 3.7-6.1 1.2-1.3 3.9-3.3 5.9-4.3 2.3-1.2 5.9-1.9 9-1.9 4.4 0 7.6 1.1 19 6.5 7.6 3.6 14.2 6.5 14.8 6.5.6 0 3.6-5.5 6.9-12.2 3.2-6.8 7.2-16.4 8.9-21.3 1.7-4.9 4.2-13.5 5.6-19 1.4-5.5 3.2-14.5 4.1-20 .8-5.5 1.8-16.1 2.2-23.5.3-7.9.1-19.1-.6-27-.7-7.4-2.3-18.9-3.7-25.5-1.4-6.6-4.5-17.6-6.8-24.5-2.4-6.9-5.6-15.9-7.1-20-2.5-6.9-2.6-7.9-1.6-12.5.7-2.7 2.2-6.5 3.5-8.3 1.3-1.7 4.1-4.1 6.2-5.2 2.3-1.1 6-1.9 9.1-2zm-48.5-67.8c5.6.3 7.2.7 10.5 3.4 2.1 1.6 4.8 5 6.1 7.5 1.2 2.4 2.2 6.1 2.2 8.2 0 2-.6 5.2-1.3 7-.7 1.7-17.9 27.3-38.2 56.7-20.3 29.4-46.7 67.4-58.8 84.5-12.1 17.1-26.1 36.4-31.1 43-5 6.6-11.8 14.6-15.1 17.9-4.1 4-8.5 7-14 9.6-4.4 2.1-10.4 4.3-13.3 4.9-2.8.6-8.8 1.1-13.2 1.1-4.4 0-10.4-.5-13.3-1.1-2.8-.6-8.4-2.6-12.2-4.3-3.9-1.8-9.7-5.5-13-8.2-3.3-2.8-8.1-8.1-10.6-11.9-2.5-3.9-5.5-9.5-6.7-12.5-1.1-3-2.5-7.9-3.1-10.8-.6-2.8-1.1-7.7-1.1-10.7 0-3 .5-7.9 1.1-10.8.6-2.8 2-7.7 3.1-10.7 1.2-3 4.2-8.6 6.7-12.4 2.9-4.3 7.2-9.1 11.6-12.6 3.8-3.1 11.5-9 17-13.1 5.5-4.2 23.1-16.8 39-28.1 15.9-11.4 52.9-37.1 82-57.2s54.4-37.2 56-38.1c2.1-1.1 5.1-1.5 9.7-1.3zM265.6 276.3c-7.7 5.6-16.7 12.4-19.9 15.2-3.5 2.9-6.7 6.7-7.8 9-1 2.2-1.8 5.8-1.8 8s1 6 2.2 8.4c1.3 2.5 4 5.9 6.1 7.5 3.2 2.5 5 3.2 10 3.5 4.6.3 7.2-.1 10.2-1.5 2.4-1.2 6.2-4.7 9.6-8.9 3.2-3.9 9-11.5 13-17s17.6-24.6 30.2-42.5c12.7-17.9 23.1-33.1 23.3-33.7.2-.7.3-1.3.1-1.3-.1.1-13.9 9.8-30.7 21.6-16.8 11.8-36.8 26.1-44.5 31.7z"
      />
    </Svg>
  );
};

export default Icon;
