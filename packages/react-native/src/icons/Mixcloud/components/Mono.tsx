import React, { memo } from "react";
import { Path, Svg } from "react-native-svg";

import type { RNIconProps } from "@/features";

const Icon = memo<RNIconProps>(({ size = 24, style, color = "#000000", ...rest }) => {
  return (
    <Svg color={color} height={size} style={style} viewBox="0 0 24 24" width={size} {...rest}>
      <Path
        d="M2.462 8.596l1.372 6.49h.319l1.372-6.49h2.462v6.808H6.742v-5.68l.232-.81h-.402l-1.43 6.49H2.854l-1.44-6.49h-.391l.222.81v5.68H0V8.596zM24 8.63v1.429L21.257 12 24 13.941v1.43l-3.235-2.329h-.348l-3.226 2.329v-1.43l2.734-1.94-2.733-1.942V8.63l3.225 2.338h.348zm-7.869 2.75v1.24H9.304v-1.24z"
        fill={color}
      />
    </Svg>
  );
});

Icon.displayName = "MixcloudMono";

export default Icon;
