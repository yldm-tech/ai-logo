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
      <path d="M11.1 3.96c-2.52 4.25 -3.2 4.89 -8.2 7.77 -0.22 0.13 -0.4 0.24 -0.4 0.26 0 0.02 0.18 0.13 0.4 0.25 5.16 2.97 5.86 3.67 8.85 8.85 0.12 0.22 0.23 0.4 0.25 0.4 0.02 -0 0.13 -0.18 0.25 -0.4 2.98 -5.17 3.67 -5.86 8.85 -8.85 0.22 -0.12 0.4 -0.23 0.4 -0.25 0 -0.02 -0.16 -0.12 -0.35 -0.22 -2.09 -1.21 -2.55 -1.51 -2.3 -1.51 0.26 -0 0.75 -0.57 0.89 -1.04 0.46 -1.57 -1.45 -2.75 -2.69 -1.67 -0.21 0.18 -0.5 0.72 -0.5 0.91 -0.01 0.33 -0.08 0.31 -0.59 -0.2 -1.03 -1.02 -1.71 -1.99 -3.39 -4.86 -0.29 -0.5 -0.54 -0.91 -0.56 -0.91 -0.02 -0 -0.41 0.66 -0.89 1.46zM4.48 16.85c-0.69 0.46 -0.38 1.51 0.44 1.51 0.67 -0 1.05 -0.68 0.72 -1.25 -0.22 -0.38 -0.79 -0.51 -1.15 -0.27z" />
    </svg>
  );
});

export default Icon;
