import React from "react";
import Svg from "../Svg/Svg";
import { SvgProps } from "../Svg/types";

const Icon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 128 128" {...props}>
      <defs>
        <clipPath id="clip1">
          <path d="M36 55h75v80H36zm0 0"></path>
        </clipPath>
        <clipPath id="clip2">
          <path d="M71.375 127.563c0-11.626-.094-39.626-23.094-47.907 0 0 13.375 7 17.188 27.469 0 0-26.531 5.344-29.156-38.875 0 0 36.124 0 40.218 29.656 0 0 7.125-17.687 33.719-12.531 0 0-1.344 19.156-24.313 22.469 0 0-.374-10.125 12.813-17.125 0 0-20.156.375-20.156 36.844v.53c-1.625 1.876-2.844 3.97-3.75 6.22-.844-2.125-1.969-4.094-3.438-5.875v-.875zm4.313-42.22c-2.157-5.843-5.032-20.78 17.28-29.624 0 0 5.5 27-13.53 31.593-.563-6.03 1.874-14.812 5.53-19.124-4.343 3.03-8.156 11.062-9.28 17.156zm0 0"></path>
        </clipPath>
        <linearGradient
          id="linear0"
          x1="-1018.386"
          x2="-1018.308"
          y1="1070.881"
          y2="1070.881"
          gradientTransform="scale(940.19 999.42531) rotate(-90 -1044.528 26.276)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#0E7139"></stop>
          <stop offset="1" stopColor="#A7CF38"></stop>
        </linearGradient>
        <linearGradient
          id="linear1"
          x1="15.457"
          x2="46.793"
          y1="39.801"
          y2="12.264"
          gradientTransform="scale(3.125)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#108040"></stop>
          <stop offset="1" stopColor="#E5E875"></stop>
        </linearGradient>
        <linearGradient
          id="linear2"
          x1="3.884"
          x2="35.219"
          y1="26.631"
          y2="-0.906"
          gradientTransform="scale(3.125)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#108040"></stop>
          <stop offset="1" stopColor="#E5E875"></stop>
        </linearGradient>
        <linearGradient
          id="linear3"
          x1="10.68"
          x2="42.015"
          y1="34.364"
          y2="6.827"
          gradientTransform="scale(3.125)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#108040"></stop>
          <stop offset="1" stopColor="#E5E875"></stop>
        </linearGradient>
      </defs>
      <g>
        <g clipPath="url(#clip1)">
          <g clipPath="url(#clip2)">
            <path
              fill="url(#linear0)"
              d="M36.281 55.719h73.938v78.594H36.28zm0 0"
            ></path>
          </g>
        </g>
        <path
          fill="url(#linear1)"
          d="M114.125 38.781c14.063 19.157 15.906 49.407-.344 69.969-19.312 24.406-55.937 26.938-79 8.688-7.875-6.22-13.406-14.313-16.531-23.25 2.875 12.28 9.75 23.687 20.406 32.093 25.032 19.813 61.407 15.563 81.219-9.469 18.813-23.75 15.969-57.687-5.75-78.03zm0 0"
        ></path>
        <path
          fill="url(#linear2)"
          d="M74.438 25.281c-26.313 2.407-36.532 19.75-36.532 19.75 4.688 7.5 17.563 9.094 25.875 6.5 5.063-1.593 9.563-4.625 14-7.531 4.438-2.938 9.031-5.813 14.219-7.094 5.188-1.281 11.094-.625 15.063 2.938-3.97-8.719-10.563-16.219-18.688-21.25-8.125-5.032-17.781-7.625-27.344-7.344-7.218.219-14.562 2.188-20.156 6.719-5.594 4.531-8.75 11.781-8.5 18.531 16.094-16.313 42.063-11.219 42.063-11.219zm0 0"
        ></path>
        <path
          fill="url(#linear3)"
          d="M68.688 127.406c28.218 0 51.062-22.875 51.062-51.062 0-.563 0-1.094-.031-1.656-.844 25.687-21.906 46.25-47.813 46.25-26.406 0-47.844-21.407-47.844-47.844 0-25.875 20.563-46.969 46.25-47.813-.53-.031-1.093-.031-1.656-.031-28.219 0-51.062 22.875-51.062 51.063 0 28.187 22.906 51.093 51.093 51.093zm0 0"
        ></path>
      </g>
    </Svg>
  );
};

export default Icon;
