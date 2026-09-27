import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M24 24H0V0h24L12 12Z" fill="#7F52FF" />
    </Svg>
  );
});

Icon.displayName = "KotlinColor";

export default Icon;
