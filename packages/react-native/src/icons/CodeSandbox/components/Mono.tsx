import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M0 24H24V0H0V2.45455H21.5455V21.5455H2.45455V0H0Z" fill={color} />
    </Svg>
  );
});

Icon.displayName = "CodeSandboxMono";

export default Icon;
