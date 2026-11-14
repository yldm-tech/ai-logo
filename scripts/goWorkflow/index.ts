import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const svgSource = resolve(root, "packages/static-svg/icons");
const avatarSource = resolve(root, "packages/static-avatar/avatars");

// Each Go module embeds its own copy: go:embed cannot reach files outside the module's directory, so the framework modules cannot share one archive.
const MODULES = [
  { dir: "mygo", label: "MyGo" },
  { dir: "nsgo", label: "NSGo" },
] as const;

const listArchive = (archive: string): string[] => {
  if (!existsSync(archive)) return [];
  return execFileSync("unzip", ["-Z1", archive], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
};

const sourceNames = (directory: string): string[] =>
  readdirSync(directory)
    .filter((name) => name.endsWith(".svg") || name.endsWith(".webp"))
    .sort();

const checkArchive = (archive: string, source: string, label: string) => {
  const expected = sourceNames(source);
  const actual = listArchive(archive);
  if (expected.join("\n") !== actual.join("\n")) {
    throw new Error(`${label} archive is out of date; run pnpm run build:go`);
  }
  console.log(`${label}: ${expected.length} assets`);
};

const writeArchive = (archive: string, source: string) => {
  mkdirSync(resolve(archive, ".."), { recursive: true });
  rmSync(archive, { force: true });
  const files = sourceNames(source);
  if (files.length === 0) throw new Error(`No assets found in ${source}`);
  // -j keeps the archive paths stable (`openai.svg`, not an absolute workspace path).
  execFileSync("zip", ["-X", "-q", "-9", "-j", archive, ...files], {
    cwd: source,
    stdio: "inherit",
  });
};

const check = process.argv.includes("--check");

for (const { dir, label } of MODULES) {
  const svgArchive = resolve(root, dir, "icons.zip");
  const avatarArchive = resolve(root, dir, "avatar/avatars.zip");
  if (!check) {
    writeArchive(svgArchive, svgSource);
    writeArchive(avatarArchive, avatarSource);
  }
  checkArchive(svgArchive, svgSource, `${label} SVG`);
  checkArchive(avatarArchive, avatarSource, `${label} avatar`);
}
