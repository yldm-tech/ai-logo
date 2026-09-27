"use client";

import { memo } from "react";

import type { IconType } from "@/types";

import { COLOR_PRIMARY, TITLE } from "../style";

const Icon: IconType = memo(({ size = "1em", style, ...rest }) => {
  return (
    <svg
      height={size}
      style={{ flex: "none", lineHeight: 1, ...style }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path
        d="m6.505 18.998 4.434-11.345a4.168 4.168 0 0 1 3.882-2.651h2.674l-4.434 11.345a4.169 4.169 0 0 1-3.883 2.651H6.505Zm6.505 0 4.434-11.345a4.169 4.169 0 0 1 3.883-2.651H24l-4.434 11.345a4.168 4.168 0 0 1-3.882 2.651H13.01Zm-13.01 0L4.434 7.653a4.168 4.168 0 0 1 3.882-2.651h2.674L6.556 16.347a4.169 4.169 0 0 1-3.883 2.651H0Z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
