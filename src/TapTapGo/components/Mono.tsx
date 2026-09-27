"use client";

import { memo } from "react";

import type { IconType } from "@/types";

import { TITLE } from "../style";

const Icon: IconType = memo(({ size = "1em", style, ...rest }) => {
  return (
    <svg
      fill="currentColor"
      height={size}
      style={{ flex: "none", lineHeight: 1, ...style }}
      viewBox="8 15 88 88"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path
        d="M18 56a34 34 0 0 1 68 0v6q0 10-10 10H28q-10 0-10-10zM34.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0zM58.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0zM46.9 59.1Q52 63.9 57.1 59.1L54.9 56.9Q52 60.1 49.1 56.9z"
        fillRule="evenodd"
      />
      <path
        d="M22 62q-10 12-4 24M31 66q-6 13-1 22M39 69q-3 13 0 22M47.5 70q-1 12-2 22M56.5 70q1 12 2 22M65 69q3 13 0 22M73 66q6 13 1 22M82 62q10 12 4 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={6}
      />
      <path d="M14.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM26.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM35.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM42 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM55 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM61.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM70.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM82.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0z" />
    </svg>
  );
});

export default Icon;
