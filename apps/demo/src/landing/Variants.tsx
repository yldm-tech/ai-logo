import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Code } from "../components/Code";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { entries, PKG } from "../registry";
import { featuredIcon } from "./featured";

/** Brands that ship all four variants, so the row below never has a hole in it. Filtered against the build rather than trusted, in case one of them loses a variant upstream. */
const CHOICES = ["Claude", "Gemini", "DeepSeek", "Qwen", "Mistral", "Perplexity"]
  .map((id) => entries.find((entry) => entry.id === id))
  .filter((entry) => entry !== undefined);

type VariantKey = "Avatar" | "Color" | "Combine" | "Text";

const VARIANTS: { key?: VariantKey; note: string; wide?: boolean }[] = [
  { note: "mono" },
  { key: "Color", note: "color" },
  { key: "Avatar", note: "avatar" },
  { key: "Text", note: "text", wide: true },
  { key: "Combine", note: "combine", wide: true },
];

export const Variants = () => {
  const [id, setId] = useState(CHOICES[0]?.id ?? "");
  const { t } = useTranslation();
  const entry = CHOICES.find((choice) => choice.id === id) ?? CHOICES[0];
  const Icon = entry ? featuredIcon(entry.id) : undefined;

  if (!entry || !Icon) return null;

  return (
    <Reveal as="section" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20" id="variants">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow={t("variants.eyebrow")}
          sub={t("variants.sub")}
          title={t("variants.title")}
        />

        <div className="flex flex-wrap gap-2">
          {CHOICES.map((choice) => {
            const Mark = featuredIcon(choice.id)?.Color ?? featuredIcon(choice.id);
            const active = choice.id === entry.id;
            return (
              <button
                className={`flex cursor-pointer items-center gap-2 rounded-full border py-1.5 pe-3.5 ps-2 text-[13px] transition ${
                  active
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line bg-surface text-dim hover:border-line-strong hover:text-ink"
                }`}
                key={choice.id}
                onClick={() => setId(choice.id)}
                type="button"
              >
                {Mark && <Mark size={17} />}
                {choice.fullTitle || choice.id}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {VARIANTS.map(({ key, note, wide }) => {
          const Variant = key ? Icon[key] : Icon;
          if (!Variant) return null;

          return (
            <div
              className={`group relative flex min-h-[11rem] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-4 transition hover:border-line-strong ${
                wide ? "col-span-2 sm:col-span-3 lg:col-span-3" : "lg:col-span-2"
              }`}
              key={key ?? "mono"}
            >
              {/* JSX is not prose: it stays left-to-right even when the page around it is not. */}
              <span className="font-mono text-[11px] text-faint" dir="ltr">
                &lt;{entry.id}
                {key ? `.${key}` : ""} /&gt;
              </span>

              <span className="grid flex-1 place-items-center overflow-hidden px-2 py-4 text-ink">
                <AnimatePresence mode="wait">
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid max-w-full place-items-center [&>*]:max-w-full"
                    exit={{ opacity: 0, scale: 0.94 }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    key={entry.id}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Variant size={wide ? 26 : 44} />
                  </motion.span>
                </AnimatePresence>
              </span>

              <span className="text-[12px] text-dim">{t(`variants.${note}`)}</span>
            </div>
          );
        })}
      </div>

      <Code
        className="mt-3"
        code={`import { ${entry.id} } from "${PKG}";

<${entry.id} size={32} />
<${entry.id}.Color size={32} />
<${entry.id}.Avatar size={32} shape="circle" />`}
      />
    </Reveal>
  );
};
