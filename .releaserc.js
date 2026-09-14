const preset = require("@lobehub/semantic-release-config");

const base = preset.default || preset;

/**
 * The commit convention here is gitmoji: `:sparkles: feat(scope): subject`.
 *
 * @lobehub/semantic-release-config wires that up through `conventional-changelog-gitmoji-config`,
 * which has not been touched since 2023 and still speaks the pre-v6
 * conventional-commits-parser API. semantic-release 25 ships commit-analyzer 13,
 * which requires conventional-commits-parser ^6, so loading the preset throws
 * before a single commit is read:
 *
 *   Failed step "analyzeCommits" of plugin "@semantic-release/commit-analyzer"
 *   TypeError: ((intermediate value) || (intermediate value)) is not a function
 *
 * The preset was only ever supplying a header pattern, so it is inlined here
 * instead. `:\w+:` covers shortcodes and `\p{Extended_Pictographic}` covers the
 * literal emoji both forms of the convention allow.
 */
const parserOpts = {
  headerCorrespondence: ["type", "scope", "subject"],
  headerPattern: /^(?::\w+:|\p{Extended_Pictographic}️?)\s*(\w+)(?:\(([^)]*)\))?!?:\s*(.+)$/u,
};

/**
 * Dropping the preset also drops the writer half of it, and the fallback writer is
 * conventional-changelog-angular, which renders only `feat`, `fix` and `perf`. Seven
 * commit types cut a release here, so `:hammer: build:` or `:art: style:` used to
 * publish a version whose notes were empty — v1.2.4 in CHANGELOG.md is one of those.
 *
 * conventionalcommits is the maintained preset that does speak the v6 parser API, and
 * it takes the section list as plain config, so the types that cut releases get
 * headings and the ones that never do stay hidden. It is a direct devDependency rather
 * than a hoisted transitive one: this config is loaded by name at release time, and
 * that is exactly how the last two release outages happened.
 */
const types = [
  { section: "Features", type: "feat" },
  { section: "Bug Fixes", type: "fix" },
  { section: "Performance", type: "perf" },
  { section: "Styles", type: "style" },
  { section: "Refactoring", type: "refactor" },
  { section: "Build", type: "build" },
  { section: "Documentation", type: "docs" },
  { hidden: true, type: "test" },
  { hidden: true, type: "ci" },
  { hidden: true, type: "chore" },
  { hidden: true, type: "wip" },
];

const withInlineConvention = (plugin) => {
  const [name, options = {}] = Array.isArray(plugin) ? plugin : [plugin, {}];
  const isAnalyzer = name.includes("commit-analyzer");
  const isNotes = name.includes("release-notes-generator");
  if (!isAnalyzer && !isNotes) return plugin;
  const { config: _brokenGitmojiPreset, ...rest } = options;
  if (isAnalyzer) return [name, { ...rest, parserOpts }];
  return [name, { ...rest, parserOpts, preset: "conventionalcommits", presetConfig: { types } }];
};

module.exports = {
  ...base,
  plugins: base.plugins.map(withInlineConvention),
};
