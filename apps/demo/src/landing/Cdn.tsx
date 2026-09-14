import { Trans, useTranslation } from "react-i18next";

import { CopyButton } from "../components/Copy";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { CDN } from "../registry";

const ROWS = [
  { format: "SVG", note: "svg", path: "/svg/openai.svg" },
  { format: "PNG", note: "png", path: "/png/light/gemini-color.png" },
  { format: "WebP", note: "webp", path: "/webp/light/mistral-color.webp" },
  { format: "Avatar", note: "avatar", path: "/avatar/claude.webp" },
];

export const Cdn = () => {
  const { t } = useTranslation();

  return (
    <Reveal as="section" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20" id="cdn">
      <SectionHead
        eyebrow={t("cdn.eyebrow")}
        sub={<Trans components={{ c: <code /> }} i18nKey="cdn.sub" />}
        title={t("cdn.title")}
      />

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {ROWS.map(({ format, note, path }) => (
          // Narrow screens put the URL on its own line rather than squeezing it into a column a few characters wide.
          <div
            className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-surface px-4 py-3 last:border-b-0 hover:bg-elevated/50"
            key={format}
          >
            <img
              alt={`${format} example`}
              className="size-10 flex-none rounded-lg bg-white object-contain p-1 ring-1 ring-line"
              height={40}
              loading="lazy"
              src={`${CDN}${path}`}
              width={40}
            />
            <div className="min-w-0 flex-1 sm:w-44 sm:flex-none">
              <p className="text-[13px] font-medium text-ink">{format}</p>
              <p className="text-[11.5px] text-faint">{t(`cdn.${note}`)}</p>
            </div>
            <code
              className="order-last w-full overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-dim sm:order-none sm:w-auto sm:flex-1"
              dir="ltr"
            >
              <span className="text-faint">{CDN}</span>
              {path}
            </code>
            <CopyButton value={`${CDN}${path}`} />
          </div>
        ))}
      </div>
    </Reveal>
  );
};
