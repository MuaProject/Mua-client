import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';
import { globalIgnores } from 'eslint/config';
import path from 'path';

export default tseslint.config([
  globalIgnores(['dist', 'eslint.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    plugins: {
      import: eslintPluginImport,
    },

    settings: {
      'import/resolver': {
        // tsconfig paths 인식
        typescript: {
          project: './tsconfig.app.json',
        },
        // alias 직접 매핑 (안정성 ↑)
        alias: {
          map: [
            ['@features', path.resolve('./src/features')],
            ['@shared', path.resolve('./src/shared')],
            ['@widgets', path.resolve('./src/widgets')],
            ['@page', path.resolve('./src/page')],
            ['@entities', path.resolve('./src/entities')],
            ['@app', path.resolve('./src/app')],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx'],
        },
      },
    },

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',

      // ✨ 상대경로 오류내줌 절대 경로만 가능하게 함
      'import/no-relative-parent-imports': 'error',

      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_|^args$' },
      ],
    },
  },
]);
