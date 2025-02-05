const jsdoc = require("eslint-plugin-jsdoc");

const config = [
  // configuration included in plugin
  jsdoc.configs["flat/recommended"],

  {
    files: ["**/*.js"],
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/require-param-description": "off",
      "jsdoc/check-access": "error",
    },
  },
];

module.exports = config;
