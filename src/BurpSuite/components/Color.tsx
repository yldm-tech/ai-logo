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
        d="M0 0v24h24V0Zm11.063 3.357h1.874v2.756L10.41 9.2h2.527v3.748h4.579l-4.578 5.592v2.104h-1.876v-2.758l2.528-3.086h-2.527V11.05h-4.58l4.58-5.592Z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
