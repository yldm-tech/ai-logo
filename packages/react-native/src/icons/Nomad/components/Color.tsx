import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="m12.004 0-10.4 6v12l10.392 6 10.4-6V6L12.004 0zm4.639 13.204-2.77 1.6-3.347-1.832v3.826l-3.144 1.995V10.8L9.88 9.272l3.462 1.823V7.191l3.301-1.984v7.997z"
        fill="#00CA8E"
      />
    </Svg>
  );
});

Icon.displayName = "NomadColor";

export default Icon;
