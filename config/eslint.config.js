import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

export default [
    { ignores: ['dist/', '_temp/', 'coverage/'] },
    js.configs.recommended,
    {
        files: ['**/*.vue'],
        plugins: {
            vue,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                parser: tsparser,
            },
        },
        rules: {
            ...vue.configs.recommended.rules,
            'no-console': 'off',
            'no-debugger': 'off',
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            '@typescript-eslint': tseslint,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parser: tsparser,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            // TypeScript already reports undefined identifiers, including DOM types
            'no-undef': 'off',
            'no-console': 'off',
            'no-debugger': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-object-type': 'warn',
        },
    },
    {
        files: ['tests/**/*.{ts,js}'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.vitest,
            },
        },
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            'no-console': 'off',
            'no-debugger': 'off',
        },
    },
];
