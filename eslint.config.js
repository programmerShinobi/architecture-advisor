import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

// Flat config (ESLint 10) — migrated 1:1 from the old .eslintrc.cjs: same rule set
// (js + typescript-eslint + react-hooks recommended, react-refresh for HMR safety),
// same ignore scope (build output, config files, and the dependency-free guard scripts).
export default defineConfig([
  globalIgnores(['dist', 'node_modules', '*.config.js', '*.config.ts', 'scripts', 'eslint.config.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
