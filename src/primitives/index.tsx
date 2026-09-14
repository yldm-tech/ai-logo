"use client";

/**
 * Local stand-ins for the handful of primitives this package used to take from
 * @lobehub/ui. They exist so the published package has no peer dependency on a
 * component library — installing it used to pull @lobehub/ui in transitively,
 * which meant a consumer wanting six icons got a whole UI kit with them.
 *
 * Only the props the features actually pass are supported. This is deliberately
 * not a general-purpose layout library.
 */
import { type CSSProperties, type ComponentType, type HTMLAttributes, forwardRef } from "react";

export type DivProps = HTMLAttributes<HTMLDivElement>;

export interface FlexboxProps extends DivProps {
  align?: CSSProperties["alignItems"];
  flex?: CSSProperties["flex"];
  gap?: CSSProperties["gap"];
  height?: CSSProperties["height"];
  /** Lay children out in a row. Defaults to a column, matching the API this replaces. */
  horizontal?: boolean;
  justify?: CSSProperties["justifyContent"];
  padding?: CSSProperties["padding"];
  width?: CSSProperties["width"];
}

export const Flexbox = forwardRef<HTMLDivElement, FlexboxProps>(
  ({ align, flex, gap, height, horizontal, justify, padding, style, width, ...rest }, ref) => (
    <div
      ref={ref}
      style={{
        alignItems: align,
        display: "flex",
        flex,
        flexDirection: horizontal ? "row" : "column",
        gap,
        height,
        justifyContent: justify,
        padding,
        width,
        ...style,
      }}
      {...rest}
    />
  ),
);

Flexbox.displayName = "Flexbox";

export type CenterProps = FlexboxProps;

export const Center = forwardRef<HTMLDivElement, CenterProps>(
  ({ align = "center", justify = "center", ...rest }, ref) => (
    <Flexbox align={align} justify={justify} ref={ref} {...rest} />
  ),
);

Center.displayName = "Center";

export interface IconProps extends Omit<DivProps, "color"> {
  color?: string;
  icon: ComponentType<{ color?: string; size?: number | string }>;
  size?: number;
}

/**
 * Renders an icon component at a given size and colour inside a square box, so
 * the glyph sits on the text baseline the way the surrounding layout expects.
 */
export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ color, icon: Component, size = 16, style, ...rest }, ref) => (
    <span
      ref={ref}
      style={{
        alignItems: "center",
        display: "inline-flex",
        flex: "none",
        height: "1em",
        justifyContent: "center",
        lineHeight: 1,
        width: "1em",
        ...style,
      }}
      {...rest}
    >
      <Component color={color} size={size} />
    </span>
  ),
);

Icon.displayName = "Icon";
