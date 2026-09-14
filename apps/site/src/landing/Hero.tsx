import { motion } from "motion/react";
import { Trans, useTranslation } from "react-i18next";

import { CopyButton } from "../components/Copy";
import { entrance } from "../motion";
import { PKG, stats } from "../registry";
import { useStore } from "../store";
import { marqueeRows } from "./featured";
import { Marquee } from "./Marquee";

const ROWS = marqueeRows(3, 26);

/** Three tracks at different speeds and alternating directions. Matching speeds would read as one block of icons sliding sideways; the difference is what makes it read as depth. */
const TRACKS = [
  { duration: 78, reverse: false },
  { duration: 96, reverse: true },
  { duration: 86, reverse: false },
];

const ArrowIcon = () => (
  <svg fill="none" height="15" viewBox="0 0 24 24" width="15">
    <path
      d="M5 12h13m-5.5-6 6 6-6 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

const Backdrop = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="absolute top-[-16rem] left-1/2 size-[40rem] -translate-x-1/2 animate-drift rounded-full bg-accent/18 blur-[130px]" />
    <div className="absolute top-[2rem] right-[-10rem] size-[26rem] animate-drift rounded-full bg-accent-2/14 blur-[120px] [animation-delay:-7s]" />
    <div className="absolute top-[6rem] left-[-10rem] size-[24rem] animate-drift rounded-full bg-accent/12 blur-[120px] [animation-delay:-12s]" />
    <div className="absolute inset-0 [background-image:radial-gradient(circle,var(--line-strong)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_58%_46%_at_50%_28%,#000,transparent)]" />
  </div>
);

const stagger = (index: number) =>
  entrance(
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0 },
    { delay: 0.06 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  );

export const Hero = () => {
  const setView = useStore((state) => state.setView);
  const { t } = useTranslation();
  const install = `npm i ${PKG}`;

  return (
    <section className="relative overflow-hidden pb-16">
      <Backdrop />

      {/* Wide enough for the headline to stay on one line. Measured, not picked: the Chinese headline needs 780px at its largest size and the English one 741px, so a 768px column was breaking every language in two for the sake of a few dozen pixels. Japanese is the one that still wraps, at 1247px, and it reads fine in two. */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-20 pb-12 text-center sm:pt-28">
        <motion.a
          {...stagger(0)}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[12px] text-dim backdrop-blur transition hover:border-line-strong hover:text-ink"
          href="#variants"
        >
          <span className="size-1.5 rounded-full bg-accent" />
          {t("hero.badge", { brands: stats.brands, color: stats.color })}
        </motion.a>

        <motion.h1
          {...stagger(1)}
          className="text-balance-tight mt-6 text-[clamp(2.5rem,7.5vw,4.25rem)] leading-[var(--display-leading)] font-semibold text-ink"
        >
          {/* The whole headline is one string with the accented half marked up inside it. Splitting it into two keys put the space between them in the markup, where no translation could reach it: Chinese does not want one after a full-width comma, Korean does, and the text stream lost its word boundary either way. */}
          <Trans
            components={{
              a: (
                <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent" />
              ),
            }}
            i18nKey="hero.title"
          />
        </motion.h1>

        <motion.p
          {...stagger(2)}
          className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-balance text-dim sm:text-base"
        >
          {t("hero.sub")}
        </motion.p>

        <motion.div
          {...stagger(3)}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            className="group inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent-solid px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-12px_var(--accent)] transition hover:brightness-110"
            onClick={() => setView("icons")}
            type="button"
          >
            {t("hero.browse", { count: stats.brands })}
            <span className="transition-transform group-hover:translate-x-0.5">
              <ArrowIcon />
            </span>
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface/80 py-2 pe-2 ps-4 backdrop-blur">
            <code className="font-mono text-[13px] text-dim">
              <span className="text-faint select-none">$ </span>
              {install}
            </code>
            <CopyButton value={install} />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative z-10"
        {...entrance({ opacity: 0 }, { opacity: 1 }, { delay: 0.25, duration: 0.8 })}
      >
        {TRACKS.map((track, index) => (
          <Marquee key={index} row={ROWS[index]} {...track} />
        ))}
      </motion.div>
    </section>
  );
};
