import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

// NOSONAR - tseslint.config is flagged as deprecated by SonarQube S1874
// defineConfig from ESLint core does not support named ESM imports in current setup
export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'eslint.config.mjs',
      'vitest.config.ts',
      'tsup.config.ts',
      'prisma.config.ts',
    ],
  },
  ...tseslint.configs.strict,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.eslint.json'],
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
    },
  },
)
