module.exports = {
  root: true,
  plugins: [
    'react',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    "import/no-extraneous-dependencies": ["off", { "devDependencies": true }],
    "import/prefer-default-export": "off",
    "react/jsx-props-no-spreading": "off",
    "no-console": "off",
    "no-use-before-define": ["error", { "variables": false }],
    "no-else-return": "off",
    "no-nested-ternary": "off",
    "object-curly-spacing": ["error", "always"],
    "no-multi-spaces": ["error"],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-unused-vars": "warn",
    "no-inner-declarations": "warn"

  }
};
