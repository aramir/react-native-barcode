const reactNativeConfig = require('@react-native/eslint-config/flat');

module.exports = [
  { ignores: ["dist", "eslint.config.js"] },
  ...reactNativeConfig,
  {
    rules: {
      "no-shadow": "off",
      "react-hooks/exhaustive-deps": "off",
      "react-native/no-inline-styles": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "quotes": [
        "warn",
        "double"
      ],
      // This is a TypeScript project, not Flow - these rules are irrelevant
      // noise, and eslint-plugin-ft-flow crashes under ESLint 9 regardless
      // (calls the removed context.getAllComments() API).
      "ft-flow/define-flow-type": "off",
      "ft-flow/use-flow-type": "off",
    },
  },
];
