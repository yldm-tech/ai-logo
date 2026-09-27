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
        d="m10.278 15.443 1.705 1.705-3.426 3.426-3.427-3.426 8.592-8.591-1.705-1.705 3.426-3.426 3.427 3.426-8.592 8.591zM0 12.017l3.426 3.426 8.591-8.59-3.426-3.427L0 12.017zm11.983 5.13 3.426 3.427L24 11.983l-3.426-3.426-8.591 8.59z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
