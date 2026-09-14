# Contributing

The most common contribution to this repository is adding an icon, or fixing which icon an id resolves to. Those are two different tasks and the second is much smaller than the first — check which one you have before starting.

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
├── index.mdx           # the docs page
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

1. Add the export to `src/icons.ts`.
2. Add the mapping entries as above.
3. Run `pnpm run build:toc` — `src/toc.json` is generated from what `index.ts` attaches, never edited by hand.
4. Run `pnpm run sync:md` to regenerate the README icon table, then `npx remark --quiet --output -- README.md`. CI regenerates both and fails on a diff.

**If your SVG uses `id` attributes**, namespace them with `useFillIds` from `@/hooks/useFillId` rather than writing `id="a"`. Ids are global to the page: two icons that both hardcode `id="a"` silently clip each other, and so does any host page with its own.

Static renders under `packages/static-*` are produced by `pnpm run build:static`, which drives a headless Chrome. You do not need to run it for a normal icon addition.

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
