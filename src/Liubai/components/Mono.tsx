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
      <path d="M0 12l0 12 0.2 -0 0.2 -0 0 -12 0 -12 -0.2 -0 -0.2 -0 0 12zM4.32 0.98c-0.09 0.11 -0.09 21.94 0 22.05 0.07 0.09 0.28 0.1 0.36 0.02 0.08 -0.08 0.08 -22.01 0 -22.09 -0.08 -0.08 -0.28 -0.07 -0.36 0.02zM7.97 6.89l0 0.5 5.9 -0 5.9 -0 0 -0.5 0 -0.5 -5.9 -0 -5.9 -0 0 0.5zM7.97 9.86l0 0.36 5.16 -0 5.16 -0 0 -0.36 0 -0.36 -5.16 -0 -5.16 -0 0 0.36zM7.97 12.02l0 0.36 5.9 -0 5.9 -0 0 -0.36 0 -0.36 -5.9 -0 -5.9 -0 0 0.36zM7.97 14.18l0 0.36 4.12 -0 4.12 -0 0 -0.36 0 -0.36 -4.12 -0 -4.12 -0 0 0.36z" />
    </svg>
  );
});

export default Icon;
