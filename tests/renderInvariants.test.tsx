import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

import Crusoe from "../src/Crusoe";
import CyberCut from "../src/CyberCut";
import AgentIcon from "../src/features/AgentIcon";
import ModelIcon from "../src/features/ModelIcon";
import ProviderCombine from "../src/features/ProviderCombine";
import ProviderIcon from "../src/features/ProviderIcon";
import { ModelProvider } from "../src/features/providerEnum";
import OpenClaw from "../src/OpenClaw";
import Phind from "../src/Phind";
import Rwkv from "../src/Rwkv";
import Together from "../src/Together";

/**
 * What the lookup components must do regardless of whether the id matched. Both of these were wrong
 * in the fallback path only, which is why nothing noticed: the matched path is what every demo and
 * every screenshot exercises.
 */
describe("lookup components behave the same whether or not the id matches", () => {
  const unmatched = "definitely-not-a-brand";

  it.each([
    ["ProviderIcon", <ProviderIcon className={"probe-class"} provider={unmatched} size={24} />],
    ["ModelIcon", <ModelIcon className={"probe-class"} model={unmatched} size={24} />],
    ["AgentIcon", <AgentIcon agent={unmatched} className={"probe-class"} size={24} />],
  ])("%s keeps className when nothing matches", (_name, element) => {
    expect(renderToStaticMarkup(element)).toContain("probe-class");
  });

  it("never puts the type prop on a rendered svg", () => {
    // `type` is meaningful to the Combine components and meaningless to the plain icons. Passing it
    // to every branch put type="mono" on the <svg> for the ten brands that fall through to Text.
    const leaking = Object.values(ModelProvider).filter((provider) =>
      /<svg[^>]*\stype=/.test(
        renderToStaticMarkup(<ProviderCombine provider={provider} size={24} type={"mono"} />),
      ),
    );

    expect(leaking).toEqual([]);
  });
});

describe("svg element ids are namespaced", () => {
  /**
   * These six hardcoded `id="a"` and referenced it as `url(#a)`. Duplicate ids resolve to the first
   * in document order, so rendering two of them on one page silently clipped the second to the
   * other's geometry — and any host page with its own `id="a"` collided too. useFillIds exists for
   * exactly this and 73 other components already used it.
   */
  it("renders every id uniquely when the previously colliding icons share a page", () => {
    const markup = renderToStaticMarkup(
      <div>
        <Phind.Text size={24} />
        <Together.Text size={24} />
        <CyberCut size={24} />
        <OpenClaw size={24} />
        <Crusoe size={24} />
        <Rwkv size={24} />
      </div>,
    );

    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const references = [...markup.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]);

    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    expect(references.filter((reference) => !ids.includes(reference))).toEqual([]);
    expect(ids.every((id) => id.startsWith("ai-logo-"))).toBe(true);
  });
});
