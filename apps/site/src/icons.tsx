import { Anthropic, Claude, EveryAPI, Gemini, OpenAI, Qwen } from "@yldm-tech/ai-logo";

/**
 * A deliberately mixed sample: two brands with a colour variant, one without, a model rather than a provider, and EveryAPI, which only exists in this fork.
 */
export const SAMPLE = [
  { Icon: OpenAI, name: "OpenAI" },
  { Icon: Anthropic, name: "Anthropic" },
  { Icon: Gemini, name: "Gemini" },
  { Icon: Claude, name: "Claude" },
  { Icon: Qwen, name: "Qwen" },
  { Icon: EveryAPI, name: "EveryAPI" },
] as const;
