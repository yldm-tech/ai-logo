import { motion } from "motion/react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Code, Command } from "../components/Code";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { ALIAS, PKG } from "../registry";

const MANAGERS = {
  bun: `bun add ${PKG}`,
  npm: `npm i ${PKG}`,
  pnpm: `pnpm add ${PKG}`,
  yarn: `yarn add ${PKG}`,
} as const;

type Manager = keyof typeof MANAGERS;

const ORDER: Manager[] = ["npm", "pnpm", "yarn", "bun"];

export const Install = () => {
  const [manager, setManager] = useState<Manager>("npm");
  const { t } = useTranslation();

  return (
    <Reveal as="section" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20" id="install">
      <SectionHead
        eyebrow={t("install.eyebrow")}
        split
        sub={
          <Trans components={{ c: <code /> }} i18nKey="install.peers" values={{ alias: ALIAS }} />
        }
        title={t("install.title")}
      />

      <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-3 flex w-fit rounded-xl border border-line bg-surface p-1">
            {ORDER.map((name) => (
              <button
                className="relative cursor-pointer rounded-lg px-3.5 py-1.5 font-mono text-[12.5px] transition-colors"
                key={name}
                onClick={() => setManager(name)}
                type="button"
              >
                {manager === name && (
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-elevated"
                    layoutId="manager-pill"
                    transition={{ damping: 30, stiffness: 380, type: "spring" }}
                  />
                )}
                <span className={`relative ${manager === name ? "text-ink" : "text-dim"}`}>
                  {name}
                </span>
              </button>
            ))}
          </div>
          <Command command={MANAGERS[manager]} />
        </div>

        <Code
          // OpenAI is monochrome and has no .Color — the colour variant here is Claude's on purpose, because a sample that calls a subcomponent a brand does not ship is the kind of thing people paste.
          code={`import { Claude, OpenAI, ProviderIcon } from "${PKG}";

export function Badge() {
  return (
    <span>
      <OpenAI size={20} />
      <Claude.Color size={20} />
      <ProviderIcon provider="anthropic" size={20} />
    </span>
  );
}`}
        />
      </div>
    </Reveal>
  );
};
