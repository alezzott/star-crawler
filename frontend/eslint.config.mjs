import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "next/prettier"),
  {
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
      "@tanstack/query": require("@tanstack/eslint-plugin-query"),
    },
    rules: {
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "warn",
      "react/display-name": "off",
      "jsx-a11y/aria-proptypes": "warn",
      "react/no-children-prop": "warn",
    },
  },
];

export default eslintConfig;
