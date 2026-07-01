import js from "@eslint/js";
import globals from "globals";
import openWcConfig from "@open-wc/eslint-config";
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
]);
