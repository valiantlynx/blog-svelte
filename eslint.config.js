import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import sveltePlugin from 'eslint-plugin-svelte';
import js from '@eslint/js';

export default [
	js.configs.recommended,
	{
		ignores: ['**/pocketbase/**', '**/pnpm-lock.yaml', '**/dist/**', '**/build/**']
	},
	{
		files: ['**/*.svelte'],
		lenguaje: 'svelte',
		plugins: { svelte: sveltePlugin },
		processor: 'svelte/svelte',
		rules: {
			'svelte/html-closing-bracket-newline': [
				'error',
				{
					singleline: 'never',
					multiline: 'never'
				}
			],
			'svelte/html-closing-bracket-spacing': [
				'error',
				{
					startTag: 'never',
					selfClosingTag: 'never',
					endTag: 'never'
				}
			],
			'svelte/prefer-sveltekit-props': 'error',
			'svelte/no-at-html-tags-in-script': 'error'
		}
	},
	{
		files: ['**/*.{ts,svelte}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				ecmaVersion: 2022,
				sourceType: 'module'
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/consistent-type-imports': 'error'
		}
	},
	{
		rules: {
			'no-console': 'warn',
			eqeqeq: ['error', 'smart'],
			'prefer-const': 'error',
			'no-unused-expressions': 'error',
			'no-debugger': 'error',
			'no-empty': ['error', { allowEmptyCatch: true }],
			'no-irregular-whitespace': 'error',
			'no-lonely-if': 'error',
			'no-redeclare': 'error',
			'no-sequences': 'error',
			noShadow: 'off',
			'@typescript-eslint/no-shadow': ['error'],
			'default-case': 'error',
			'default-case-last': 'error',
			'block-spacing': ['error', 'always'],
			'brace-style': ['error', '1tbs', { allowSingleLine: false }],
			'comma-spacing': ['error', { before: false, after: true }],
			'computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
			'func-call-spacing': ['error', 'never'],
			'key-spacing': ['error', { beforeColon: false, afterColon: true }],
			'keyword-spacing': ['error', { before: true, after: true }],
			'no-multi-spaces': ['error', { exceptions: { Property: true } }],
			'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
			'no-unsafe-finally': 'error',
			'no-wrap-func': 'error',
			'object-curly-spacing': ['error', 'always'],
			'space-before-blocks': ['error', 'always'],
			'space-infix-ops': 'error',
			'space-unary-ops': ['error', { words: true, nonwords: false }],
			semi: ['error', 'never'],
			'semi-spacing': ['error', { before: false, after: true }],
			'space-before-function-paren': ['error', 'never'],
			'arrow-spacing': ['error', { before: true, after: true }],
			'arrow-body-style': ['error', 'as-needed'],
			'no-confusing-arrow': ['error', { allowParens: true }],
			'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }]
		}
	},
	prettierConfig
];
