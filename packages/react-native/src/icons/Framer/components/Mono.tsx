import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill={color} />
    </Svg>
  );
});

Icon.displayName = "FramerMono";

export default Icon;
