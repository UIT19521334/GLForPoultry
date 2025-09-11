module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'import',
    'prettier',
  ],
  extends: [
    'airbnb-typescript-prettier',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "interface",
        "format": ["PascalCase"],
        "custom": {
          "regex": "^I[A-Z]",
          "match": true,
        },
      },
    ],
    "no-console": "off",
    "no-use-before-define": ["error", { "variables": false }],
    "import/no-cycle": "off",
    "no-else-return": "off", // Tắt rule này để không báo lỗi else-return nữa
    "no-nested-ternary": "off", // Tắt rule không cho phép nested ternary
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto",
        "trailingComma": "all",
        "bracketSpacing": true,
        "singleQuote": true,
        "printWidth": 80,
        "bracketSameLine": false,
      },
    ],
    "object-curly-spacing": ["error", "always"],
    "no-multi-spaces": ["error"],
    "react/prop-types": "off", // Tắt kiểm tra prop-types cho project TS
    "react/react-in-jsx-scope": "off", // Không cần import React với React 17+
    "@typescript-eslint/no-unused-vars": "off",
    "prefixWithI": "always"
  },
};
