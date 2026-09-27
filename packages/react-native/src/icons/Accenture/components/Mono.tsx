import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="m.66 16.95 13.242-4.926L.66 6.852V0l22.68 9.132v5.682L.66 24Z" fill={color} />
    </Svg>
  );
});

Icon.displayName = "AccentureMono";

export default Icon;
