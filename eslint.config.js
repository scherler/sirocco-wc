const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['bin/*.js', 'scripts/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...require('globals').node },
    },
  },
  {
    // Templates are scaffolding payloads with their own toolchains, not code
    // this repository lints or type-checks.
    ignores: ['bin/template/**', 'bin/showcase-template/**', 'node_modules/**'],
  },
];
