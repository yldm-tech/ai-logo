import { readFileSync } from "node:fs";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";
import { globSync } from "glob";

import pkg from "../package.json";
import { ModelTag, ProviderCombine } from "../src";
import { tint } from "../src/features/ModelTag/style";

/**
 * antd used to be a peer of this package: ModelTag rendered antd's Tag, ProviderCombine drew antd's Divider, and antd-style — a runtime dependency — declared antd as its own required peer, so installing the icons asked for antd whether or not a consumer rendered either component. These pin that it stays gone, and that the stand-ins render what antd's default theme did.
 */
describe("the package does not depend on antd", () => {
  it("declares neither antd nor antd-style", () => {
    const declared = [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
      ...Object.keys((pkg as { peerDependenciesMeta?: object }).peerDependenciesMeta ?? {}),
    ];

    expect(declared.filter((name) => /^(antd|antd-style|@ant-design\/)/.test(name))).toEqual([]);
  });

  it("imports neither from src", () => {
    const offenders = globSync("src/**/*.{ts,tsx}").filter((file) =>
      /from\s+["'](antd|antd-style|@ant-design\/[^"']*)["']/.test(readFileSync(file, "utf8")),
    );

    expect(offenders).toEqual([]);
  });
});

const render = (element: React.ReactElement) => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  act(() => root.render(element));
  return { host, unmount: () => act(() => root.unmount()) };
};

describe("ModelTag", () => {
  it("renders antd's default filled tag: icon, then the model in its own span", () => {
    const { host, unmount } = render(<ModelTag model={"gpt-4o"} />);
    const tag = host.firstElementChild as HTMLElement;

    expect(tag.tagName).toBe("SPAN");
    expect(tag.style.backgroundColor).toBe("rgb(245, 245, 245)");
    expect(tag.style.borderColor).toBe("transparent");
    expect(tag.style.fontSize).toBe("12px");
    expect(tag.style.lineHeight).toBe("20px");
    expect(tag.style.padding).toBe("0px 7px");

    const [icon, text] = [...tag.children] as HTMLElement[];
    expect(icon.tagName.toLowerCase()).toBe("svg");
    expect(icon.style.verticalAlign).toBe("middle");
    expect(text.textContent).toBe("gpt-4o");
    expect(text.style.marginInlineStart).toBe("7px");
    unmount();
  });

  it("leaves the fallback glyph and the text unspaced, as antd's stylesheet did", () => {
    const { host, unmount } = render(<ModelTag model={"definitely-not-a-model"} />);
    const [icon, text] = [...host.firstElementChild!.children] as HTMLElement[];

    expect(icon.tagName).toBe("SPAN");
    expect(icon.style.verticalAlign).toBe("");
    expect(text.style.marginInlineStart).toBe("");
    unmount();
  });

  it.each([
    [{ color: "blue" }, { backgroundColor: "rgb(230, 244, 255)", color: "rgb(9, 88, 217)" }],
    [
      { color: "success", variant: "outlined" as const },
      {
        backgroundColor: "rgb(246, 255, 237)",
        borderColor: "rgb(183, 235, 143)",
        color: "rgb(82, 196, 26)",
      },
    ],
    [{ color: "#f50" }, { backgroundColor: "rgb(255, 238, 229)", color: "rgb(255, 85, 0)" }],
    [
      { color: "red-inverse" },
      { backgroundColor: "rgb(245, 34, 45)", color: "rgb(255, 255, 255)" },
    ],
    [
      { variant: "solid" as const },
      { backgroundColor: "rgb(0, 0, 0)", color: "rgb(255, 255, 255)" },
    ],
    [{ variant: "outlined" as const }, { borderColor: "rgb(217, 217, 217)" }],
    [
      { color: "blue", disabled: true },
      { backgroundColor: "rgba(0, 0, 0, 0.04)", color: "rgba(0, 0, 0, 0.25)" },
    ],
  ])("keeps antd's colour props: %j", (props, expected) => {
    const { host, unmount } = render(<ModelTag model={"gpt-4o"} {...props} />);
    const tag = host.firstElementChild as HTMLElement;

    for (const [key, value] of Object.entries(expected)) {
      expect(tag.style[key as "color"]).toBe(value);
    }
    unmount();
  });

  it("renders an anchor for href and drops the link when disabled", () => {
    expect(renderToStaticMarkup(<ModelTag href={"/m"} model={"gpt-4o"} />)).toMatch(
      /^<a href="\/m"/,
    );
    expect(renderToStaticMarkup(<ModelTag disabled href={"/m"} model={"gpt-4o"} />)).toMatch(
      /^<a aria-disabled="true"/,
    );
  });

  it("closes, and lets onClose cancel it", () => {
    let calls = 0;
    const { host, unmount } = render(
      <>
        <ModelTag closable model={"gpt-4o"} onClose={() => calls++} />
        <ModelTag closable model={"claude"} onClose={(e) => e.preventDefault()} />
      </>,
    );
    const [first, second] = [...host.children] as HTMLElement[];

    act(() => (first.querySelector("[role=button]") as HTMLElement).click());
    act(() => (second.querySelector("[role=button]") as HTMLElement).click());

    expect(calls).toBe(1);
    expect(first.style.display).toBe("none");
    expect(second.style.display).toBe("inline-block");
    unmount();
  });

  it.each([
    [{}, false],
    [{ closable: true }, true],
    [{ closeIcon: <i /> }, true],
    [{ closable: false, closeIcon: <i /> }, false],
    [{ closable: true, closeIcon: null }, true],
  ])("shows the close button the way antd decides it: %j", (props, shown) => {
    const markup = renderToStaticMarkup(<ModelTag model={"gpt-4o"} {...props} />);

    expect(markup.includes('role="button"')).toBe(shown);
  });

  it("applies semantic classNames and styles, as objects or functions", () => {
    const markup = renderToStaticMarkup(
      <ModelTag
        classNames={{ content: "c", root: "r" }}
        model={"gpt-4o"}
        styles={() => ({ icon: { opacity: 0.5 } })}
      />,
    );

    expect(markup).toMatch(/^<span class="r"/);
    expect(markup).toContain('<span class="c"');
    expect(markup).toContain("opacity:0.5");
  });
});

describe("tint", () => {
  // Expected values are what antd 6's FastColor produces for a custom tag colour.
  it.each([
    ["#f50", "#ffeee5"],
    ["#ff5500", "#ffeee5"],
    ["#87d068", "#f0f9ec"],
    ["#108ee9", "#e7f4fd"],
    ["#2db7f5", "#e7f6fe"],
    ["#abc", "#eff2f5"],
    ["#888", "#f2f2f2"],
    ["#1677ff80", "#e5f0ff80"],
  ])("%s becomes %s", (color, expected) => {
    expect(tint(color)).toBe(expected);
  });

  it("leaves other colour syntaxes to the browser", () => {
    expect(tint("rebeccapurple")).toBe("hsl(from rebeccapurple h s 95%)");
  });
});

describe("ProviderCombine", () => {
  it("separates the two marks with antd's vertical divider", () => {
    // Azure's combineMultiple is 0.9, so the Combine gets 21.6px and the divider's inline margin is a sixth of that.
    const markup = renderToStaticMarkup(<ProviderCombine provider={"azure"} size={24} />);

    expect(markup).toContain(
      '<div role="separator" style="border-inline-start:1px solid var(--ant-color-split, rgba(5, 5, 5, 0.06));box-sizing:border-box;display:inline-block;font-size:14px;height:0.9em;margin-block:0;margin-inline:3.6px;position:relative;top:-0.06em;vertical-align:middle"></div>',
    );
  });
});
