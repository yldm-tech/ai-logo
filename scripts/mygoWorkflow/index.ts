import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const svgSource = resolve(root, "packages/static-svg/icons");
const avatarSource = resolve(root, "packages/static-avatar/avatars");
const mygo = resolve(root, "mygo");
const svgArchive = resolve(mygo, "icons.zip");
const avatarArchive = resolve(mygo, "avatar/avatars.zip");
// `go get` downloads mygo/ alone, so the module carries its own copy of the notices for the marks it ships.
const notices = resolve(root, "THIRD_PARTY_NOTICES.md");
const mygoNotices = resolve(mygo, "THIRD_PARTY_NOTICES.md");

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
    throw new Error(`${label} archive is out of date; run pnpm run build:mygo`);
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

const checkNotices = () => {
  const same =
    existsSync(mygoNotices) && readFileSync(mygoNotices, "utf8") === readFileSync(notices, "utf8");
  if (!same) throw new Error("mygo/THIRD_PARTY_NOTICES.md is out of date; run pnpm run build:mygo");
  console.log("MyGo notices: up to date");
};

const check = process.argv.includes("--check");

if (check) {
  checkArchive(svgArchive, svgSource, "MyGo SVG");
  checkArchive(avatarArchive, avatarSource, "MyGo avatar");
  checkNotices();
} else {
  writeArchive(svgArchive, svgSource);
  writeArchive(avatarArchive, avatarSource);
  copyFileSync(notices, mygoNotices);
  checkArchive(svgArchive, svgSource, "MyGo SVG");
  checkArchive(avatarArchive, avatarSource, "MyGo avatar");
  checkNotices();
}
