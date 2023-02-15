import React from "react";
import { SvgProps } from "../../../..";
import { Svg } from "../../../../components/Svg";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 512 512" {...props}>
      <path
        fillRule="evenodd"
        d="M290 0c3 0 10.2.7 16 1.6 5.8.8 14.8 2.4 20 3.6 5.2 1.1 16.3 4.2 24.5 6.9 8.3 2.8 21.3 8.1 29 11.9 7.7 3.7 19.4 10.4 26 14.8 6.6 4.5 16.5 11.8 22 16.5 5.5 4.6 14.2 12.8 19.4 18.3 5.1 5.4 13.3 15.1 18 21.4 4.8 6.3 11.5 16.5 15.1 22.5 3.5 6 8.3 15.3 10.8 20.5 2.4 5.2 6.6 16 9.2 24 2.7 8 6 20.1 7.4 27 1.4 6.9 3.1 17.4 3.8 23.5 1.1 9.7 1 11.6-.5 16.5-.9 3-2.9 7.1-4.5 9-1.6 1.9-5.3 4.7-13.7 9H389c-74.1 0-104.6-.3-107.5-1.1-2.5-.8-5.9-3-9.1-6.3-3.3-3.2-5.5-6.6-6.3-9.1-.8-2.9-1.1-33.4-1.1-211l2.4-5c1.4-2.8 3.5-6 4.8-7.2 1.3-1.3 4.6-3.4 7.3-4.8C283 .8 286.2.1 290 0zm-6.8 20.9c-.9 1.2-1.2 7.2-1.2 22.6v21c31.8-31.8 41-41.3 41-41.8 0-.4-2.4-1.2-5.2-1.8-2.9-.5-9.8-1.6-15.3-2.4-5.5-.8-10.9-1.5-12-1.5-1.1.1-2.9.6-4 1.2s-2.6 1.8-3.3 2.7zm-1.7 67.6.5 53c75.2-75.2 97-97.3 97-97.8 0-.4-4.6-2.9-10.2-5.6-5.7-2.7-13.6-6-17.6-7.5-3.9-1.4-7.5-2.6-8-2.6-.4 0-14.4 13.6-31.2 30.3zM221 35.1c4.5-.1 7.9.5 11 1.9 2.5 1.1 5.8 3.3 7.3 4.8 1.6 1.4 3.8 4.4 5 6.6 2.2 4 2.2 4.1 2.7 100 .5 94.9.5 96.1 2.6 100.5 1.1 2.5 3.6 6.1 5.5 7.9 1.9 1.9 5.4 4.4 7.9 5.5 4.5 2.1 5.2 2.1 100.5 2.6 96 .5 96 .5 100 2.7 2.2 1.2 5.2 3.4 6.7 5s3.6 4.9 4.7 7.3c1.3 2.8 2 6.7 2.1 10 0 3.1-.7 10.3-1.6 16-.8 5.8-2.6 15.3-4 21-1.3 5.8-4.3 16.2-6.6 23-2.4 6.9-7.7 19.5-11.9 28-4.3 8.6-11.2 20.7-15.4 27-4.2 6.4-10.9 15.4-14.8 20-3.9 4.7-11.2 12.6-16.2 17.5-4.9 5-12.4 11.8-16.5 15.2-4.1 3.3-12.7 9.6-19 13.9-6.3 4.3-18.7 11.3-27.5 15.6-8.8 4.3-22.1 9.8-29.5 12.2-7.4 2.5-18.7 5.6-25 7-6.3 1.4-17.4 3.3-24.5 4.1-7.2.8-19.2 1.5-26.8 1.5-7.5 0-19.2-.7-26-1.5-6.7-.9-17.2-2.7-23.2-4-6.1-1.2-16.2-4-22.5-6-6.3-2-16.5-5.8-22.5-8.4-6.1-2.6-16-7.5-22-11-6.1-3.5-14.2-8.5-18-11.1-3.9-2.7-10.8-7.9-15.5-11.7-4.7-3.7-12.8-11-18-16.3-5.3-5.2-12.6-13.3-16.4-18-3.7-4.6-10.4-13.9-14.8-20.5s-10.8-17.8-14.3-25c-3.5-7.1-8-17.5-10-23-2.1-5.5-5-15.1-6.7-21.5-1.6-6.3-3.9-17.1-5.1-24-1.8-10.5-2.1-16.4-2.1-37 0-20.8.3-26.4 2.2-37.5 1.3-7.1 3.1-16.3 4.2-20.5 1-4.1 3.3-11.7 5-17 1.7-5.2 5.1-14.2 7.7-20 2.5-5.7 7-15 10.1-20.5 3-5.5 7.6-13.1 10.2-17 2.6-3.8 7.9-11 11.9-16 3.9-4.9 11.7-13.6 17.4-19.3 5.6-5.7 14.2-13.6 19.2-17.6 4.9-4.1 13.5-10.3 19-14 5.5-3.7 17.2-10.2 26-14.6 8.8-4.3 20-9.2 25-11 4.9-1.7 14.2-4.4 20.5-6.1 6.3-1.7 16.9-3.9 23.5-4.9 6.6-1 14.9-1.8 18.5-1.8zm-31.5 21.7c-5 1.1-12.8 3.2-17.5 4.7-4.7 1.5-12.3 4.2-17 6.2-4.7 1.9-12.8 5.6-18 8.3-5.2 2.7-13.6 7.5-18.5 10.7-5 3.2-13.5 9.5-19 13.9-5.5 4.5-14.6 12.9-20.3 18.7-5.6 5.9-13.5 15-17.5 20.4-4 5.4-9.7 13.8-12.7 18.7-3 5-7.8 14-10.6 20-2.9 6.1-6.8 15.5-8.7 21-1.9 5.5-4.6 14.8-6.1 20.5-1.4 5.8-3.3 15.3-4.1 21-.9 5.8-1.8 16.6-2.2 24-.3 7.7-.1 19.2.6 26.5.7 7.2 2.3 18.6 3.6 25.3 1.4 6.7 4.4 18.2 6.8 25.5 2.4 7.3 7.1 18.9 10.3 25.7 3.3 6.9 8.7 16.8 12 22 3.2 5.3 8.6 13.1 11.9 17.5 3.3 4.4 10.9 13.1 17 19.4 6 6.3 15 14.6 20 18.6 4.9 4 13.3 10.1 18.5 13.5 5.2 3.4 15.8 9.3 23.5 13.1 7.7 3.8 20.1 8.9 27.5 11.4 7.4 2.4 19.1 5.6 26 7 6.9 1.3 18.3 3 25.5 3.6 7.3.7 18.9.9 26.5.6 7.4-.3 18.2-1.3 24-2.1 5.8-.9 15.2-2.8 21-4.2 5.8-1.4 15-4.2 20.5-6.1 5.5-1.9 14.5-5.6 20-8.2 5.5-2.5 14.3-7.2 19.5-10.2 5.2-3.1 14.1-9 19.7-13.2 5.7-4.2 15.1-12.3 20.9-17.9 5.9-5.6 14.3-14.8 18.7-20.3 4.4-5.5 10.4-13.6 13.3-18 2.8-4.4 7.7-12.7 10.7-18.5 3.1-5.7 7.3-15 9.6-20.5 2.2-5.5 5.1-14 6.6-19 1.4-4.9 3.7-14.4 5-21 1.3-6.6 2.7-15.6 3-20 .6-7.1.5-8.2-1.3-10.5l-2-2.5-191.7-1c-8.5-3.4-13.4-6.1-16.4-8.2-3-2.1-7.2-6.2-9.3-9.3-2.1-3-4.9-7.9-6.1-11l-2.2-5.5-1-191.6c-4.2-3.3-6.4-3.9-9.5-3.8-2.5.1-8.3.7-13 1.5-4.7.7-12.6 2.2-17.5 3.3zm181 173.1h53l61-60.8c-4.4-12.1-7.9-20.3-10.6-25.9-2.7-5.6-5.3-10.3-5.7-10.3-.4 0-22.5 21.9-49.2 48.5zm77 0c41.1 0 42.6-.1 44.5-2 1.1-1.1 2.2-3 2.6-4.2.3-1.2-.2-7.2-1-13.3-.8-6-1.9-13.3-2.4-16.2-.5-2.9-1.3-5.3-1.8-5.3s-10.2 9.3-21.4 20.5zm-166-64.5.5 52 142.1-142c-8.4-7.7-14.4-12.5-18.8-15.6-4.3-3.2-8.5-6-9.3-6.3-1.1-.4-19.1 16.9-58 55.7zm13 64.5h52l113-112.9c-5.6-8.2-9.9-14-13.3-18.1-3.3-4.1-6.9-8.3-8-9.2-1.8-1.7-4.2.5-72.8 69.2z"
        style={{
          opacity: 1,
        }}
      />
    </Svg>
  );
};

export default Icon;
