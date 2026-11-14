import { motion } from "motion/react";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import { Code, Command } from "../components/Code";
import { GoFrameworkPicker } from "../components/GoFrameworkPicker";
import { Reveal } from "../components/Reveal";
import { SectionHead } from "../components/SectionHead";
import { ALIAS, GO_MODULES, type GoFramework, PKG } from "../registry";

const MANAGERS = {
  bun: `bun add ${PKG}`,
  npm: `npm i ${PKG}`,
  pnpm: `pnpm add ${PKG}`,
  yarn: `yarn add ${PKG}`,
} as const;

type Manager = keyof typeof MANAGERS;

const ORDER: Manager[] = ["npm", "pnpm", "yarn", "bun"];

const GO_SAMPLES: Record<GoFramework, string> = {
  mygo: `import (
  "github.com/egoist/mygo/ui"
  ailogo "${GO_MODULES.mygo.module}"
)

logo := ailogo.MustParse("openai", ailogo.Mono)
ui.Icon(c, logo).Size(24, 24)`,
  nsgo: `import (
  "github.com/nsgo-dev/nsgo/core"
  ailogo "${GO_MODULES.nsgo.module}"
)

logo := ailogo.MustParse("openai", ailogo.Mono)
core.Icon{SVG: logo, Label: "OpenAI"}`,
};

export const Install = () => {
  const [manager, setManager] = useState<Manager>("npm");
  const [framework, setFramework] = useState<GoFramework>("nsgo");
  const goModule = GO_MODULES[framework].module;
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

      <div className="mt-8 rounded-3xl border border-line bg-surface p-2 sm:p-3">
        <div className="grid gap-2 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono text-[11px] font-medium text-accent">
                React / npm
              </span>
              <span className="max-w-full truncate font-mono text-[11px] text-faint">{PKG}</span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{PKG}</h3>

            <div className="mt-5 flex w-fit rounded-xl border border-line bg-surface p-1">
              {ORDER.map((name) => (
                <button
                  aria-pressed={manager === name}
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
            <Command className="mt-3" command={MANAGERS[manager]} />

            <Code
              className="mt-3"
              // OpenAI is monochrome and has no .Color — the colour variant here is Claude's on purpose, because a sample that calls a subcomponent a brand does not ship.
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

          <div className="rounded-2xl border border-line bg-canvas p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <GoFrameworkPicker onChange={setFramework} value={framework} />
              <span className="max-w-full truncate font-mono text-[11px] text-faint">
                {goModule}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">{t("install.go.title")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-dim">
              <Trans
                components={{ c: <code /> }}
                i18nKey={`install.go.${framework}`}
                values={{ module: goModule }}
              />
            </p>

            <Command className="mt-5" command={`go get ${goModule}`} />
            <Code className="mt-3" code={GO_SAMPLES[framework]} />
          </div>
        </div>
      </div>
    </Reveal>
  );
};
