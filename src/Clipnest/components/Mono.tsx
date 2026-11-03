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
      <path d="M6.26 0.97c-1.58 0.27 -2.94 1.6 -3.38 3.3 -0.22 0.86 -0.26 14.32 -0.04 15.34 0.37 1.73 1.67 3.03 3.38 3.39 0.86 0.18 10.76 0.18 11.63 -0 1.34 -0.28 2.43 -1.14 3.04 -2.41l0.34 -0.71 0.02 -7.6c0.02 -8.18 0.03 -8.04 -0.4 -8.94 -0.48 -0.99 -1.25 -1.7 -2.35 -2.16l-0.63 -0.26 -5.6 -0.02c-3.08 -0 -5.79 0.02 -6.02 0.06zm11.85 2.43c0.46 0.3 0.82 0.8 0.94 1.34 0.06 0.3 0.08 2.51 0.06 7.54l-0.02 7.12 -0.18 0.33c-0.24 0.45 -0.55 0.75 -1.03 0.99l-0.39 0.2 -5.44 -0c-6.12 -0 -5.81 0.03 -6.46 -0.62 -0.62 -0.63 -0.58 -0.02 -0.61 -8.22l-0.02 -7.32 0.24 -0.49c0.26 -0.52 0.62 -0.86 1.11 -1.04 0.22 -0.09 1.46 -0.1 5.85 -0.09l5.56 0.02 0.38 0.24zM7.44 8.28l0 0.84 4.48 -0 4.48 -0 0 -0.84 0 -0.84 -4.48 -0 -4.48 -0 0 0.84zM7.44 13.2l0 0.88 3.32 -0 3.32 -0 0 -0.88 0 -0.88 -3.32 -0 -3.32 -0 0 0.88z" />
    </svg>
  );
});

export default Icon;
