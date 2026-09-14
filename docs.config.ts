import { defineDocsConfig } from "@lobehub/docs-kit/src/config";
import type { DocumentationInventory } from "@lobehub/docs-kit/src/types";

import compatibility from "./docs/compatibility.json";

const legacyRedirects = compatibility as DocumentationInventory;

export default defineDocsConfig({
  alias: {
    "@": "src",
    "ai-logo": "src",
  },
  atomDirs: [{ dir: "src", subType: "components", type: "component" }],
  description: "Popular AI / LLM Model Brand SVG Logo and Icon Collection",
  homePage: "./docs/index.tsx",
  legacyRedirects,
  navSections: {},
  publicDocs: [
    "docs/editor/index.mdx",
    "docs/features/model-tag.mdx",
    "docs/features/icon-combine.mdx",
    "docs/features/cdn-utils.mdx",
    "docs/features/provder-icon.mdx",
    "docs/features/model-icon.mdx",
    "docs/features/provider-combine.mdx",
    "docs/features/agent-icon.mdx",
    "docs/features/icon-avatar.mdx",
  ],
  siteUrl: "https://github.com/yldm-tech/ai-logo",
  themeConfig: {
    apiHeader: {
      docUrl: "{github}/edit/main/{atomId}",
      github: "https://github.com/yldm-tech/ai-logo",
      match: ["/components/"],
      packageName: "ai-logo",
      sourceUrl: "{github}/tree/main/{atomId}",
    },
    navItems: [{ href: "/changelog", label: "Changelog" }],
    prefersColor: "dark",
    socialLinks: [
      {
        href: "https://github.com/yldm-tech/ai-logo",
        icon: "github",
        label: "GitHub",
      },
      {
        href: "https://www.npmjs.com/package/ai-logo",
        icon: "npm",
        label: "NPM",
      },
    ],
  },
  title: "AI Logo",
});
