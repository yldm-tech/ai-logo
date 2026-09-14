import { useTranslation } from "react-i18next";

import { Reveal } from "../components/Reveal";
import { stats } from "../registry";

/** Counted from the table of contents at render time rather than typed in, so the page cannot claim a number the package no longer ships. */
const CELLS = [
  { key: "brands", value: stats.brands },
  { key: "colour", value: stats.color },
  { key: "variants", value: 5 },
  { key: "formats", value: 4 },
] as const;

export const Stats = () => {
  const { t } = useTranslation();

  return (
    <Reveal className="mx-auto max-w-6xl px-5">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
        {CELLS.map(({ key, value }) => (
          <div className="bg-surface px-5 py-6" key={key}>
            <p className="text-[28px] leading-none font-semibold tracking-tight text-ink tabular-nums">
              {value}
            </p>
            <p className="mt-2 text-[13px] font-medium text-ink">{t(`stats.${key}`)}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-faint">
              {t(`stats.${key}Note`, {
                application: stats.application,
                model: stats.model,
                provider: stats.provider,
              })}
            </p>
          </div>
        ))}
      </div>
    </Reveal>
  );
};
