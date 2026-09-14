import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import ar from "./locales/ar.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import ptBR from "./locales/pt-BR.json";
import ru from "./locales/ru.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

/** Each language is labelled in itself — someone looking for their own language is not reading the current one. */
export const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "简体中文", value: "zh-CN" },
  { label: "繁體中文", value: "zh-TW" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
  { label: "Español", value: "es" },
  { label: "Français", value: "fr" },
  { label: "Deutsch", value: "de" },
  { label: "Português", value: "pt-BR" },
  { label: "Русский", value: "ru" },
  { label: "العربية", value: "ar" },
] as const;

export const RTL_LANGUAGES = new Set(["ar"]);

export const LANGUAGE_KEY = "ai-logo-lang";

/** The query parameter that pins a language. It is what makes a translation addressable — a link to share, and a URL a crawler can index and an hreflang alternate can point at. */
export const LANGUAGE_PARAM = "lang";

export const SITE = "https://ailogo.yldm.ai";

const resources = {
  ar: { translation: ar },
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ja: { translation: ja },
  ko: { translation: ko },
  "pt-BR": { translation: ptBR },
  ru: { translation: ru },
  "zh-CN": { translation: zhCN },
  "zh-TW": { translation: zhTW },
};

/**
 * Traditional Chinese is the one case i18next's own resolution gets wrong for us. Asked for `zh-HK`, it walks down to the base tag `zh` and takes the first bundle with that base — `zh-CN` — which is the right language in the wrong script. Everything else resolves correctly on its own: `de-AT` finds `de`, and a bare `zh` or `pt` finds `zh-CN` and `pt-BR`.
 */
const TRADITIONAL = new Set(["zh-HK", "zh-Hant", "zh-MO", "zh-TW"]);

const SUPPORTED: ReadonlySet<string> = new Set(LANGUAGES.map((language) => language.value));

/**
 * Narrows whatever was detected to a tag this site actually ships.
 *
 * i18next filters a detected value against `supportedLngs` and drops it if it does not match, which is right for the navigator — the next detector gets a turn — and wrong for the query string, where the reader asked for something specific and silence is the only answer they get. `?lang=de-AT` used to fall all the way through to English. Now it lands on `de`, `?lang=zh` lands on `zh-CN` and `?lang=pt` on `pt-BR`, which is what `fallbackLng` already does for the navigator path and what the hreflang cluster implies.
 */
const convertDetectedLanguage = (code: string) => {
  if (TRADITIONAL.has(code) || code.startsWith("zh-Hant")) return "zh-TW";
  if (SUPPORTED.has(code)) return code;
  const base = code.split("-")[0];
  if (SUPPORTED.has(base)) return base;
  // `zh` before `zh-CN`, `pt` before `pt-BR`: the first tag that shares the base is the one this site treats as that language.
  const regional = LANGUAGES.find((language) => language.value.split("-")[0] === base);
  return regional ? regional.value : code;
};

// Detection reads the query string, storage and the navigator, none of which exist in the prerender. There it renders English, which is what index.html already advertises and what `x-default` points at.
const onClient = typeof window !== "undefined";

void (onClient ? i18n.use(LanguageDetector) : i18n).use(initReactI18next).init({
  detection: {
    caches: ["localStorage"],
    convertDetectedLanguage,
    lookupLocalStorage: LANGUAGE_KEY,
    lookupQuerystring: LANGUAGE_PARAM,
    // The query string comes first: a link that names a language means it, whatever this browser last chose.
    order: ["querystring", "localStorage", "navigator", "htmlTag"],
  },
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  lng: onClient ? undefined : "en",
  resources,
  supportedLngs: LANGUAGES.map((language) => language.value),
});

export default i18n;
