# Contributing

The most common contribution to this repository is adding an icon, or fixing which icon an id resolves to. Those are two different tasks and the second is much smaller than the first — check which one you have before starting.

If what you have is a vulnerability rather than a bug, do not open an issue or a pull request for it — [SECURITY.md](./SECURITY.md) has the private route.

## Setup

```bash
pnpm install
pnpm run ci     # oxfmt, oxlint, tsgo
pnpm run test
```

pnpm is required. `vite-plus` aliases `vite` to `@voidzero-dev/vite-plus-core` through a catalog in `pnpm-workspace.yaml`, and no other package manager reads that file — install with npm or yarn and the real vite resolves instead, so nothing builds.

## An id renders the grey fallback

The brand icon almost certainly already exists and only the mapping is missing. Look under `src/<BrandName>/` first.

Mappings live in four files, and the react-native package duplicates two of them:

| What              | Main package                      | react-native package                                    |
| ----------------- | --------------------------------- | ------------------------------------------------------- |
| Provider enum     | `src/features/providerEnum.ts`    | `packages/react-native/src/features/providerEnum.ts`    |
| Provider mappings | `src/features/providerConfig.tsx` | `packages/react-native/src/features/providerConfig.tsx` |
| Model mappings    | `src/features/modelConfig.ts`     | `packages/react-native/src/features/modelConfig.ts`     |
| Agent mappings    | `src/features/agentConfig.ts`     | — main package only                                     |

Two things about matching are easy to get wrong:

- **Provider ids match exactly.** `keywords` on a provider entry are compared with `===` after lowercasing, so the id has to be listed verbatim. Adding a `ModelProvider` member without adding it to a `providerMappings` entry is the single most common cause of a fallback icon.
- **Model and agent ids match as unanchored regexes, first entry wins.** A short keyword claims every id containing it — a bare `amp` matched `example`, and a bare `step` made the `ace-step` entry below it unreachable. Anchor with `(^|/)` and `($|[-_])` unless you really mean the substring, and put specific entries above general ones.

`pnpm run test` checks both of these across the whole table, so a shadowed or orphaned keyword fails the suite rather than shipping.

## Adding a new brand icon

```
src/BrandName/
├── index.ts            # attaches the subcomponents and the brand constants
├── index.mdx           # frontmatter only — title, description, category
├── style.ts            # TITLE and colour constants
└── components/
    ├── Mono.tsx        # required — the default export
    ├── Color.tsx       # optional
    ├── Text.tsx        # optional wordmark
    ├── TextColor.tsx   # optional
    ├── Avatar.tsx      # optional
    └── Combine.tsx     # optional icon + wordmark
```

Copy the closest existing brand rather than starting from scratch. Then:

1. Write `index.mdx`. It is frontmatter and nothing else, and it is not decoration — `pnpm run build:toc` reads it with gray-matter and fails if the file is missing:

   ```mdx
   ---
   title: Claude
   description: https://claude.ai
   category: Model
   ---
   ```

   `title` is the name shown in the README table and on the site, `description` is the brand's home page, and `category` is one of `Model`, `Provider` or `Application` — it is lowercased into the `group` field that the three README columns and the site's filters are built from.

2. Add the export to `src/icons.ts`, in alphabetical position: `export { default as YourBrand, type CompoundedIcon as YourBrandProps } from "./YourBrand";`. The toc script discovers icons by matching `default as (\w+)` in that file, so a brand that is not exported there does not exist as far as the rest of the pipeline is concerned.

3. Add the mapping entries as above.

4. Run `pnpm run build:toc` — `src/toc.json` is generated from what `index.ts` attaches, never edited by hand. The `param` flags come from the `Icons.Color = …` assignments, not from which files sit in `components/`, so a subcomponent you wrote but forgot to attach is invisible everywhere downstream.

5. Run `pnpm run build:static` to render the new files under `packages/static-*`, and commit them. They are committed build outputs, not generated in CI, and `tests/staticAssets.test.ts` asserts that every variant `src/toc.json` advertises has an SVG behind it — so a brand added without this step fails the test suite and leaves the documented CDN paths 404ing. The script installs a Chrome for puppeteer if there is not one already and re-renders the whole set rather than just what changed, so check `git status` afterwards: stage your brand's files across `static-svg`, `static-png`, `static-webp` and `static-avatar`, and leave any unrelated churn out of the commit.

6. Run `pnpm run sync:md` to regenerate the README icon table, then `npx remark --quiet --output -- README.md`. CI regenerates both and fails on a diff.

7. Port the icon to react-native with `pnpm run auto-converter-web-icons-to-rn`. It converts what `packages/react-native/src/icons` is missing, updates that package's exports and syncs the feature configs. Review the diff — it is code generation, not a build step — and check it with `pnpm --dir packages/react-native run type-check`, which is what CI runs. The port is not published and CI does not check that it is complete, so skipping this does not fail anything; it just leaves the port one brand further behind `src/`.

**If your SVG uses `id` attributes**, namespace them with `useFillIds` from `@/hooks/useFillId` rather than writing `id="a"`. Ids are global to the page: two icons that both hardcode `id="a"` silently clip each other, and so does any host page with its own.

## Commits and pull requests

Commit messages are gitmoji plus conventional commits, and the type decides the release:

```
:sparkles: feat: add Anthropic icon          → minor
:bug: fix: resolve claude to the Claude icon → patch
:lipstick: style: add Unsloth                → patch
:memo: docs: ...                             → no release
```

A commit without the gitmoji prefix is invisible to the release analyser and produces no release at all, so `feat: add X` is not the same as `:sparkles: feat: add X`. commitlint enforces the shape on commit.

The pre-commit hook regenerates `src/toc.json` and stages only that file, then runs the type check, the circular-dependency check and lint-staged over what you staged.

## What CI checks

`pnpm run ci`, the test suite, that the generated `src/toc.json` and README match `src/`, that the built package still tree-shakes within its bundle budgets, and that the react-native port type-checks. All of it runs on every pull request.
