import openWcConfig from '@open-wc/eslint-config';
import prettierConfig from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  ...openWcConfig,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'import-x/no-unresolved': 'off',
      'import-x/extensions': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.yarn/**',
      '.pnp.*',
      '**/*.styles.ts',
      'test-results/**',
      'playwright-report/**',
      'playwright/.cache/**',
      '.parcel-cache/**',
      'work/**',
      'target/**',
    ],
  },
];
