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
        d="M3.556 0L.392 1.846V4.11l7.124 17.3L11.998 24l4.523-2.611 7.083-17.345V1.848l.004-.002L20.44 0l-5.274 3.087v2.111l-3.168 7.384-3.164-7.384V3.109l-.017-.008.017-.01z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
