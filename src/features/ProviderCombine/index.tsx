"use client";

import { Flexbox, FlexboxProps } from "@/primitives";
import { memo, useMemo } from "react";

import DefaultIcon from "../ProviderIcon/DefaultIcon";
import { providerMappings } from "../providerConfig";
import { ModelProviderKey } from "../providerEnum";

export interface ProviderCombineProps extends Omit<
  FlexboxProps,
  "children" | "horizontal" | "height" | "width" | "align" | "justify"
> {
  provider?: ModelProviderKey | string;
  size?: number;
  type?: "mono" | "color";
}

const ProviderCombine = memo<ProviderCombineProps>(
  ({ provider: originProvider, size = 12, type = "color", ...rest }) => {
    const Render = useMemo(() => {
      if (!originProvider) return;
      const provider = originProvider.toLowerCase();

      for (const item of providerMappings) {
        if (item.keywords.some((keyword) => keyword.toLowerCase() === provider)) {
          return item;
        }
      }
    }, [originProvider]);

    const iconProps = {
      size: size * (Render?.combineMultiple || 1),
      ...Render?.props,
    };

    // `type` goes only to the components that read it. The Text fallback is a plain icon that spreads
    // whatever it is given onto its <svg>, so passing it through put `type="mono"` in the DOM as an
    // invalid attribute for the ten brands that reach that branch.
    const combineProps = { ...iconProps, type };

    const icon = Render?.Combine ? (
      <Render.Combine {...combineProps} />
    ) : Render?.Icon?.Combine ? (
      <Render.Icon.Combine {...combineProps} />
    ) : Render?.Icon?.Text ? (
      <Render.Icon.Text {...iconProps} />
    ) : (
      <DefaultIcon size={size} />
    );

    return (
      <Flexbox
        align={"center"}
        flex={"none"}
        height={size * 1.5}
        horizontal
        width={"fit-content"}
        {...rest}
      >
        {icon}
      </Flexbox>
    );
  },
);

ProviderCombine.displayName = "ProviderCombine";

export default ProviderCombine;
