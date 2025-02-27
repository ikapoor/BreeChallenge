// eslint.config.js
import eslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist", "node_modules"], // Folders to ignore
  },
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply these settings/rules to TS files
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },,
    plugins: {
      "@typescript-eslint": eslintPlugin,
    },
    rules: {
      // Example rules from the TypeScript ESLint plugin
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
];
