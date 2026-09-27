import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M18.302 0H22v.003L10.674 24H7.662L2 12h3.727l3.449 7.337z" fill={color} />
    </Svg>
  );
});

Icon.displayName = "VerizonMono";

export default Icon;
