import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_PARAM, SITE } from "../i18n";
import { stats } from "../registry";

/** Open Graph wants the underscored form — `zh-CN` is `zh_CN` there, and nowhere else. */
const ogLocale = (language: string) => language.replace("-", "_");

const setMeta = (selector: string, attribute: string, value: string) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

/**
 * Keeps the document head in step with the language.
 *
 * index.html ships the English copy, which is what a crawler that does not run JavaScript will index and what the tab shows before React mounts. Everything here rewrites it once a language is settled: the title a reader sees in their tab and in a bookmark, the description a search result quotes, and the Open Graph pair a link preview uses. The hreflang alternates and the canonical are static — they describe the site rather than this visit — so they live in index.html and are left alone.
 */
export const Head = () => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const apply = () => {
      const title = t("meta.title", { count: stats.brands });
      const description = t("meta.description", { count: stats.brands });
      const language = i18n.resolvedLanguage ?? i18n.language;

      document.title = title;
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:title"]', "content", title);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[property="og:locale"]', "content", ogLocale(language));
      setMeta('meta[name="twitter:title"]', "content", title);
      setMeta('meta[name="twitter:description"]', "content", description);

      // A page reached through ?lang= has to name itself as its own canonical. Leaving every translation pointing at "/" tells a crawler the eleven hreflang alternates are duplicates of one page, which is the opposite of what the cluster is for — it asks for them to be treated as one page in eleven languages.
      const pinned = new URL(window.location.href).searchParams.get(LANGUAGE_PARAM);
      const canonical = pinned ? `${SITE}/?${LANGUAGE_PARAM}=${pinned}` : `${SITE}/`;
      setMeta('link[rel="canonical"]', "href", canonical);
      setMeta('meta[property="og:url"]', "content", canonical);
    };

    apply();
    i18n.on("languageChanged", apply);
    return () => i18n.off("languageChanged", apply);
  }, [i18n, t]);

  return null;
};
