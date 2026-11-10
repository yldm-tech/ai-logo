"use client";

import { Center, type CenterProps } from "@/primitives";
import { CSSProperties, memo } from "react";

import { IconType } from "@/types";

import { getAvatarShadow } from "./util";

export interface IconAvatarProps extends Omit<CenterProps, "children"> {
  Icon?: IconType;
  background?: string;
  color?: string;
  iconClassName?: string;
  iconMultiple?: number;
  iconStyle?: CSSProperties;
  shape?: "circle" | "square";
  size: number;
}

const IconAvatar = memo<IconAvatarProps>(
  ({
    shape = "circle",
    color = "#fff",
    background,
    size,
    style,
    iconMultiple = 0.75,
    Icon,
    iconStyle,
    iconClassName,
    ...rest
  }) => {
    return (
      <Center
        flex={"none"}
        style={{
          background,
          borderRadius: shape === "circle" ? "50%" : Math.floor(size * 0.1),
          // The dark-mode ring came from antd-style's ThemeProvider, which this package no longer depends on. Without that provider antd-style always reported light mode, so this is what every page that did not wrap the icons in it already rendered.
          boxShadow: getAvatarShadow(false, background),
          color,
          height: size,
          overflow: "hidden",
          width: size,
          ...style,
        }}
        {...rest}
      >
        {Icon && (
          <Icon
            className={iconClassName}
            color={color}
            size={size}
            style={{
              transform: `scale(${iconMultiple})`,
              ...iconStyle,
            }}
          />
        )}
      </Center>
    );
  },
);

export default IconAvatar;
