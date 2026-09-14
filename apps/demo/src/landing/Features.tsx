import { ModelIcon, ProviderIcon } from "@yldm-tech/ai-logo";
import { Trans, useTranslation } from "react-i18next";

import { Code } from "../components/Code";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { CDN, PKG, registry, stats } from "../registry";

const Card = ({
  children,
  note,
  title,
}: {
  children: React.ReactNode;
  note: React.ReactNode;
  title: string;
}) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong">
    <div className="p-5">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-dim">{note}</p>
    </div>
    <div className="mt-auto border-t border-line bg-elevated/60 p-5">{children}</div>
  </div>
);

/** Identifiers inside a translated sentence are marked up as `<c>` in the JSON; this is the element they become. */
const INLINE_CODE = { c: <code /> };

const Anthropic = registry.Anthropic;
const OpenAI = registry.OpenAI;

/** Rendered from strings rather than from imports, which is the whole point of the card they sit in — if a keyword stopped resolving, this row would visibly fall back to the neutral mark. */
const LOOKUPS = ["openai", "anthropic", "google", "mistral", "deepseek", "perplexity"];
const MODELS = ["gpt-5", "claude-opus-4", "gemini-2.5-pro", "qwen3-max", "grok-4", "llama-3.3"];

const CDN_SAMPLES = [
  { alt: "OpenAI", src: `${CDN}/svg/openai.svg` },
  { alt: "Claude", src: `${CDN}/svg/claude-color.svg` },
  { alt: "Gemini", src: `${CDN}/png/light/gemini-color.png` },
  { alt: "Mistral", src: `${CDN}/webp/light/mistral-color.webp` },
  { alt: "OpenAI avatar", src: `${CDN}/avatar/openai.webp` },
];

export const Features = () => {
  const { t } = useTranslation();
  const shaken = stats.brands - 1;

  return (
    <Reveal as="section" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-8" id="how">
      <SectionHead
        center
        eyebrow={t("features.eyebrow")}
        sub={t("features.sub")}
        title={t("features.title")}
      />

      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <Card
          note={t("features.treeshake.note", { count: shaken })}
          title={t("features.treeshake.title")}
        >
          <Code
            code={`// ${t("features.treeshake.comment", { count: shaken })}
import { OpenAI } from "${PKG}";`}
            copy={false}
          />
        </Card>

        <Card
          note={<Trans components={INLINE_CODE} i18nKey="features.lookup.note" />}
          title={t("features.lookup.title")}
        >
          <div className="flex flex-wrap gap-2">
            {LOOKUPS.map((provider) => (
              <ProviderIcon
                key={provider}
                provider={provider}
                shape="square"
                size={34}
                type="avatar"
              />
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

        <Card
          note={<Trans components={INLINE_CODE} i18nKey="features.css.note" />}
          title={t("features.css.title")}
        >
          <div className="flex flex-wrap items-end gap-6">
            {OpenAI && (
              <>
                <span className="flex items-end gap-4 text-ink">
                  <OpenAI size={20} />
                  <OpenAI size={30} />
                  <OpenAI size={44} />
                </span>
                <span className="flex items-end gap-4">
                  <span className="text-accent">
                    <OpenAI size={30} />
                  </span>
                  <span className="text-accent-2">
                    {Anthropic ? <Anthropic size={30} /> : null}
                  </span>
                  <span className="text-faint">
                    <OpenAI size={30} />
                  </span>
                </span>
              </>
            )}
          </div>
          <Code
            className="mt-3"
            code={`<span className="text-violet-500">
  <OpenAI size={30} />
</span>`}
            copy={false}
          />
        </Card>

        <Card
          note={<Trans components={INLINE_CODE} i18nKey="features.files.note" />}
          title={t("features.files.title")}
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* A monochrome render is black on transparent, which disappears against a dark page. The light chip is the honest fix: these are the light-theme files, and the card's own copy points at <picture> for following the reader's scheme. */}
            {CDN_SAMPLES.map(({ alt, src }) => (
              <img
                alt={alt}
                className="size-9 rounded-lg bg-white object-contain p-1 ring-1 ring-line"
                height={36}
                key={src}
                loading="lazy"
                src={src}
                width={36}
              />
            ))}
          </div>
          <Code
            className="mt-3"
            code={`<img src="${CDN}/svg/openai.svg" width="36" />`}
            copy={false}
          />
        </Card>
      </div>
    </Reveal>
  );
};
