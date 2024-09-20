module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    "no-console": "off",   // Allow console logs for debugging
    "no-unused-vars": "warn",  // Warn instead of error on unused vars
    "node/no-unsupported-features/es-syntax": "off"  // Allow ES Modules
  }
};
