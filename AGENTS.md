# Agent guide

[CONTRIBUTING.md](./CONTRIBUTING.md) covers setup, adding a brand, commit conventions and what CI checks. This file holds the rules agents have got wrong in this repository.

## The website ships with every change

<https://ailogo.yldm.ai> is built from `apps/site` and deployed by `.github/workflows/docs.yml` on every push to `main`. A redeploy is not an update: the landing page copy, the marquee, the stats and the gallery filters are written by hand, so a change to the icon set that does not touch `apps/site` deploys a site that still describes the old set. That is what happened when the first 663 non-AI brands landed — they deployed, but the site still said "Every AI brand", drew only AI marks and filed the new brands under Apps, and read as not updated.

Any change to the brand set, the categories or what the package does updates the site in the same pull request:

- Counts and copy: `apps/site/index.html` (title, description, Open Graph, Twitter, JSON-LD) and every locale under `apps/site/src/i18n/locales` — all eleven, not only `en.json`.
- A new category: `src/types/toc.ts`, `groups` and `stats` in `apps/site/src/registry.ts`, `FILTERS` in `apps/site/src/gallery/Gallery.tsx`, the filter label and `gallery.group.*` in every locale, `stats.brandsNote`, and the README columns in `scripts/readmeWorkflow`.
- What the first screen shows: `apps/site/src/landing/featured.ts`. If a visitor should notice the change, it belongs there. Everything it imports lands on the critical path, which `apps/site/treeshake/check.mjs` budgets.
- Before pushing: `pnpm --dir apps/site run type-check`, `pnpm --dir apps/site run test` and `pnpm --dir apps/site run build`.

After the pull request merges, check the deploy rather than assume it: the Docs run for the merge commit succeeded (`gh run list --workflow docs.yml`), and the live site shows the change — the `<title>` from `curl -s https://ailogo.yldm.ai/`, and a new asset such as `https://ailogo.yldm.ai/svg/<slug>.svg` answering 200. Pages are cached for ten minutes, so a stale page right after the deploy is the cache, not the build.

## Staging brand directories

A brand directory is named after the brand, and a machine-wide ignore can swallow it: Rust's `target/` in `core.excludesFile` matched `src/Target/` on a case-insensitive filesystem, the directory never reached the commit, and CI failed on the missing `index.mdx` while every local check passed. After staging a batch of brands, confirm that each one exported from `src/icons.ts` has its directory in the index (`git ls-files src/<Brand>`), and add a negation to `.gitignore` for any that do not.
