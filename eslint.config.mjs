import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      indent: [
        "error",
        2,
        { SwitchCase: 1 },
      ],

      "linebreak-style": [ "error", "unix" ],

      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      semi: [
        "error",
        "always",
        { omitLastInOneLineBlock: true },
      ],

      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-promise-executor-return": "error",

      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "only-multiline",
          exports: "only-multiline",
          functions: "never",
        },
      ],

      camelcase: "error",
      curly: [ "error", "all" ],

      "new-cap": [
        "error",
        {
          newIsCap: false,
          capIsNew: true,
        },
      ],

      "no-else-return": "error",
      "no-implied-eval": "error",
      "no-lonely-if": "error",
      "no-useless-return": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "error",

      "prefer-arrow-callback": [ "error", { allowNamedFunctions: true } ],

      "one-var-declaration-per-line": [ "error", "initializations" ],

      yoda: [
        "error",
        "never",
        { onlyEquality: true },
      ],

      "sort-vars": [ "error", { ignoreCase: true } ],

      "spaced-comment": [ "error", "always" ],
      "array-bracket-spacing": [ "error", "always" ],

      "array-bracket-newline": [
        "error",
        {
          multiline: true,
          minItems: 3,
        },
      ],

      "array-element-newline": [
        "error",
        {
          minItems: 3,
          multiline: true,
        },
      ],

      "arrow-parens": "error",

      "arrow-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],

      "block-spacing": [ "error", "always" ],
      "brace-style": [ "error", "1tbs" ],

      "comma-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],

      "comma-style": [ "error", "last" ],
      "dot-location": [ "error", "property" ],
      "eol-last": [ "error", "always" ],
      "func-call-spacing": [ "error", "never" ],
      "function-call-argument-newline": [ "error", "consistent" ],
      "function-paren-newline": [ "error", "multiline" ],
      "implicit-arrow-linebreak": [ "error", "beside" ],
      "multiline-ternary": [ "error", "always-multiline" ],
      "new-parens": [ "error", "always" ],
      "no-extra-parens": [ "warn" ],
      "no-multi-spaces": "error",

      "no-multiple-empty-lines": [
        "error",
        {
          max: 4,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],

      "no-trailing-spaces": "error",
      "no-whitespace-before-property": "error",
      "nonblock-statement-body-position": [ "error", "below" ],

      "object-curly-newline": [
        "error",
        {
          multiline: true,
          minProperties: 2,
        },
      ],

      "object-curly-spacing": [ "error", "always" ],
      "object-property-newline": "error",
      "rest-spread-spacing": [ "error", "never" ],

      "semi-spacing": [
        "error",
        {
          before: false,
          after: true,
        },
      ],

      "semi-style": [ "error", "last" ],
      "space-before-blocks": [ "error", "always" ],
      "space-before-function-paren": [ "error", "always" ],
      "space-in-parens": [ "error", "never" ],

      "space-infix-ops": [ "error", { int32Hint: false } ],

      "space-unary-ops": [
        "error",
        {
          words: true,
          nonwords: false,
        },
      ],

      "switch-colon-spacing": [
        "error",
        {
          after: true,
          before: false,
        },
      ],

      "template-curly-spacing": [ "error", "never" ],
      "template-tag-spacing": [ "error", "never" ],
      "wrap-iife": [ "error", "inside" ],

      "yield-star-spacing": [
        "error",
        {
          before: true,
          after: false,
        },
      ],
    },
  }
);
