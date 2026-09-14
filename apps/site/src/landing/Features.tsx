import { lazy } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Code } from "../components/Code";
import { Deferred } from "../components/Deferred";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { CDN, PKG, stats } from "../registry";
import { Card, INLINE_CODE } from "./Card";
import { featuredIcon } from "./featured";

// The string-lookup card pulls the 143-icon keyword table with it; see LookupCard for why that is inherent. Deferred mounts it only once the reader is within a screen of it.
const LookupCard = lazy(() =>
  import("./LookupCard").then((module) => ({ default: module.LookupCard })),
);

const Anthropic = featuredIcon("Anthropic");
const OpenAI = featuredIcon("OpenAI");

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

        <Deferred minHeight="18rem">
          <LookupCard />
        </Deferred>

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
                alt={t("features.filesAlt", { brand: alt })}
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
