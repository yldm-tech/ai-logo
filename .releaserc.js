// This one needs `.default` while its four siblings do not: @lobehub/semantic-release-config also exports `options` as a named export, so its CJS bundle is an ES module namespace rather than a bare `module.exports = config`.
module.exports = require("@lobehub/semantic-release-config").default;
