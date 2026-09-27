import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="8 15 88 88" width={size} {...rest}>
      <Path
        d="M18 56a34 34 0 0 1 68 0v6q0 10-10 10H28q-10 0-10-10zM34.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0zM58.5 50a5.5 5.5 0 1 0 11 0a5.5 5.5 0 1 0 -11 0zM46.9 59.1Q52 63.9 57.1 59.1L54.9 56.9Q52 60.1 49.1 56.9z"
        fill={color}
        fillRule="evenodd"
      />
      <Path
        d="M22 62q-10 12-4 24M31 66q-6 13-1 22M39 69q-3 13 0 22M47.5 70q-1 12-2 22M56.5 70q1 12 2 22M65 69q3 13 0 22M73 66q6 13 1 22M82 62q10 12 4 24"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={6}
      />
      <Path
        d="M14.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM26.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM35.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM42 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM55 92a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM61.5 91a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM70.5 88a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0zM82.5 86a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "TapTapGoMono";

export default Icon;
