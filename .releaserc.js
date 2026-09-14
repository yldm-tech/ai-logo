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

const withParserOpts = (plugin) => {
  const [name, options = {}] = Array.isArray(plugin) ? plugin : [plugin, {}];
  if (!name.includes("commit-analyzer") && !name.includes("release-notes-generator")) return plugin;
  const { config: _unusedPreset, ...rest } = options;
  return [name, { ...rest, parserOpts }];
};

module.exports = {
  ...base,
  plugins: base.plugins.map(withParserOpts),
};
