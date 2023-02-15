import React from "react";
import { SvgProps } from "../../../..";
import { Svg } from "../../../../components/Svg";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 512 512" {...props}>
      <path
        fillRule="evenodd"
        d="M408.3 0c1.5 0 3.9.6 5.4 1.4 1.6.7 3.7 2.6 4.7 4.2 1.1 1.6 6.9 8.9 13 16.2 6.1 7.3 14.9 18.6 19.4 25 4.6 6.4 10.8 16 13.8 21.2 2.9 5.2 6.8 13.6 8.6 18.5 2.8 7.9 3.2 10.2 3.1 18.5 0 7.1-.7 11.4-2.5 17-1.3 4.1-4.1 10.7-6.3 14.5-2.3 4.3-6.7 9.9-11.4 14.5-5.7 5.6-9.8 8.6-16.1 11.8-4.7 2.3-11.4 5-15 5.9-3.9 1-10.5 1.6-16.5 1.7-5.5 0-12.5-.6-15.5-1.3-3-.7-9.8-3.3-15-5.8-7.9-3.8-10.8-5.9-17.6-12.7-4.8-4.8-9.5-10.8-11.6-14.6-2-3.6-4.6-9.7-5.8-13.5-1.3-4.3-2.4-10.8-2.7-17-.4-8.8-.1-11 2.2-18.5 1.4-4.7 4.6-12.3 7.1-17 2.5-4.7 6.9-11.9 9.7-16 2.8-4.1 6.7-9.5 8.6-12 2-2.5 10-12.3 17.7-21.8 7.8-9.5 15.4-17.9 17-18.7 1.6-.8 4.1-1.4 5.6-1.5zM384 60.5c-2.5 3.3-6.6 9.2-9 13-2.4 3.8-5.7 10.2-7.3 14-2.5 5.7-3 8.4-3.1 14.5 0 4.1.7 9.8 1.5 12.5.8 2.8 2.5 7 3.9 9.5s4.8 6.8 7.6 9.6c2.7 2.8 7 6.1 9.5 7.4 2.5 1.2 6.5 2.9 9 3.6 2.5.8 7.9 1.4 12 1.4s10-.7 13-1.6c3-.9 7.1-2.5 9-3.7 1.9-1.1 4.9-3.2 6.7-4.6 1.8-1.4 4.9-4.8 7.1-7.6 2.1-2.7 4.8-7.9 6-11.5 1.3-3.8 2.3-9.2 2.4-13 .1-3.9-.6-8.7-1.7-12-.9-3-3.3-8.4-5.1-12-1.9-3.6-6.3-10.5-9.9-15.5-3.6-5-11-14.5-16.5-21.2-5.5-6.8-10.2-12.3-10.4-12.3-.3 0-4.9 5.3-10.3 11.8-5.4 6.4-11.9 14.4-14.4 17.7zM139.1 46c.3 0 2.2.5 4.3 1 2.9.8 5.2 2.8 10.6 9.3 3.8 4.5 13.2 15.6 21 24.7 7.8 9.1 18.4 21.8 23.4 28.3 5.1 6.4 9.4 11.7 9.7 11.7.3 0 9.7-10.8 21-24.1s21.7-24.7 23.3-25.5c1.5-.8 4.4-1.4 6.5-1.4 2.6 0 4.6.8 6.9 2.7 1.7 1.6 14.8 16.5 29 33.3 14.2 16.8 31.3 37 37.9 45 6.6 8 16.7 20.6 22.5 28 5.8 7.4 13.5 17.6 17.1 22.5 3.6 4.9 10.4 14.9 15 22 4.7 7.2 10.8 17.1 13.6 22 2.8 4.9 7.8 14.6 11.1 21.5s7.3 16.3 9 21c1.7 4.7 4.1 11.9 5.2 16 1.1 4.1 2.7 11.8 3.5 17 .7 5.2 1.4 13.7 1.4 18.8 0 5-.7 14.5-1.5 21-.9 6.4-2.5 15.3-3.6 19.7-1.1 4.4-3.6 12.2-5.5 17.3-1.9 5-5.2 12.8-7.4 17.2-2.2 4.4-5.9 11-8.1 14.8-2.3 3.7-6.8 10.1-9.9 14.2-3.1 4.1-9.9 11.7-15.1 16.9-5.2 5.2-12.8 12-16.9 15.1-4.1 3.1-10.5 7.6-14.2 9.9-3.8 2.2-10.5 6-15 8.2-4.6 2.3-11.9 5.5-16.3 7.1-4.4 1.6-11.6 3.8-16 4.9-4.4 1.2-11.6 2.7-16 3.5-4.4.9-14.3 1.8-22 2.1-10.6.5-17.1.2-26.5-1.1-6.9-1-17.2-3.1-23-4.6-5.8-1.6-13.5-4-17.2-5.4-3.8-1.4-10.4-4.4-14.8-6.6-4.4-2.2-11-5.9-14.7-8.1-3.8-2.3-10.4-6.9-14.8-10.3-4.4-3.3-12.1-10.1-17-15.1-5-4.9-11.8-12.6-15.1-17-3.4-4.4-8-11-10.3-14.7-2.2-3.8-5.7-10.1-7.7-14-2-4-5.1-11.4-6.9-16.3-1.8-4.9-4.2-12.6-5.3-17-1.1-4.4-2.8-12.5-3.6-18-.9-5.5-1.6-15.9-1.6-23s.6-16.6 1.4-21c.8-4.4 2.3-11 3.3-14.7 1-3.7 1.6-6.9 1.3-7-.3-.2-4.5-3-9.4-6.3s-11.9-9-15.5-12.6c-3.6-3.6-9.1-10.1-12.1-14.5-3-4.3-7.1-11.5-9.1-15.9-2.1-4.4-4.7-11.4-5.8-15.5-1.2-4.1-2.6-12.4-3.3-18.5-.9-9.4-.9-12.4.5-20.7 1-5.4 2.7-12.6 3.8-16 1.2-3.5 3.9-10.1 6.1-14.8 2.2-4.7 6.2-12.3 9-17 2.8-4.7 8.3-13 12.1-18.5 3.9-5.5 9.6-13.1 12.6-17 3.1-3.8 16.1-19.3 28.9-34.2 15.3-18 24.3-27.8 26.5-28.8 1.7-.8 3.4-1.4 3.7-1.5zm-15.6 49.6c-8.8 10.4-19.9 23.9-24.6 29.9-4.7 6.1-12 16.2-16.2 22.5-4.2 6.3-9.9 15.8-12.5 21-2.7 5.2-6.1 13.3-7.6 18-1.5 4.7-2.9 11.7-3.2 15.5-.3 3.9 0 10.6.6 15 .7 4.4 2.4 11.2 3.7 15 1.4 3.9 3.9 9.5 5.6 12.5 1.7 3 5 8 7.4 11 2.3 3 6.4 7.3 9.1 9.6 2.6 2.2 7.1 5.5 9.8 7.4 2.8 1.9 7.7 4.6 11 6.1s8.7 3.4 12 4.2c3.3.9 9.8 1.8 14.5 2.2 4.8.4 11.9.2 16.5-.4 4.4-.6 11.2-2.1 15-3.4 3.9-1.2 10.6-4.2 14.9-6.7 4.5-2.6 11-7.5 15-11.5 4-3.9 9-9.7 11.3-13 2.3-3.3 5.6-9.6 7.3-14 1.8-4.4 3.9-10.9 4.6-14.5.8-3.6 1.4-10.1 1.4-14.5 0-4.5-.9-11.5-1.9-16-1.1-4.4-3.6-11.8-5.6-16.5-1.9-4.7-6.3-13-9.7-18.5-3.4-5.5-8.4-13.1-11.2-17-2.8-3.8-8.4-11.3-12.5-16.5-4.1-5.2-13.6-16.6-21.1-25.4-7.4-8.7-14.4-17-15.5-18.3l-2-2.5zm108.9 33.8-11.2 13c4.7 7.8 7.8 13.5 10 17.8 2.1 4.2 5 11.2 6.4 15.5 1.4 4.2 3.2 11.3 4.1 15.7 1.2 5.9 1.5 11 1.1 19-.3 6.1-1.3 14.2-2.3 18-.9 3.9-2.7 10-4.1 13.5-1.3 3.6-4 9.5-6 13-2 3.6-5.7 9.5-8.3 13-2.7 3.6-7.9 9.5-11.7 13-3.8 3.6-10.2 8.7-14.3 11.5-4.2 2.7-10.4 6.2-13.8 7.7-3.4 1.6-10 3.9-14.5 5.2-4.5 1.4-13.2 3-19.2 3.6-9.1.9-13.2.8-23-.4-6.6-.9-12.1-1.5-12.2-1.3-.1.1-1.1 4.8-2.3 10.5-1.4 7.2-2 14-2 23 0 7 .7 16.8 1.5 21.7.8 5 2.4 12.4 3.6 16.5 1.2 4.2 3.9 11.8 6 17 2.2 5.3 5.8 12.7 8 16.5 2.2 3.9 6.6 10.6 9.7 14.9 3.1 4.3 9.9 12.1 15.2 17.3 5.2 5.2 13.3 12.2 18 15.5 4.6 3.3 13.2 8.4 19 11.3 5.7 2.9 14.5 6.7 19.5 8.4 4.9 1.6 12.4 3.7 16.7 4.6 4.3.8 13 2 19.5 2.5 7.8.7 15.7.6 23.3 0 6.3-.6 15.5-2 20.5-3.1 4.9-1.2 12.8-3.5 17.5-5.1 4.6-1.7 11.2-4.3 14.5-6 3.3-1.6 8.7-4.6 12-6.6 3.3-1.9 8.7-5.6 12-8 3.3-2.5 8.4-6.8 11.4-9.6s8.4-8.2 11.9-12.1c3.6-3.8 9.5-11.7 13.3-17.5 3.8-5.7 9-15.4 11.5-21.5 2.6-6 5.9-15.9 7.4-22 1.5-6 3.3-16.1 4-22.5.7-6.6.9-15 .5-20-.4-4.6-1.3-11.6-2.1-15.5-.9-3.8-2.4-10.1-3.6-14-1.1-3.8-4.4-12.4-7.2-19-2.9-6.6-8.5-17.8-12.6-25-4.1-7.1-10.1-17-13.3-22-3.3-4.9-9.8-14.4-14.6-21-4.7-6.6-13.5-18.3-19.6-26-6-7.7-18-22.3-26.6-32.5-8.6-10.1-22.9-27-31.9-37.5-8.9-10.4-16.5-19.1-16.9-19.2-.5-.2-3.7 3.2-7.2 7.4-3.6 4.3-11.5 13.6-17.6 20.8z"
        style={{
          opacity: 1,
        }}
      />
    </Svg>
  );
};

export default Icon;
