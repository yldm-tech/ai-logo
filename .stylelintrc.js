const config = require("@lobehub/stylelint-config");

module.exports = {
  ...config,
  rules: {
    "custom-property-pattern": null,
    "selector-pseudo-element-no-unknown": null,
    "no-descending-specificity": null,
    ...config.rules,
  },
};
