// .eslintrc.js
module.exports = {
    // Root of your project to avoid ESLint searching parent folders
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020, // Allows modern ECMAScript features
      sourceType: "module", // Allows using import/export statements
      tsconfigRootDir: __dirname, // Tells ESLint where your tsconfig.json is located
      project: ["./tsconfig.json"], // If you're using project-based linting
    },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      // You can add more recommended configs here (e.g. "plugin:react/recommended")
    ],
    rules: {
      // You can modify the default rules or add more here.
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/explicit-function-return-type": "off",
      // ...etc
    },
  };
  