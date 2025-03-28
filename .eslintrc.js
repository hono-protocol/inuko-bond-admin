module.exports = {
  ignorePatterns: [
    "**/node_modules",
    "**/coverage",
    "**/storybook-static",
    "**/public",
    "**/lib",
    "**/dist",
  ],
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "no-console": ["warn", { allow: ["info", "warn", "error"] }],
    "no-plusplus": 0,
    "prefer-destructuring": ["warn", { object: true, array: false }],
    "no-underscore-dangle": 0,
    // Start temporary rules
    // These rules are here just to keep the lint error to 0 during the migration to the new rule set
    // They need to be removed and fixed as soon as possible
    "@typescript-eslint/ban-ts-comment": [
      1,
      { "ts-ignore": false, "ts-nocheck": false },
    ],
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/no-explicit-any": 0,
    radix: 0,
    "import/no-extraneous-dependencies": 0,
    "jsx-a11y/media-has-caption": 0,
    // End temporary rules
  },
};
