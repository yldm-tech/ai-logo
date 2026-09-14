/**
 * Checks ai-logo the way a consumer gets it: resolved through node_modules to the built es/index.mjs and es/index.d.mts, not through the repo's `@/` and `ai-logo` tsconfig aliases that point back at src.
 *
 * It runs under vitest because that is how a React app consumes this — through a bundler, with jsdom standing in for the browser. It no longer has to: dropping the @lobehub/ui peer dependency, which pulled in a package with no exports map, made the built output resolvable in bare Node ESM as well.
 */
import { ModelIcon, ProviderIcon, toc } from "@yldm-tech/ai-logo";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import { SAMPLE } from "./icons";

describe("ai-logo, resolved as a dependency", () => {
  it.each(SAMPLE.map(({ Icon, name }) => [name, Icon] as const))(
    "%s renders an svg",
    (_name, Icon) => {
      const html = renderToStaticMarkup(<Icon size={32} />);
      expect(html).toContain("<svg");
      expect(html).toContain("</svg>");
    },
  );

  // Not every brand has every variant — OpenAI is monochrome and has no Color, for one — so the toc's own flags decide what to expect. That makes this a check that the metadata and the exports agree, rather than a guess about either.
  it.each(SAMPLE.map(({ Icon, name }) => [name, Icon] as const))(
    "%s exposes exactly the subcomponents its toc entry advertises",
    (name, Icon) => {
      const entry = toc.find((item) => item.id === name);
      expect(entry, `${name} is missing from toc`).toBeTruthy();

      // The types are per brand — OpenAI's genuinely has no Color — so each variant is reached through an `in` narrowing rather than by indexing the union.
      expect({
        Avatar: "Avatar" in Icon,
        Color: "Color" in Icon,
        Combine: "Combine" in Icon,
        Text: "Text" in Icon,
      }).toEqual({
        Avatar: entry!.param.hasAvatar,
        Color: entry!.param.hasColor,
        Combine: entry!.param.hasCombine,
        Text: entry!.param.hasText,
      });

      if ("Color" in Icon) expect(renderToStaticMarkup(<Icon.Color size={24} />)).toContain("<svg");
      if ("Text" in Icon) expect(renderToStaticMarkup(<Icon.Text size={24} />)).toContain("<svg");
      if ("Avatar" in Icon) expect(renderToStaticMarkup(<Icon.Avatar size={24} />)).toContain("<");
      if ("Combine" in Icon)
        expect(renderToStaticMarkup(<Icon.Combine size={24} />)).toContain("<");
    },
  );

  it("emits gradient ids under this fork's prefix", () => {
    // The de-branding renamed these from lobe-icons-* to ai-logo-*. Consumers see the ids in their own DOM, so this is the end-to-end proof it reached them.
    const GeminiColor = SAMPLE[2].Icon.Color;
    const html = renderToStaticMarkup(<GeminiColor size={32} />);
    expect(html).not.toContain("lobe-icons-");
    expect(html).toContain("ai-logo-");
  });

  it("resolves a provider by string", () => {
    expect(renderToStaticMarkup(<ProviderIcon provider="openai" size={32} />)).toContain("<svg");
  });

  it("resolves a model by string", () => {
    expect(renderToStaticMarkup(<ModelIcon model="gpt-4o" size={32} />)).toContain("<svg");
  });

  it("ships the toc, including this fork's own icon", () => {
    expect(Array.isArray(toc)).toBe(true);
    expect(toc.length).toBeGreaterThan(300);
    expect(toc.some((entry) => entry.id === "EveryAPI")).toBe(true);
  });
});
