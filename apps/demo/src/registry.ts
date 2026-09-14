import * as AiLogo from "@yldm-tech/ai-logo";
import { toc } from "@yldm-tech/ai-logo";

export type IconEntry = (typeof toc)[number];

export type IconProps = { className?: string; size?: number | string; style?: React.CSSProperties };

export type CompoundIcon = React.ComponentType<IconProps> & {
  Avatar?: React.ComponentType<IconProps & { shape?: "circle" | "square" }>;
  Color?: React.ComponentType<IconProps>;
  Combine?: React.ComponentType<IconProps>;
  Text?: React.ComponentType<IconProps>;
};

/**
 * Every icon is a named export, so the toc doubles as an index into the module. A real app would import the handful it needs — see treeshake/entry.tsx — but a gallery wants all of them, and driving it off the toc proves the metadata and the exports line up for all 300-odd brands rather than the six the test samples.
 */
export const registry = AiLogo as unknown as Record<string, CompoundIcon | undefined>;

/** A toc entry with no matching export would render an empty hole in the grid; nothing downstream has to guard against that if the list is filtered once, here. */
export const entries: IconEntry[] = toc.filter((entry) => registry[entry.id]);

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
export const preferredIcon = (entry: IconEntry): React.ComponentType<IconProps> | undefined => {
  const Icon = registry[entry.id];
  if (!Icon) return undefined;
  return entry.param.hasColor && Icon.Color ? Icon.Color : Icon;
};

/**
 * The brands a reader is most likely to recognise, in the order they should be met. Anything here that is not in the build is dropped rather than rendered as a hole, so the list can name a brand this fork has not picked up yet.
 */
const FEATURED_IDS = [
  "OpenAI",
  "Claude",
  "Gemini",
  "Grok",
  "DeepSeek",
  "Qwen",
  "Mistral",
  "Meta",
  "Perplexity",
  "Cursor",
  "HuggingFace",
  "Ollama",
  "Copilot",
  "Midjourney",
  "Suno",
  "ElevenLabs",
  "Runway",
  "Kling",
  "Moonshot",
  "Zhipu",
  "Minimax",
  "Doubao",
  "Hunyuan",
  "Baichuan",
  "Groq",
  "Together",
  "Fireworks",
  "Replicate",
  "OpenRouter",
  "SiliconCloud",
  "Novita",
  "DeepInfra",
  "Hyperbolic",
  "Nvidia",
  "Azure",
  "Bedrock",
  "VertexAI",
  "Cloudflare",
  "Vercel",
  "Github",
  "Notion",
  "Figma",
  "Zapier",
  "LangChain",
  "LlamaIndex",
  "Dify",
  "Coze",
  "N8n",
  "Flowith",
  "Cline",
  "Windsurf",
  "V0",
  "Replit",
  "Trae",
  "Stability",
  "Adobe",
  "Apple",
  "Microsoft",
  "Google",
  "Anthropic",
  "XAI",
  "Cohere",
  "Ai21",
  "Yi",
  "Spark",
  "SenseNova",
  "Stepfun",
  "Kimi",
  "Wenxin",
  "Tencent",
  "Alibaba",
  "ByteDance",
  "Baidu",
] as const;

const byId = new Map(entries.map((entry) => [entry.id, entry]));

export const featured: IconEntry[] = FEATURED_IDS.map((id) => byId.get(id)).filter(
  (entry): entry is IconEntry => Boolean(entry),
);

/**
 * Splits the featured brands into `count` marquee tracks by dealing them round-robin, so each row mixes colour marks with monochrome ones instead of one row getting all the colour. Short rows are topped up from the rest of the set — the hero should never show a track with four icons in it.
 */
export const marqueeRows = (count: number, perRow: number): IconEntry[][] => {
  const pool = [...featured, ...entries.filter((entry) => !featured.includes(entry))];
  const rows: IconEntry[][] = Array.from({ length: count }, () => []);
  pool.forEach((entry, index) => {
    const row = rows[index % count];
    if (row.length < perRow) row.push(entry);
  });
  return rows;
};
