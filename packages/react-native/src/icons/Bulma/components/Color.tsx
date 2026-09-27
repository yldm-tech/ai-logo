import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M11.25 0l-6 6 -1.5 10.5 7.5 7.5 9 -6 -6 -6 4.5 -4.5 -7.5 -7.5Z" fill="#00D1B2" />
    </Svg>
  );
});

Icon.displayName = "BulmaColor";

export default Icon;
