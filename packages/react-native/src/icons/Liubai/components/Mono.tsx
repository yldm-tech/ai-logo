import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M0 12l0 12 0.2 -0 0.2 -0 0 -12 0 -12 -0.2 -0 -0.2 -0 0 12zM4.32 0.98c-0.09 0.11 -0.09 21.94 0 22.05 0.07 0.09 0.28 0.1 0.36 0.02 0.08 -0.08 0.08 -22.01 0 -22.09 -0.08 -0.08 -0.28 -0.07 -0.36 0.02zM7.97 6.89l0 0.5 5.9 -0 5.9 -0 0 -0.5 0 -0.5 -5.9 -0 -5.9 -0 0 0.5zM7.97 9.86l0 0.36 5.16 -0 5.16 -0 0 -0.36 0 -0.36 -5.16 -0 -5.16 -0 0 0.36zM7.97 12.02l0 0.36 5.9 -0 5.9 -0 0 -0.36 0 -0.36 -5.9 -0 -5.9 -0 0 0.36zM7.97 14.18l0 0.36 4.12 -0 4.12 -0 0 -0.36 0 -0.36 -4.12 -0 -4.12 -0 0 0.36z"
        fill={color}
        fillRule="evenodd"
      />
    </Svg>
  );
});

export default Icon;
