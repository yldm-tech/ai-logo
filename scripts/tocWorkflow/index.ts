import matter from "gray-matter";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { customKebabCase } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "../..");
const srcDir = resolve(rootDir, "src");

const getIconIds = () => {
  const source = readFileSync(resolve(srcDir, "icons.ts"), "utf8");
  return Array.from(source.matchAll(/default as (\w+)/g), (match) => match[1]);
};

// The flags describe what a consumer can reach as `Icon.Avatar`, `Icon.Combine` and so on, so they are read from the
// subcomponents index.ts actually attaches rather than from which files happen to sit in components/. The two disagree
// in both directions: Udio ships a Combine.tsx it never assigns, and Replicate assigns Brand and Text from BrandMono,
// which has no file of either name. Inferring from the filesystem published a wrong contract for 20 of the 323 icons.
const getIconParams = (iconDir: string) => {
  const source = readFileSync(resolve(iconDir, "index.ts"), "utf8");
  const attached = new Set(
    Array.from(source.matchAll(/^\s*Icons\.(\w+)\s*=/gm), (match) => match[1]),
  );
  const has = (name: string) => attached.has(name);

  return {
    hasAvatar: has("Avatar"),
    hasBrand: has("Brand"),
    hasBrandColor: has("BrandColor"),
    hasColor: has("Color"),
    hasCombine: has("Combine"),
    hasText: has("Text"),
    hasTextCn: has("TextCn"),
    hasTextColor: has("TextColor"),
  };
};

const run = async () => {
  const iconIds = getIconIds();
  const list = await Promise.all(
    iconIds.map(async (key) => {
      const iconDir = resolve(srcDir, key);
      const md = readFileSync(resolve(iconDir, "index.mdx"), "utf8");
      const stylePath = resolve(iconDir, "style.ts");
      let styleModule: Record<string, string> = {};

      if (existsSync(stylePath)) {
        styleModule = (await import(pathToFileURL(stylePath).href)) as Record<string, string>;
      }

      const { data } = matter(md);

      return {
        color: styleModule.COLOR_PRIMARY,
        colorGradient: styleModule.COLOR_GRADIENT,
        desc: data?.description,
        docsUrl: customKebabCase(key),
        fullTitle: data?.title,
        group: String(data?.category || data?.group?.title || data?.group).toLowerCase(),
        id: key,
        param: getIconParams(iconDir),
        title: styleModule.TITLE,
      };
    }),
  );

  // Written formatted with a trailing newline so it matches what oxfmt emits. Minified output drifts on every regeneration and fails `vp check` in CI.
  writeFileSync(resolve(rootDir, "src/toc.json"), `${JSON.stringify(list, null, 2)}\n`);
};

run();
