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
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <span className="flex items-center gap-2.5 text-ink">
            <Logo size={19} />
            <span className="text-[15px] font-semibold tracking-tight">AI Logo</span>
          </span>
          <p className="mt-3 text-[13px] leading-relaxed text-dim">{t("footer.tagline")}</p>
        </div>

        <nav className="flex flex-col gap-2 text-[13px] sm:text-end">
          {links.map(({ href, label }) => (
            <a
              className="text-dim transition hover:text-ink"
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
    </footer>
  );
};
