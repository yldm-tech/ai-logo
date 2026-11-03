"use client";

import { memo } from "react";

import type { IconType } from "@/types";

import { TITLE } from "../style";

// Mono is traced from the app's official icon (echoVic/liubai resources/icon.png). The grey square is the tile, so the mark is the page: its spine and outline, with the text lines knocked out.
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
      <path d="M2.48 0.94c-0.1 0.06 -0.09 21.96 0.02 22.08 0.04 0.05 0.1 0.09 0.13 0.09 0.06 -0 0.25 -0.19 0.25 -0.26 0 -0.1 0.09 -0.1 0.32 0.02l0.24 0.13 8.58 0.01 8.58 0.01 0.28 -0.12c0.34 -0.15 0.44 -0.24 0.62 -0.55l0.14 -0.25 0 -10.11c0 -9.73 -0 -10.12 -0.08 -10.27 -0.2 -0.37 -0.46 -0.57 -0.93 -0.72 -0.12 -0.04 -2.44 -0.05 -8.56 -0.05l-8.4 -0 -0.31 0.12c-0.49 0.18 -0.47 0.18 -0.47 0.08 0 -0.18 -0.24 -0.3 -0.4 -0.2zm15.4 5.45c0.07 0.07 0.07 0.9 0 0.97 -0.08 0.08 -11.68 0.08 -11.76 -0 -0.06 -0.06 -0.08 -0.94 -0.02 -0.99 0.06 -0.06 11.72 -0.04 11.78 0.02zm-1.48 3.11c0.03 0.04 0.05 0.19 0.04 0.4l-0.01 0.33 -5.17 -0 -5.17 -0 -0.01 -0.33c-0.01 -0.21 0.01 -0.36 0.04 -0.4 0.08 -0.09 10.21 -0.09 10.28 -0zm1.48 2.15c0.08 0.08 0.07 0.64 -0.01 0.71 -0.04 0.04 -1.63 0.04 -5.92 0.04l-5.86 -0.01 -0.01 -0.33c-0.01 -0.21 0.01 -0.36 0.04 -0.4 0.07 -0.09 11.68 -0.09 11.76 -0.01zm-3.52 2.53l0 0.36 -4.13 -0 -4.13 -0 -0.01 -0.31c-0.01 -0.17 -0 -0.34 0.01 -0.37 0.02 -0.05 0.71 -0.06 4.15 -0.05l4.13 0.01 0 0.36z" />
    </svg>
  );
});

export default Icon;
