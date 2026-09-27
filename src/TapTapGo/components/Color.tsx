"use client";

import { memo } from "react";

import type { IconType } from "@/types";

import { TITLE } from "../style";

const Icon: IconType = memo(({ size = "1em", style, ...rest }) => {
  return (
    <svg
      height={size}
      style={{ flex: "none", lineHeight: 1, ...style }}
      viewBox="8 15 88 88"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{TITLE}</title>
      <path
        d="M22 62q-10 12-4 24M31 66q-6 13-1 22M39 69q-3 13 0 22M47.5 70q-1 12-2 22M56.5 70q1 12 2 22M65 69q3 13 0 22M73 66q6 13 1 22M82 62q10 12 4 24"
        fill="none"
        stroke="#9C86F0"
        strokeLinecap="round"
        strokeWidth={6}
      />
      <path
        d="M14.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM26.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM35.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM42 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM55 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM61.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM70.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM82.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0z"
        fill="#FFD6E7"
      />
      <path d="M18 56a34 34 0 0 1 68 0v6q0 10-10 10H28q-10 0-10-10z" fill="#B4A2FF" />
      <ellipse cx="40" cy="30" fill="#fff" opacity={0.45} rx="8" ry="5" />
      <path
        d="M34.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0zM58.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0z"
        fill="#2E2450"
      />
      <path
        d="M40.2 48a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0zM64.2 48a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0z"
        fill="#fff"
      />
      <path d="M48 58q4 4 8 0" fill="none" stroke="#2E2450" strokeLinecap="round" strokeWidth={3} />
      <ellipse cx="31" cy="59" fill="#FF8FB8" opacity={0.75} rx="5" ry="3" />
      <ellipse cx="73" cy="59" fill="#FF8FB8" opacity={0.75} rx="5" ry="3" />
    </svg>
  );
});

export default Icon;
