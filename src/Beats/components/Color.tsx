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
        d="M12.0099 15.5996A3.5995 3.5995 0 1 0 8.4103 12a3.5995 3.5995 0 0 0 3.5996 3.5996zm0-15.5981a11.9985 11.9985 0 0 0-3.5996.552v6.6471A5.9992 5.9992 0 1 1 6.0106 12V1.6033A11.9985 11.9985 0 1 0 12.01.0015z"
        fill={COLOR_PRIMARY}
      />
    </svg>
  );
});

export default Icon;
