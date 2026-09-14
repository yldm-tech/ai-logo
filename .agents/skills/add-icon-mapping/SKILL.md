---
name: add-icon-mapping
description: Add or modify icon keyword mappings for providers, models, or agents in ai-logo. Use this whenever a task involves mapping a provider/model id to an icon, adding a new entry to ModelProvider enum or providerMappings/modelMappings/agentMappings, or fixing a provider/model that renders the fallback (default) icon in LobeHub. Trigger even if the request only says "add icon for X provider" or references a Linear issue about icon keyword mapping — the actual icon component usually already exists; only the mapping is missing.
---

# Add icon keyword mapping

ai-logo ships icon components (e.g. `src/Grok/`) and, separately, **mapping tables** that resolve a provider/model/agent id string to one of those components. A provider showing the fallback icon in LobeHub almost always means the mapping entry is missing, not the icon itself. **Always check `src/<Name>/` first** — if the brand icon already exists, the task is only wiring it up.

## Where mappings live (edit ALL that apply)

The react-native package duplicates the main package's config files. **Forgetting the RN package is the most common mistake** — the main package edits compile and pass review on their own.

| What              | Main package                      | react-native package                                    |
| ----------------- | --------------------------------- | ------------------------------------------------------- |
| Provider enum     | `src/features/providerEnum.ts`    | `packages/react-native/src/features/providerEnum.ts`    |
| Provider mappings | `src/features/providerConfig.tsx` | `packages/react-native/src/features/providerConfig.tsx` |
| Model mappings    | `src/features/modelConfig.ts`     | `packages/react-native/src/features/modelConfig.ts`     |
| Agent mappings    | `src/features/agentConfig.ts`     | — (main package only)                                   |

The `static-*` workspace packages (`static-svg`, `static-png`, `static-webp`, `static-avatar`) are generated from icon components and contain no mapping logic — never edit them for a mapping change.

## Matching semantics (they differ!)

- **ProviderIcon**: exact match — `keyword.toLowerCase() === provider`. A keyword like `xai` will NOT match `supergrok`; every provider id needs its own keyword.
- **ModelIcon / AgentIcon**: each keyword is a **case-insensitive RegExp** tested against the model id, and **the first matching entry in the array wins**. Consequences:
  - Substrings match: keyword `gpt-4` matches `chatgpt-4o-latest`.
  - Order matters: put more specific entries before general ones (see how `gpt-oss` sits before the broad OpenAI entry).
  - Regex syntax is live: `^o1`, `/o1`, `o1-` are anchored patterns, and characters like `.` or `+` in a keyword are regex metacharacters — escape or anchor deliberately.

## Provider mapping workflow

1. **Enum** — add to `ModelProvider` in `providerEnum.ts`, alphabetically sorted, value lowercase:
   ```ts
   SuperGrok = 'supergrok',
   ```
2. **Import** — in `providerConfig.tsx`, import the icon (alphabetical order). Main package uses the `@/` alias, RN uses relative paths:
   ```ts
   import Grok from "@/Grok"; // main package
   import Grok from "../icons/Grok"; // react-native package
   ```
3. **Mapping entry** — add to `providerMappings`, near related entries:
   ```ts
   { Icon: Grok, keywords: [ModelProvider.SuperGrok] },
   ```
4. **Repeat 1–3 in the react-native package.** The RN enum is `RNModelProvider` inside its own `providerEnum.ts`; entry shape is identical.

### New entry vs appending a keyword

Two established patterns for derived/subscription providers:

- **Append** to an existing entry when the new provider should look identical to its parent — precedent: `keywords: [ModelProvider.Moonshot, ModelProvider.KimiCodingPlan]`, `[ModelProvider.ZhiPu, ModelProvider.GLMCodingPlan]`.
- **New entry with a different brand icon** when a more recognizable brand exists and visual distinction from the parent provider helps — precedent: `supergrok` → `Grok` icon instead of appending to the `XAI` entry.

Prefer whichever the issue/requester specifies; otherwise pick based on whether users would benefit from telling the two providers apart in a list.

## Verification

```bash
pnpm run ci                                    # oxfmt, oxlint and tsgo over the whole repo
pnpm run test                                  # the contract suite below
```

The contract tests in `tests/contract.test.tsx` are the real check, and they will fail on a half-finished mapping without you having to look for it:

- every `ModelProvider` member must be reachable through `providerMappings` — a new enum member with no mapping entry fails here
- no keyword may appear in two provider entries
- every model and agent keyword must reach its own entry — a new broad keyword that shadows an existing one fails here, and so does a new narrow one hidden behind an existing broad one
- `src/toc.json` must describe the subcomponents each icon actually attaches

Grep is still the quickest completeness check across the two packages:

```bash
grep -rn "supergrok" src packages/react-native/src
```

Expect hits in both enum files and both config files (2×2). For a model or agent keyword, sanity-check the regex in isolation too: `new RegExp(keyword, "i").test(modelId)`. Remember that matching is unanchored and first-match-wins, so a short keyword like `"amp"` claims every id containing those letters — anchor with `(^|/)` and `($|[-_])` unless you mean the substring.

The react-native package type-checks in CI, so `Cannot find module react-native` is no longer expected. Run `pnpm install` first if you see it.

## Commit pitfalls

- `pnpm-lock.yaml` **is committed**. Do not delete it, and do not revert `pnpm-workspace.yaml` — `pnpm install` writing to either is a real change that belongs in the commit. (A previous version of this file said the opposite.)
- The pre-commit hook regenerates `src/toc.json` and stages only that file. A mapping change should touch the 2–4 config files plus, if you added an icon, `src/toc.json`. Check with `git show --stat HEAD`.
- Commit style is gitmoji + conventional: `:sparkles: feat: add Grok icon mapping for supergrok provider`.
