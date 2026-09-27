import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M1.875 0C0.836 0 0 0.836 0 1.875v20.25C0 23.164 0.836 24 1.875 24h20.25C23.164 24 24 23.164 24 22.125V1.875C24 0.836 23.164 0 22.125 0ZM2.25 6H3V18H2.25ZM9.335 6H10.125L5.29 18H4.499ZM16.125 6c3.314 0 6 2.686 6 6 0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6 0-3.314 2.686-6 6-6zm0 0.75c-2.899 0-5.25 2.351-5.25 5.25 0 2.899 2.351 5.25 5.25 5.25 2.899 0 5.25-2.351 5.25-5.25 0-2.899-2.351-5.25-5.25-5.25z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "WebdriverIOMono";

export default Icon;
