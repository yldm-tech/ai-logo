import { memo } from "react";

import ModelIcon, { findModelMapping } from "../ModelIcon";
import Tag, { type TagProps } from "./Tag";

export interface ModelTagProps extends Omit<TagProps, "icon" | "children"> {
  model: string;
  type?: "color" | "mono";
}
const ModelTag = memo<ModelTagProps>(({ type = "mono", model, ...rest }) => (
  <Tag
    icon={<ModelIcon model={model} type={type} />}
    // A matched model renders the brand's <svg>; an unmatched one renders the fallback glyph in a <span>.
    iconIsSvg={!!findModelMapping(model)}
    {...rest}
  >
    {model}
  </Tag>
));

ModelTag.displayName = "ModelTag";

export default ModelTag;
