import { useTranslation } from "react-i18next";

import { GO_FRAMEWORKS, GO_MODULES, type GoFramework } from "../registry";

/** The Go tag shared by the install card and the gallery's detail panel, doubling as the switch between the framework modules. */
export const GoFrameworkPicker = ({
  onChange,
  value,
}: {
  onChange: (framework: GoFramework) => void;
  value: GoFramework;
}) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={t("install.go.framework")}
      className="flex w-fit items-center gap-0.5 rounded-full border border-accent-2/30 p-0.5 font-mono text-[11px] font-medium"
      role="group"
    >
      <span className="ps-2 pe-1 text-accent-2">Go</span>
      {GO_FRAMEWORKS.map((framework) => (
        <button
          aria-pressed={value === framework}
          className={`cursor-pointer rounded-full px-2 py-0.5 transition-colors ${
            value === framework ? "bg-accent-2/15 text-accent-2" : "text-dim hover:text-ink"
          }`}
          key={framework}
          onClick={() => onChange(framework)}
          type="button"
        >
          {GO_MODULES[framework].name}
        </button>
      ))}
    </div>
  );
};
