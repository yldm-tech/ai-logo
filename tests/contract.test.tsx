import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import * as icons from "../src/icons";
import AgentIcon from "../src/features/AgentIcon";
import { agentMappings } from "../src/features/agentConfig";
import ModelIcon from "../src/features/ModelIcon";
import { modelMappings } from "../src/features/modelConfig";
import { providerMappings } from "../src/features/providerConfig";
import { ModelProvider } from "../src/features/providerEnum";
import ProviderIcon from "../src/features/ProviderIcon";
import toc from "../src/toc.json";

/**
 * These are contract tests over the three lookup tables and the published toc, not examples.
 * Every one of them exists because the thing it asserts was silently wrong: eight provider ids
 * fell through to the grey default, `ace-step` was unreachable behind `step`, the bare `amp`
 * keyword claimed any id containing those three letters, and toc flags were derived from which
 * files sat in components/ rather than from what index.ts attaches.
 */

/**
 * A model or agent id that should reach this entry, derived from the keyword's own pattern.
 * The keywords are small regexes, so this substitutes the few constructs they use rather than
 * trying to be a general generator — if a new keyword uses something else, its test fails loudly
 * here instead of silently asserting nothing.
 */
const probeFor = (keyword: string) => {
  let probe = keyword
    .replace(/^\(\^\|\/\)/, "")
    .replace(/\(\$\|\[-_]\)$/, "-1")
    .replace(/\(\$\|-\)$/, "-1")
    .replace(/^\^/, "")
    .replace(/\$$/, "");

  // Collapse non-capturing groups innermost first: optional ones vanish, alternations take their first branch.
  for (let pass = 0; pass < 10; pass++) {
    const next = probe
      .replace(/\(\?:([^()]*)\)\?/, (_match, body: string) =>
        body.includes("|") ? body.split("|")[0] : "",
      )
      .replace(/\(\?:([^()]*)\)(?!\?)/, (_match, body: string) => body.split("|")[0]);
    if (next === probe) break;
    probe = next;
  }

  probe = probe
    .replaceAll(String.raw`\d+`, "1")
    .replaceAll(String.raw`\d`, "1")
    .replaceAll(String.raw`\w`, "a")
    .replaceAll(String.raw`\.`, ".");

  if (probe.startsWith("/")) probe = `a${probe}`;
  if (probe.endsWith("/") || probe.endsWith("-")) probe += "x";
  return probe;
};

/** The index of the entry a lookup would actually return, mirroring ModelIcon and AgentIcon. */
const winnerFor = (mappings: { keywords: string[] }[], id: string) =>
  mappings.findIndex((entry) => entry.keywords.some((k) => new RegExp(k, "i").test(id)));

describe("providerMappings covers the ModelProvider enum", () => {
  const covered = new Set(providerMappings.flatMap((entry) => entry.keywords));

  it.each(Object.values(ModelProvider))("%s resolves to a brand icon", (provider) => {
    expect(covered.has(provider)).toBe(true);

    const markup = renderToStaticMarkup(
      <ProviderIcon provider={provider} size={24} type={"mono"} />,
    );
    expect(markup).toMatch(/<title>/);
  });

  it("declares no keyword twice", () => {
    const all = providerMappings.flatMap((entry) => entry.keywords);
    expect(all.filter((k, i) => all.indexOf(k) !== i)).toEqual([]);
  });
});

describe("every mapping entry is reachable", () => {
  it.each(
    modelMappings.flatMap((entry, index) => entry.keywords.map((keyword) => ({ index, keyword }))),
  )("model keyword $keyword reaches its own entry", ({ index, keyword }) => {
    expect(winnerFor(modelMappings, probeFor(keyword))).toBe(index);
  });

  it.each(
    agentMappings.flatMap((entry, index) => entry.keywords.map((keyword) => ({ index, keyword }))),
  )("agent keyword $keyword reaches its own entry", ({ index, keyword }) => {
    expect(winnerFor(agentMappings, probeFor(keyword))).toBe(index);
  });

  it("does not let a short agent keyword swallow an unrelated id", () => {
    const markup = renderToStaticMarkup(<AgentIcon agent={"example"} size={24} type={"mono"} />);
    expect(markup).not.toContain("<title>Amp</title>");
  });

  it("keeps Stepfun ids on Stepfun while freeing ace-step", () => {
    for (const id of ["step-2-16k", "stepfun-ai/step3"]) {
      expect(renderToStaticMarkup(<ModelIcon model={id} type={"mono"} />)).toContain(
        "<title>StepFun</title>",
      );
    }
    expect(renderToStaticMarkup(<ModelIcon model={"ace-step"} type={"mono"} />)).not.toContain(
      "<title>StepFun</title>",
    );
  });
});

describe("toc describes what each icon actually exports", () => {
  const subcomponents = {
    hasAvatar: "Avatar",
    hasBrand: "Brand",
    hasBrandColor: "BrandColor",
    hasColor: "Color",
    hasCombine: "Combine",
    hasText: "Text",
    hasTextCn: "TextCn",
    hasTextColor: "TextColor",
  } as const;

  it("has an entry for every exported icon", () => {
    const exported = Object.keys(icons).sort();
    expect(toc.map((entry) => entry.id).sort()).toEqual(exported);
  });

  it.each(toc)("$id advertises exactly the subcomponents it attaches", (entry) => {
    const Icon = (icons as unknown as Record<string, Record<string, unknown>>)[entry.id];
    const param = entry.param as Record<string, boolean>;

    for (const [flag, name] of Object.entries(subcomponents)) {
      expect({ [flag]: Boolean(param[flag]) }).toEqual({ [flag]: Icon[name] !== undefined });
    }
  });
});
