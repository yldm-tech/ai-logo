"use client";

import { memo } from "react";

import type { IconType } from "@/types";

import { TITLE } from "../style";

// Mono is traced from the app's official icon: its mark, without the tile, in one colour.
const Icon: IconType = memo(({ size = "1em", style, ...rest }) => {
  return (
    <svg
      fill="currentColor"
      fillRule="evenodd"
      height={size}
      style={{ flex: "none", lineHeight: 1, ...style }}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path d="M2.23 5.23c-0.54 0.12 -0.92 0.4 -1.15 0.84l-0.13 0.25 0 4.67 0 4.67 0.16 0.29c0.22 0.37 0.54 0.62 0.9 0.73 0.39 0.12 9.98 0.12 10.36 0.01 0.32 -0.1 0.73 -0.45 0.9 -0.78l0.13 -0.25 0.02 -4.58c0.02 -5.11 0.04 -4.87 -0.41 -5.36 -0.48 -0.53 -0.12 -0.5 -5.72 -0.51 -2.72 -0.01 -5 -0 -5.07 0.02zm1.29 3.03c0.22 0.12 2.41 2.19 2.47 2.34 0.04 0.07 0.05 0.21 0.02 0.29 -0.04 0.17 -2.27 2.29 -2.53 2.4 -0.34 0.15 -0.74 -0.2 -0.65 -0.55 0.03 -0.13 0.85 -0.94 1.75 -1.75l0.24 -0.21 -0.93 -0.85c-0.51 -0.47 -0.96 -0.93 -1.01 -1.02 -0.21 -0.4 0.24 -0.85 0.63 -0.64zm6.94 3.84c0.12 0.1 0.16 0.18 0.16 0.36 0 0.46 -0.09 0.49 -1.86 0.49 -1.78 -0 -1.86 -0.02 -1.86 -0.49 0 -0.46 0.09 -0.49 1.86 -0.49 1.47 -0 1.55 0.01 1.7 0.13z" />
    </svg>
  );
});

export default Icon;
