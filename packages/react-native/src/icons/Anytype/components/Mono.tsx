import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M5.333 0h13.334A5.322 5.322 0 0 1 24 5.333v13.334A5.322 5.322 0 0 1 18.667 24H5.333A5.322 5.322 0 0 1 0 18.667V5.333A5.322 5.322 0 0 1 5.333 0Zm10.334 7.667v-3H6.344v3zm0 0v11.666h3V7.667ZM9.5 19.333a4.833 4.833 0 1 0 0-9.666 4.833 4.833 0 0 0 0 9.666z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "AnytypeMono";

export default Icon;
