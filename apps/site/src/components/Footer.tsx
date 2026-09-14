import { useTranslation } from "react-i18next";

import { Logo } from "../Logo";
import { ALIAS, PKG, REPO } from "../registry";

export const Footer = () => {
  const { t } = useTranslation();

  const links = [
    { href: REPO, label: t("footer.github") },
    { href: `https://www.npmjs.com/package/${PKG}`, label: t("footer.npm") },
    {
      href: `https://www.npmjs.com/package/${ALIAS}`,
      label: t("footer.npmAlias", { alias: ALIAS }),
    },
    { href: `${REPO}/issues/new`, label: t("footer.issue") },
    { href: `${REPO}/blob/main/LICENSE`, label: t("footer.licence") },
  ];

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-12">
        {/* Wordmark and links share one row and one baseline; the attribution runs underneath. Stacking the wordmark and the attribution on the left instead left the links hanging at the top of a column twice their height, against nothing. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-baseline sm:justify-between">
          {/* Inline rather than a flex row: a flex container aligned on its centre takes its baseline from its first item, which here is the mark, so the wordmark and the links ended up a couple of pixels out from each other. Laid out inline, this span's baseline is the wordmark's own. */}
          <span className="text-ink">
            <Logo className="me-2.5 inline-block align-[-0.28em]" size={19} />
            <span className="text-[15px] font-semibold tracking-tight">AI Logo</span>
          </span>

          {/* Laid out inline rather than as a wrapping flex row, for the same reason. A flex container with `flex-wrap: wrap` does not hand its first item's baseline to the row outside it — the browser synthesises one from the border box — so `items-baseline` had nothing true to align against. Inline anchors still wrap, and their baseline is the one on the page. */}
          <nav className="text-[13px] leading-relaxed sm:text-end">
            {links.map(({ href, label }) => (
              <a
                className="me-5 text-dim transition last:me-0 hover:text-ink"
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-dim">{t("footer.tagline")}</p>
      </div>
    </footer>
  );
};
