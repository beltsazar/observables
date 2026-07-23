import globals from "globals";
import js from "@eslint/js";
import openWcConfig from "@open-wc/eslint-config";
import storybook from "eslint-plugin-storybook";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
    rules: {
      // allow console.error, but not console.log and console.warn
      "no-console": ["error", { allow: ["error"] }],
    },
  },
  openWcConfig,
  ...storybook.configs["flat/recommended"],
]);
