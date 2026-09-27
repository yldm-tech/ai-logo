import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M24 3.7l-5.766 5.766 5.725 5.736-3.713 3.712L5.073 3.742 8.786.03l5.736 5.726L20.284 0 24 3.7zM.029 8.785l3.713-3.713 15.173 15.173-3.713 3.714-5.732-5.726L3.7 24 0 20.285l5.754-5.764L.029 8.785z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "CapacitorMono";

export default Icon;
