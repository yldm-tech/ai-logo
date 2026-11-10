/**
 * The few antd design tokens the fallback glyphs and the provider divider are painted with, written as the CSS variables antd 6 publishes, each with antd's default light-theme value as the fallback.
 *
 * These used to come from antd-style's `cssVar`, which emits the bare variable (`var(--ant-color-split)`) and pulls antd in to work out the names. antd only defines those variables on its own components, so outside one the bare variable resolved to nothing: the fallback avatars had no background and the fallback glyphs had no stroke. With the fallback written in, a page without antd gets antd's default colours, and anything rendered inside an antd component still follows that component's theme.
 */
export const cssVar = {
  colorFillSecondary: "var(--ant-color-fill-secondary, rgba(0, 0, 0, 0.06))",
  colorSplit: "var(--ant-color-split, rgba(5, 5, 5, 0.06))",
  colorTextDescription: "var(--ant-color-text-description, rgba(0, 0, 0, 0.45))",
} as const;
