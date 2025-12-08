import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ignores: ["dist/", ".astro/"],
    rules: {},
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  ...eslintPluginAstro.configs["jsx-a11y-strict"],
  {
    ignores: ["dist/", ".astro/", ".netlify/"],
  },
];
