import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M7.844 0v3.38l5.75 3.32v10.148l2.705 1.552c1.676.967 3.045.388 3.045-1.285V9.668c-.014-1.687-1.382-3.832-3.059-4.799L7.844 0zM4.656 2.932v16.574L12.436 24V7.426l-7.78-4.494Z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "PackerMono";

export default Icon;
