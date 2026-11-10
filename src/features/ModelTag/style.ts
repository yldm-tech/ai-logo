import type { CSSProperties } from "react";

/**
 * antd 6's Tag in its default light theme, written out as inline styles. ModelTag used to render antd's Tag, which made antd a peer of this package; these are the values its stylesheet resolved to, so a tag looks the same without antd installed. The palette is antd's `color-1`, `color-3`, `color-6` and `color-7` steps for each preset, the four status colours are its `colorX`, `colorXBg` and `colorXBorder` tokens.
 */

export const PRESET_COLORS = {
  blue: ["#e6f4ff", "#91caff", "#1677ff", "#0958d9"],
  cyan: ["#e6fffb", "#87e8de", "#13c2c2", "#08979c"],
  geekblue: ["#f0f5ff", "#adc6ff", "#2f54eb", "#1d39c4"],
  gold: ["#fffbe6", "#ffe58f", "#faad14", "#d48806"],
  green: ["#f6ffed", "#b7eb8f", "#52c41a", "#389e0d"],
  lime: ["#fcffe6", "#eaff8f", "#a0d911", "#7cb305"],
  magenta: ["#fff0f6", "#ffadd2", "#eb2f96", "#c41d7f"],
  orange: ["#fff7e6", "#ffd591", "#fa8c16", "#d46b08"],
  pink: ["#fff0f6", "#ffadd2", "#eb2f96", "#c41d7f"],
  purple: ["#f9f0ff", "#d3adf7", "#722ed1", "#531dab"],
  red: ["#fff1f0", "#ffa39e", "#f5222d", "#cf1322"],
  volcano: ["#fff2e8", "#ffbb96", "#fa541c", "#d4380d"],
  yellow: ["#feffe6", "#fffb8f", "#fadb14", "#d4b106"],
} as const;

/** `[color, background, border]` for each status. `default` is a status too, and only changes a solid tag's text colour. */
export const STATUS_COLORS = {
  error: ["#ff4d4f", "#fff2f0", "#ffccc7"],
  processing: ["#1677ff", "#e6f4ff", "#91caff"],
  success: ["#52c41a", "#f6ffed", "#b7eb8f"],
  warning: ["#faad14", "#fffbe6", "#ffe58f"],
} as const;

export type PresetColor = keyof typeof PRESET_COLORS;
export type PresetStatusColor = keyof typeof STATUS_COLORS | "default";

const TEXT = "rgba(0, 0, 0, 0.88)";
const TEXT_DISABLED = "rgba(0, 0, 0, 0.25)";
const BG_DISABLED = "rgba(0, 0, 0, 0.04)";
/** colorFillTertiary laid over colorBgContainer, which is how antd works out the tag's background. */
const BG_DEFAULT = "#f5f5f5";
const BORDER = "#d9d9d9";

export const rootStyle: CSSProperties = {
  backgroundColor: BG_DEFAULT,
  border: `1px solid ${BORDER}`,
  borderRadius: 4,
  boxSizing: "border-box",
  color: TEXT,
  display: "inline-block",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  fontSize: 12,
  height: "auto",
  lineHeight: "20px",
  listStyle: "none",
  margin: 0,
  opacity: 1,
  padding: "0 7px",
  position: "relative",
  textAlign: "start",
  transition: "all 0.2s",
  whiteSpace: "nowrap",
};

export const variantStyle: Record<"filled" | "outlined" | "solid", CSSProperties> = {
  filled: { backgroundColor: BG_DEFAULT, borderColor: "transparent" },
  outlined: {},
  solid: { backgroundColor: "rgb(0, 0, 0)", borderColor: "transparent", color: "#fff" },
};

export const disabledStyle: CSSProperties = {
  backgroundColor: BG_DISABLED,
  color: TEXT_DISABLED,
  cursor: "not-allowed",
};

export const presetStyle = (
  color: PresetColor,
  variant: keyof typeof variantStyle,
): CSSProperties => {
  const [light, lightBorder, dark, text] = PRESET_COLORS[color];
  if (variant === "solid") return { backgroundColor: dark, borderColor: dark, color: "#fff" };
  if (variant === "outlined")
    return { backgroundColor: light, borderColor: lightBorder, color: text };
  return { backgroundColor: light, color: text };
};

export const statusStyle = (
  status: PresetStatusColor,
  variant: keyof typeof variantStyle,
): CSSProperties => {
  if (status === "default") return {};
  const [color, bg, border] = STATUS_COLORS[status];
  if (variant === "solid") return { backgroundColor: color, borderColor: color };
  if (variant === "outlined") return { backgroundColor: bg, borderColor: border, color };
  return { backgroundColor: bg, color };
};

const toHex = (n: number) => n.toString(16).padStart(2, "0");

/**
 * The background antd gives a tag with a custom colour: the same hue and saturation at 95% lightness. Hex colours are converted here exactly as antd's FastColor does, so the result is the same hex; anything else is left to the browser's relative colour syntax.
 */
export const tint = (color: string): string => {
  const hex = color.trim().replace(/^#/, "");
  if (!/^[\da-f]{3,8}$/i.test(hex)) return `hsl(from ${color} h s 95%)`;

  const short = hex.length < 6;
  const channel = (i: number) =>
    parseInt(short ? hex[i] + hex[i] : hex.slice(i * 2, i * 2 + 2), 16);
  const [r, g, b] = [channel(0), channel(1), channel(2)];
  const hasAlpha = short ? hex.length === 4 : hex.length === 8;
  const a = hasAlpha ? channel(3) / 255 : 1;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = 0.95;
  let out: [number, number, number];
  if (delta === 0) {
    const v = Math.round(l * 255);
    out = [v, v, v];
  } else {
    const h = Math.round(
      60 *
        (r === max
          ? (g - b) / delta + (g < b ? 6 : 0)
          : g === max
            ? (b - r) / delta + 2
            : (r - g) / delta + 4),
    );
    const s = delta / 255 / (1 - Math.abs(2 * ((max + min) / 510) - 1));
    const hue = (((h % 360) + 360) % 360) / 60;
    const chroma = (1 - Math.abs(2 * l - 1)) * s;
    const x = chroma * (1 - Math.abs((hue % 2) - 1));
    const [r1, g1, b1] =
      hue < 1
        ? [chroma, x, 0]
        : hue < 2
          ? [x, chroma, 0]
          : hue < 3
            ? [0, chroma, x]
            : hue < 4
              ? [0, x, chroma]
              : hue < 5
                ? [x, 0, chroma]
                : [chroma, 0, x];
    const m = l - chroma / 2;
    out = [r1, g1, b1].map((c) => Math.round((c + m) * 255)) as [number, number, number];
  }
  return `#${out.map(toHex).join("")}${a < 1 ? toHex(Math.round(a * 255)) : ""}`;
};

export const iconStyle: CSSProperties = {
  display: "inline-block",
  marginBlockEnd: "0.2em",
  verticalAlign: "middle",
};

/** The gap antd puts between a bare `<svg>` icon and the text, and between the text and the close button. */
export const GAP = 7;

export const closeStyle: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  alignItems: "center",
  boxSizing: "border-box",
  color: "rgba(0, 0, 0, 0.45)",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: 10,
  fontStyle: "normal",
  lineHeight: 0,
  textAlign: "center",
  textRendering: "optimizeLegibility",
  textTransform: "none",
  transition: "all 0.2s",
  verticalAlign: "-0.125em",
};

export const CLOSE_HOVER_COLOR = TEXT;
