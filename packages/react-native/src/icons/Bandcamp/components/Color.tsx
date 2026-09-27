import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, ...rest }) => {
  return (
    <Svg height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path d="M0 18.75l7.437-13.5H24l-7.438 13.5H0z" fill="#408294" />
    </Svg>
  );
});

Icon.displayName = "BandcampColor";

export default Icon;
