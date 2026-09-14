import { ModelIcon, ProviderIcon } from "@yldm-tech/ai-logo";
import { Trans, useTranslation } from "react-i18next";

import { Code } from "../components/Code";
import { Card, INLINE_CODE } from "./Card";

/**
 * Its own module because of what it costs. `ProviderIcon` and `ModelIcon` resolve a string through a keyword table, and building that table imports 143 icons statically — roughly 1.6 MB, eight times a direct icon import. That is inherent to a runtime lookup rather than a regression, and the bundle budget in treeshake/check.mjs guards the figure, but there is no reason for it to sit in the entry chunk of a page whose first screen is a headline. Features.tsx loads this lazily and only once the reader is near it.
 */
const LOOKUPS = ["openai", "anthropic", "google", "mistral", "deepseek", "perplexity"];
const MODELS = ["gpt-5", "claude-opus-4", "gemini-2.5-pro", "qwen3-max", "grok-4", "llama-3.3"];

export const LookupCard = () => {
  const { t } = useTranslation();

  return (
    <Card
      note={<Trans components={INLINE_CODE} i18nKey="features.lookup.note" />}
      title={t("features.lookup.title")}
    >
      {/* Rendered from strings rather than from imports, which is the whole point of the card they sit in — if a keyword stopped resolving, this row would visibly fall back to the neutral mark. */}
      <div className="flex flex-wrap gap-2">
        {LOOKUPS.map((provider) => (
          <ProviderIcon key={provider} provider={provider} shape="square" size={34} type="avatar" />
        ))}
        {MODELS.map((model) => (
          <ModelIcon key={model} model={model} shape="square" size={34} type="avatar" />
        ))}
      </div>
      <Code
        className="mt-3"
        code={`<ProviderIcon provider="openai" size={34} />
<ModelIcon model="gpt-5" size={34} />`}
        copy={false}
      />
    </Card>
  );
};
