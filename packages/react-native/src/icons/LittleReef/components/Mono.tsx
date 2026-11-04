import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M10.74 2.6c-7.89 1.07 -11.05 10.84 -5.27 16.3 5.3 5.02 14.08 2.39 15.76 -4.72 1.52 -6.44 -3.94 -12.47 -10.49 -11.59zm2.02 1.57c6.86 0.75 9.58 9.2 4.43 13.76 -4.5 3.98 -11.66 1.59 -12.91 -4.3 -1.09 -5.16 3.27 -10.03 8.48 -9.46zM6.69 12.01c0 1.28 0.01 2.33 0.03 2.33 0.03 -0 2.52 -2.29 2.52 -2.33 0 -0.03 -2.49 -2.33 -2.52 -2.33 -0.02 -0 -0.03 1.05 -0.03 2.33zM12.26 9.79c-2.83 0.44 -3.61 2.9 -1.27 4.05 2.09 1.03 4.97 0.17 5.32 -1.59 0.3 -1.49 -1.86 -2.8 -4.04 -2.46zm2.5 0.95c0.42 0.28 0.22 0.97 -0.28 0.97 -0.5 -0 -0.7 -0.61 -0.31 -0.93 0.15 -0.12 0.44 -0.14 0.6 -0.03z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
});

export default Icon;
