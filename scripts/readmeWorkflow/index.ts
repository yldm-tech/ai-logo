import { consola } from "consola";
import { markdownTable } from "markdown-table";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { toc } from "@/toc";
import type { IconToc } from "@/types/toc";

const ROOT_PATH = resolve(__dirname, "../..");

const BASE_URL = "https://github.com/yldm-tech/ai-logo/tree/main/src/";

const updateReadme = (split: string, md: string, content: string): string => {
  const mds = md.split(split);
  // Blank lines, not spaces. Padding with " " left a trailing space after the opening marker, which
  // remark preserves verbatim because it sits inside an HTML node, so every regeneration produced a
  // one-character diff that no formatter would settle and no freshness check could pass.
  mds[1] = ["", content, ""].join("\n\n");
  return mds.join(split);
};

/** The count in the disclosure summary is generated, so it cannot drift from the table below it. */
const updateBrandCount = (md: string, count: number): string =>
  md.replace(/Show all \d+ brands/, `Show all ${count} brands`);

const genMd = (data: IconToc): string =>
  [
    `<a href="${BASE_URL}${data.id}">`,
    `<picture>`,
    `<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/yldm-tech/ai-logo/refs/heads/main/packages/static-png/dark/${data.param.hasColor ? data.id.toLowerCase() + "-color" : data.id.toLowerCase()}.png" />`,
    `<img height="56px" width="56px" src="https://raw.githubusercontent.com/yldm-tech/ai-logo/refs/heads/main/packages/static-png/light/${data.param.hasColor ? data.id.toLowerCase() + "-color" : data.id.toLowerCase()}.png" />`,
    `</picture>`,
    "<br/>",
    data.fullTitle,
  ].join("");

const run = () => {
  const model = toc
    .filter((item) => item.group === "model")
    .sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));
  const provider = toc
    .filter((item) => item.group === "provider")
    .sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));
  const application = toc
    .filter((item) => item.group === "application")
    .sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));

  const max = Math.max(model.length, provider.length, application.length);

  const table = [
    ["Model", "Provider", "Application"],
    ...Array.from({ length: max }).map((_, index) => [
      model[index] ? genMd(model[index]) : "",
      provider[index] ? genMd(provider[index]) : "",
      application[index] ? genMd(application[index]) : "",
    ]),
  ];

  const rendered = model.length + provider.length + application.length;

  // The table has exactly three columns, so an icon in any other group is dropped without a trace.
  // Reporting toc.length here made that invisible: it always claimed every icon had been written.
  if (rendered !== toc.length) {
    const groups = [...new Set(toc.map((item) => item.group))].join(", ");
    consola.error(
      `${toc.length - rendered} of ${toc.length} icons fall in no rendered column. Columns are model, provider and application; toc uses: ${groups}.`,
    );
    process.exitCode = 1;
    return;
  }

  const contents = markdownTable(table);

  const readmePath = resolve(ROOT_PATH, "README.md");

  const readme = readFileSync(readmePath, "utf8");

  const newReadme = updateBrandCount(
    updateReadme("<!-- ICON LIST -->", readme, contents),
    rendered,
  );

  writeFileSync(readmePath, newReadme, "utf8");

  consola.success(`Add ${rendered} icons to README`);
};

run();
