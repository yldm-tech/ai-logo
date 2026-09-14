import { describe, expect, it } from "vite-plus/test";

import { getLobeIconCDN } from "../src/features/getLobeIconCDN";

/**
 * This is a pure function with three hosts, four formats, a light/dark split and a mono special
 * case, and it is the only shipped code that hands a consumer a URL. It had no coverage while
 * every one of those URLs pointed at another project's repository and npm scope.
 */
describe("getLobeIconCDN", () => {
  it("defaults to the GitHub host, png, colour, light", () => {
    expect(getLobeIconCDN("OpenAI")).toBe(
      "https://raw.githubusercontent.com/yldm-tech/ai-logo/refs/heads/main/packages/static-png/light/openai-color.png",
    );
  });

  it.each(["github", "unpkg", "aliyun"] as const)("serves %s from this project", (cdn) => {
    const url = getLobeIconCDN("OpenAI", { cdn });

    expect(url).not.toContain("lobehub");
    expect(url).toMatch(/yldm-tech/);
  });

  it("points the npm-backed hosts at the package the release workflow publishes", () => {
    expect(getLobeIconCDN("OpenAI", { cdn: "unpkg", format: "svg" })).toBe(
      "https://unpkg.com/@yldm-tech/ai-logo-static-svg@latest/icons/openai-color.svg",
    );
    expect(getLobeIconCDN("OpenAI", { cdn: "aliyun", format: "svg" })).toBe(
      "https://registry.npmmirror.com/@yldm-tech/ai-logo-static-svg/latest/files/icons/openai-color.svg",
    );
  });

  it("lowercases the id without inserting separators", () => {
    expect(getLobeIconCDN("ClaudeCode", { format: "svg" })).toContain(
      "/icons/claudecode-color.svg",
    );
    expect(getLobeIconCDN("AlibabaCloud", { format: "svg" })).toContain(
      "/icons/alibabacloud-color.svg",
    );
  });

  it("drops the suffix for mono and keeps it for every other type", () => {
    expect(getLobeIconCDN("OpenAI", { format: "svg", type: "mono" })).toContain(
      "/icons/openai.svg",
    );
    expect(getLobeIconCDN("OpenAI", { format: "svg", type: "text-color" })).toContain(
      "/icons/openai-text-color.svg",
    );
  });

  it("splits png and webp by colour scheme", () => {
    expect(getLobeIconCDN("OpenAI", { format: "png", isDarkMode: true })).toContain(
      "/dark/openai-color.png",
    );
    expect(getLobeIconCDN("OpenAI", { format: "webp" })).toContain("/light/openai-color.webp");
    expect(getLobeIconCDN("OpenAI", { format: "webp", isDarkMode: true })).toContain(
      "/dark/openai-color.webp",
    );
  });

  it("ignores type and colour scheme for avatars", () => {
    expect(
      getLobeIconCDN("OpenAI", { format: "avatar", isDarkMode: true, type: "text" }),
    ).toContain("/avatars/openai.webp");
  });
});
