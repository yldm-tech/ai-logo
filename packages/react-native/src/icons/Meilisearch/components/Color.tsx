import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="m6.505 18.998 4.434-11.345a4.168 4.168 0 0 1 3.882-2.651h2.674l-4.434 11.345a4.169 4.169 0 0 1-3.883 2.651H6.505Zm6.505 0 4.434-11.345a4.169 4.169 0 0 1 3.883-2.651H24l-4.434 11.345a4.168 4.168 0 0 1-3.882 2.651H13.01Zm-13.01 0L4.434 7.653a4.168 4.168 0 0 1 3.882-2.651h2.674L6.556 16.347a4.169 4.169 0 0 1-3.883 2.651H0Z"
        fill="#FF5CAA"
      />
    </Svg>
  );
});

Icon.displayName = "MeilisearchColor";

export default Icon;
