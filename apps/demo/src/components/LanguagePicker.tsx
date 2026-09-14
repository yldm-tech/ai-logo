import { useTranslation } from "react-i18next";

import { LANGUAGES } from "../i18n";

const GlobeIcon = () => (
  <svg fill="none" height="15" viewBox="0 0 24 24" width="15">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M3 12h18M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

/**
 * A native select rather than a custom menu: eleven options is exactly the case where the platform's own picker — searchable by keystroke, full-screen on a phone, and correct with a screen reader — beats anything hand-rolled. The chrome around it is ours; the list is the browser's.
 */
export const LanguagePicker = () => {
  const { i18n, t } = useTranslation();
  // `language` is what was asked for and is set synchronously; `resolvedLanguage` is what the fallback chain settled on and lags a render behind a switch. Preferring the former keeps the control showing what the reader just picked.
  const current =
    LANGUAGES.find((language) => language.value === i18n.language) ??
    LANGUAGES.find((language) => language.value === i18n.resolvedLanguage) ??
    LANGUAGES[0];

  return (
    <label className="relative flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 text-dim transition hover:border-line-strong hover:text-ink has-[select:focus-visible]:border-accent">
      <GlobeIcon />
      <span className="hidden text-[12.5px] font-medium sm:inline">{current.label}</span>
      <select
        aria-label={t("nav.language")}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        value={current.value}
      >
        {LANGUAGES.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
};
