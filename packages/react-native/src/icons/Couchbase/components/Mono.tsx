import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M20.111 14.104a1.467 1.458 0 0 1-1.235 1.503c-1.422.244-4.385.398-6.875.398s-5.454-.15-6.877-.398c-.814-.14-1.235-.787-1.235-1.503V9.417a1.57 1.56 0 0 1 1.235-1.505 15.72 15.619 0 0 1 2.156-.14.537.533 0 0 1 .523.543v3.303c1.463 0 2.727-.086 4.201-.086 1.474 0 2.727.086 4.196.086V8.342a.535.532 0 0 1 .494-.569h.027a15.995 15.891 0 0 1 2.156.14 1.57 1.56 0 0 1 1.234 1.504zM12.001 0C5.373 0 0 5.374 0 12c0 6.628 5.373 12 12 12 6.628 0 12-5.372 12-12 0-6.626-5.373-12-12-12z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "CouchbaseMono";

export default Icon;
