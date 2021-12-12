module.exports = {
  parser: "babel-eslint",
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  extends: [
    //   'prettier',
    //   'prettier/react',
    //   'eslint:recommended',
    "plugin:prettier/recommended",
  ],
  plugins: ["flowtype"],
  rules: {
    "no-console": 0,
    "react/jsx-filename-extension": 0,
    "react/prefer-stateless-function": 0,
    "react/prop-types": 0,
    "react/jsx-props-no-spreading": 0,
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "flowtype/define-flow-type": 2,
  },
};
