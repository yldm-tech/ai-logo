import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M4 21 20 21 10 24zM4 20 10 19 10 8zM11 19 20 20 11 0z" fill="#466BB0" />
    </Svg>
  );
});

Icon.displayName = "IstioColor";

export default Icon;
