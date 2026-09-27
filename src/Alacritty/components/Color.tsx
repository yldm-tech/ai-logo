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
        d="m10.065 0-8.57 21.269h3.595l6.91-16.244 6.91 16.244h3.594l-8.57-21.269zm1.935 9.935c-0.76666 1.8547-1.5334 3.7094-2.298 5.565 1.475 4.54 1.475 4.54 2.298 8.5 0.823-3.96 0.823-3.96 2.297-8.5-0.76637-1.8547-1.5315-3.7099-2.297-5.565z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
