import { toc } from "@yldm-tech/ai-logo";

/**
 * Metadata only. This module is imported by every view, so it deliberately does not touch an icon component — `toc` is a JSON table, and pulling the package's namespace in here would put all 323 brands in the entry chunk no matter which view the reader opened.
 *
 * The components live in two places instead: landing/featured.ts names the ones the landing page draws, and gallery/registry.ts holds the namespace the gallery needs, in a chunk that is only fetched once the gallery is opened.
 */
export type IconEntry = (typeof toc)[number];

export type IconProps = { className?: string; size?: number | string; style?: React.CSSProperties };

export type CompoundIcon = React.ComponentType<IconProps> & {
  Avatar?: React.ComponentType<IconProps & { shape?: "circle" | "square" }>;
  Color?: React.ComponentType<IconProps>;
  Combine?: React.ComponentType<IconProps>;
  Text?: React.ComponentType<IconProps>;
};

export const entries: IconEntry[] = toc;

export const groups = ["provider", "model", "application"] as const;

export type Group = (typeof groups)[number];

export const PKG = "@yldm-tech/ai-logo";
export const ALIAS = "ai-logo";
export const CDN = "https://ailogo.yldm.ai";
export const REPO = "https://github.com/yldm-tech/ai-logo";

/** Counted rather than written down: the figures on the landing page are the ones the package actually ships, and they move on their own when a brand is added. */
export const stats = {
  application: entries.filter((entry) => entry.group === "application").length,
  avatar: entries.filter((entry) => entry.param.hasAvatar).length,
  brands: entries.length,
  color: entries.filter((entry) => entry.param.hasColor).length,
  combine: entries.filter((entry) => entry.param.hasCombine).length,
  model: entries.filter((entry) => entry.group === "model").length,
  provider: entries.filter((entry) => entry.group === "provider").length,
  text: entries.filter((entry) => entry.param.hasText).length,
};

/** Whichever variant reads best at a glance: colour when the brand has one, the monochrome mark otherwise. */
export const preferred = (
  Icon: CompoundIcon | undefined,
  entry: IconEntry,
): React.ComponentType<IconProps> | undefined => {
  if (!Icon) return undefined;
  return entry.param.hasColor && Icon.Color ? Icon.Color : Icon;
};
