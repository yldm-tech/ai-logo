import { DivProps, Flexbox } from "@/primitives";
import { ReactNode, memo } from "react";

import { cssVar } from "../cssVar";

const Combine = memo<DivProps & { left: ReactNode; right: ReactNode; size: number }>(
  ({ left, right, size = 24, ...rest }) => {
    return (
      <Flexbox align={"center"} flex={"none"} gap={size / 3} horizontal {...rest}>
        {left}
        {/* What antd's vertical Divider drew here. Its height and offset are in em of antd's 14px base font, so the font size is pinned to keep the rule the same length whatever the surrounding text is. */}
        <div
          role={"separator"}
          style={{
            borderInlineStart: `1px solid ${cssVar.colorSplit}`,
            boxSizing: "border-box",
            display: "inline-block",
            fontSize: 14,
            height: "0.9em",
            marginBlock: 0,
            marginInline: size / 6,
            position: "relative",
            top: "-0.06em",
            verticalAlign: "middle",
          }}
        />
        {right}
      </Flexbox>
    );
  },
);

export default Combine;
